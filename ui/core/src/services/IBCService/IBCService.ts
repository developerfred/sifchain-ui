import {
  BroadcastTxFailure,
  SigningStargateClient,
  StargateClient,
  defaultRegistryTypes,
  defaultGasLimits,
  MsgTransferEncodeObject,
  BroadcastTxResponse,
  isBroadcastTxFailure,
  IndexedTx,
} from "@cosmjs/stargate";
import { OfflineSigner } from "@cosmjs/proto-signing";

import { IBCChainConfig } from "./IBCChainConfig";
import {
  Amount,
  Asset,
  AssetAmount,
  IAssetAmount,
  Network,
  IAsset,
  getChainsService,
} from "../../entities";
import { loadConnectionByChainIds } from "./loadConnectionByChainIds";
import getKeplrProvider from "../SifService/getKeplrProvider";
import { IWalletService } from "../IWalletService";
import { findAttribute, parseRawLog } from "@cosmjs/stargate/build/logs";
import {
  QueryClient,
  setupBankExtension,
  setupIbcExtension,
  setupAuthExtension,
  createProtobufRpcClient,
} from "@cosmjs/stargate/build/queries";
import {
  BroadcastTxCommitResponse,
  BroadcastTxParams,
  BroadcastTxSyncResponse,
  Tendermint34Client,
} from "@cosmjs/tendermint-rpc";
import { QueryClientImpl } from "@cosmjs/stargate/build/codec/cosmos/distribution/v1beta1/query";
import { ValueOp } from "@cosmjs/stargate/build/codec/tendermint/crypto/proof";
import { setupMintExtension } from "@cosmjs/launchpad";
import { QueryDenomTraceResponse } from "@cosmjs/stargate/build/codec/ibc/applications/transfer/v1/query";
import { getNetworkEnv, NetworkEnv } from "../../config/getEnv";
import { chainConfigByNetworkEnv } from "../../config/ibc-chains";
import { fetch } from "cross-fetch";
import { DirectSecp256k1HdWallet, Registry } from "@cosmjs/proto-signing";
import * as IbcTransferV1Tx from "@cosmjs/stargate/build/codec/ibc/applications/transfer/v1/tx";
import Long from "long";
import JSBI from "jsbi";
import { calculateGasForIBCTransfer } from "./utils/calculateGasForIBCTransfer";
import { Tx } from "@cosmjs/stargate/build/codec/cosmos/tx/v1beta1/tx";
import {} from "@cosmjs/stargate";
export interface IBCServiceContext {
  // applicationNetworkEnvironment: NetworkEnv;
  assets: Asset[];
  ibcChainConfigsByNetwork: Record<Network, IBCChainConfig | null>;
}

export class IBCService {
  networkDenomLookup: Record<Network, Record<string, string>> = {
    ethereum: {},
    cosmoshub: {},
    sifchain: {},
    iris: {},
    akash: {},
  };
  symbolLookup: Record<string, string> = {};

  constructor(private context: IBCServiceContext) {}
  static create(context: IBCServiceContext) {
    return new this(context);
  }

  public loadChainConfigByChainId(chainId: string): IBCChainConfig {
    // @ts-ignore
    const chainConfig = Object.values(
      this.context.ibcChainConfigsByNetwork,
    ).find((c) => c?.chainId === chainId);
    if (!chainConfig) {
      throw new Error(`No chain config for network ${chainId}`);
    }
    return chainConfig;
  }
  public loadChainConfigByNetwork(network: Network): IBCChainConfig {
    // @ts-ignore
    const chainConfig = this.context.ibcChainConfigsByNetwork[network];
    if (!chainConfig) {
      throw new Error(`No chain config for network ${network}`);
    }
    return chainConfig;
  }

  async extractTransferMetadataFromTx(tx: IndexedTx | BroadcastTxResponse) {
    const logs = parseRawLog(tx.rawLog);
    const sequence = findAttribute(logs, "send_packet", "packet_sequence")
      .value;
    const dstChannel = findAttribute(logs, "send_packet", "packet_dst_channel")
      .value;
    const dstPort = findAttribute(logs, "send_packet", "packet_dst_port").value;
    const packet = findAttribute(logs, "send_packet", "packet_data").value;
    const timeoutTimestampNanoseconds = findAttribute(
      logs,
      "send_packet",
      "packet_timeout_timestamp",
    ).value;
    return {
      sequence,
      dstChannel,
      dstPort,
      packet,
      timeoutTimestampNanoseconds,
    };
  }

  async checkIfPacketReceivedByTx(
    txOrTxHash: string | IndexedTx | BroadcastTxResponse,
    destinationNetwork: Network,
  ) {
    const sourceChain = this.loadChainConfigByNetwork(destinationNetwork);
    const client = await StargateClient.connect(sourceChain.rpcUrl);
    const tx =
      typeof txOrTxHash === "string"
        ? await client.getTx(txOrTxHash)
        : txOrTxHash;
    if (typeof tx !== "object" || tx === null)
      throw new Error("invalid txOrTxHash. not found");
    const meta = await this.extractTransferMetadataFromTx(tx);
    return this.checkIfPacketReceived(
      destinationNetwork,
      meta.dstChannel,
      meta.dstPort,
      meta.sequence,
    );
  }

  async checkIfPacketReceived(
    network: Network,
    receivingChannelId: string,
    receivingPort: string,
    sequence: string | number,
  ) {
    const res: {
      received: boolean;
      proof: null | string;
      proof_height: {
        revision_number: string;
        revision_height: string;
      };
    } = await fetch(
      `${
        this.loadChainConfigByNetwork(network).restUrl
      }/ibc/core/channel/v1beta1/channels/${receivingChannelId}/ports/${receivingPort}/packet_receipts/${sequence}`,
    ).then((r) => r.json());
    return res.received;
  }

  async loadQueryClientByNetwork(network: Network) {
    const destChainConfig = await this.loadChainConfigByNetwork(network);
    const tendermintClient = await Tendermint34Client.connect(
      destChainConfig.rpcUrl,
    );
    const queryClient = QueryClient.withExtensions(
      tendermintClient,
      setupIbcExtension,
      setupBankExtension,
      setupAuthExtension,
    );

    return queryClient;
  }

  async getIBCDenom(asset: IAsset) {
    const queryClient = await this.loadQueryClientByNetwork(Network.COSMOSHUB);
    const allChannels = await queryClient.ibc.channel.allChannels();
  }

  async logIBCNetworkMetadata(destinationNetwork: Network) {
    const wallet = await this.createWalletByNetwork(destinationNetwork);
    const queryClient = await this.loadQueryClientByNetwork(destinationNetwork);

    const allChannels = await queryClient.ibc.channel.allChannels();
    const clients = await Promise.all(
      allChannels.channels.map(async (channel) => {
        const parsedClientState = await fetch(
          `${
            this.loadChainConfigByNetwork(destinationNetwork).restUrl
          }/ibc/core/connection/v1beta1/connections/${
            channel.connectionHops[0]
          }/client_state`,
        ).then((r) => r.json());

        // console.log(parsedClientState);
        // const allAcks = await queryClient.ibc.channel.allPacketAcknowledgements(
        //   channel.portId,
        //   channel.channelId,
        // );

        return {
          chainId:
            parsedClientState.identified_client_state.client_state.chain_id,
          // ackCount: allAcks.acknowledgements.length,
          connection: channel.connectionHops[0],
          channelId: channel.channelId,
          counterpartyChannelId: channel.counterparty?.channelId,
        };
      }),
    );
    console.log(destinationNetwork.toUpperCase());
    console.table(
      clients.filter((c) => {
        return true;
      }),
    );
    const allCxns = await Promise.all(
      (await queryClient.ibc.connection.allConnections()).connections.map(
        async (cxn) => {
          return {
            cxn,
          };
        },
      ),
    );
    console.log({ destinationNetwork, allChannels, allCxns, clients });
  }

  async createWalletByNetwork(network: Network) {
    const keplr = await getKeplrProvider();
    const sourceChain = this.loadChainConfigByNetwork(network);
    await keplr?.experimentalSuggestChain(sourceChain.keplrChainInfo);
    await keplr?.enable(sourceChain.chainId);
    const sendingSigner = await keplr?.getOfflineSigner(sourceChain.chainId);
    if (!sendingSigner)
      throw new Error("No sending signer for " + sourceChain.chainId);
    const stargate = await SigningStargateClient?.connectWithSigner(
      sourceChain.rpcUrl,
      sendingSigner,
      {
        gasLimits: {
          send: 80000,
          ibcTransfer: 120000,
          delegate: 250000,
          undelegate: 250000,
          redelegate: 250000,
          // The gas multiplication per rewards.
          withdrawRewards: 140000,
          govVote: 250000,
        },
      },
    );

    const addresses = (await sendingSigner.getAccounts()).map(
      (acc) => acc.address,
    );
    const balances = await this.getAllBalances({
      client: stargate,
      network,
      address: addresses[0],
    });

    return {
      client: stargate,
      addresses,
      balances,
    };
  }

  async getAllBalances(params: {
    network: Network;
    client: StargateClient;
    address: string;
  }) {
    const sourceChain = this.loadChainConfigByNetwork(params.network);
    const queryClient = await this.loadQueryClientByNetwork(params.network);
    const balances = await params.client.getAllBalances(params.address);
    const assetAmounts: IAssetAmount[] = [];

    for (let balance of balances) {
      try {
        let symbol = balance.denom;
        let denomTrace: QueryDenomTraceResponse | null = null;
        if (balance.denom.startsWith("ibc/")) {
          denomTrace = await queryClient.ibc.transfer.denomTrace(
            balance.denom.split("/")[1],
          );
          symbol = denomTrace.denomTrace?.baseDenom ?? symbol;
          this.networkDenomLookup[sourceChain.network as Network][symbol] =
            balance.denom;
          this.symbolLookup[balance.denom] = symbol;
        }

        let asset = getChainsService()
          ?.get(params.network)
          .assets.find((a) => a.symbol === symbol);

        if (asset && balance.denom.startsWith("ibc/")) {
          asset.ibcDenom = balance.denom;
        }
        const assetAmount = AssetAmount(asset || symbol, balance?.amount);
        assetAmounts.push(assetAmount);
      } catch (e) {
        console.error(e);
      }
    }

    return assetAmounts;
  }

  async transferIBCTokens(
    params: {
      sourceNetwork: Network;
      destinationNetwork: Network;
      assetAmountToTransfer: IAssetAmount;
    },
    // Load testing options
    {
      maxMsgsPerBatch = 800,
      maxAmountPerMsg = `9223372036854775807`,
      gasPerBatch = undefined,
      loadOfflineSigner = (
        chainId: string,
      ): Promise<OfflineSigner | undefined> | undefined =>
        getKeplrProvider().then((keplr) => keplr?.getOfflineSigner(chainId)),
    } = {},
  ): Promise<BroadcastTxResponse[]> {
    const sourceChain = this.loadChainConfigByNetwork(params.sourceNetwork);
    const destinationChain = this.loadChainConfigByNetwork(
      params.destinationNetwork,
    );
    console.log({ sourceChain, destinationChain });
    const keplr = await getKeplrProvider();
    await keplr?.experimentalSuggestChain(sourceChain.keplrChainInfo);
    await keplr?.experimentalSuggestChain(destinationChain.keplrChainInfo);
    await keplr?.enable(destinationChain.chainId);
    const recievingSigner = await loadOfflineSigner(destinationChain.chainId);
    if (!recievingSigner) throw new Error("No recieving signer");
    const [toAccount] = (await recievingSigner?.getAccounts()) || [];
    if (!toAccount) throw new Error("No account found for recieving signer");

    await keplr?.enable(sourceChain.chainId);
    const sendingSigner = await loadOfflineSigner(sourceChain.chainId);
    if (!sendingSigner) throw new Error("No sending signer");

    console.log(
      `${params.sourceNetwork}/${await sendingSigner
        .getAccounts()
        .then(([a]) => a.address)} -> ${
        params.destinationNetwork
      }/${await recievingSigner.getAccounts().then(([a]) => a.address)}`,
    );
    const [fromAccount] = (await sendingSigner?.getAccounts()) || [];
    if (!fromAccount) {
      throw new Error("No account found for sending signer");
    }

    const receivingStargateCient = await SigningStargateClient?.connectWithSigner(
      destinationChain.rpcUrl,
      recievingSigner,
      {
        gasLimits: {
          send: 80000,
          transfer: 250000,
          delegate: 250000,
          undelegate: 250000,
          redelegate: 250000,
          // The gas multiplication per rewards.
          withdrawRewards: 140000,
          govVote: 250000,
        },
      },
    );

    const sendingStargateClient = await SigningStargateClient?.connectWithSigner(
      sourceChain.rpcUrl,
      sendingSigner,
      {
        gasLimits: {
          send: 80000,
          transfer: 250000,
          delegate: 250000,
          undelegate: 250000,
          redelegate: 250000,
          // The gas multiplication per rewards.
          withdrawRewards: 140000,
          govVote: 250000,
        },
      },
    );

    const { channelId } = await loadConnectionByChainIds({
      sourceChainId: sourceChain.chainId,
      counterpartyChainId: destinationChain.chainId,
    });

    const symbol = params.assetAmountToTransfer.asset.symbol;

    // initially set low
    const timeoutInMinutes = 5;
    const timeoutTimestampInSeconds = Math.floor(
      Date.now() / 1000 + 60 * timeoutInMinutes,
    );
    const timeoutTimestampNanoseconds = timeoutTimestampInSeconds
      ? Long.fromNumber(timeoutTimestampInSeconds).multiply(1_000_000_000)
      : undefined;
    // const currentHeight = await receivingStargateCient.getHeight();
    // const timeoutHeight = Long.fromNumber(currentHeight + 600);
    const transferMsg: MsgTransferEncodeObject = {
      typeUrl: "/ibc.applications.transfer.v1.MsgTransfer",
      value: IbcTransferV1Tx.MsgTransfer.fromPartial({
        sourcePort: "transfer",
        sourceChannel: channelId,
        sender: fromAccount.address,
        receiver: toAccount.address,
        token: {
          denom:
            this.networkDenomLookup[sourceChain.network as Network][symbol] ||
            symbol,
          // denom: symbol,
          amount: params.assetAmountToTransfer.toBigInt().toString(),
        },
        timeoutHeight: {
          // revisionHeight: timeoutHeight,
        },
        timeoutTimestamp: timeoutTimestampNanoseconds, // timeoutTimestampNanoseconds,
      }),
    };
    let transferMsgs: MsgTransferEncodeObject[] = [transferMsg];
    while (
      JSBI.greaterThanOrEqual(
        JSBI.BigInt(transferMsgs[0].value.token?.amount || "0"),
        // Max uint64
        JSBI.BigInt(maxAmountPerMsg),
      )
    ) {
      transferMsgs = [...transferMsgs, ...transferMsgs].map((tfMsg) => {
        return {
          ...tfMsg,
          value: {
            ...tfMsg.value,
            token: {
              denom: tfMsg.value.token?.denom as string,
              amount: JSBI.divide(
                JSBI.BigInt(tfMsg.value.token?.amount || "0"),
                JSBI.BigInt("2"),
              ).toString(),
            },
          },
        };
      });
    }

    const batches = [];
    while (transferMsgs.length) {
      batches.push(transferMsgs.splice(0, maxMsgsPerBatch));
    }
    console.log({ batches });
    const responses: BroadcastTxResponse[] = [];
    for (let batch of batches) {
      console.log("transfer msg count", batch.length);

      try {
        // const gasPerMessage = 39437;
        // const gasPerMessage = 39437;
        console.log(JSON.stringify(batch));
        const brdcstTxRes = await sendingStargateClient.signAndBroadcast(
          fromAccount.address,
          batch,
          {
            ...sendingStargateClient.fees.transfer,
            amount: [
              {
                denom: sourceChain.keplrChainInfo.feeCurrencies[0].coinDenom.toLowerCase(),
                amount:
                  sourceChain.keplrChainInfo.gasPriceStep?.average.toString() ||
                  "",
              },
            ],
            gas: gasPerBatch || calculateGasForIBCTransfer(batch.length),
          },
        );
        console.log({ brdcstTxRes });
        responses.push(brdcstTxRes);
      } catch (e) {
        responses.push({
          code:
            +e.message.split("code ").pop().split(" ")[0] || 100000000000000000,
          log: e.message,
          rawLog: e.message,
          transactionHash: "invalidtx",
          hash: new Uint8Array(),
          events: [],
          height: -1,
        } as BroadcastTxResponse);
      }
    }
    console.log({ responses });
    return responses;
  }
}

export default function createIBCService(context: IBCServiceContext) {
  return IBCService.create(context);
}
