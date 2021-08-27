import { UsecaseContext } from "..";
import {
  IAssetAmount,
  TransactionStatus,
  Network,
  Chain,
} from "../../entities";
import {
  InterchainApi,
  ExecutableTransaction,
  SifchainInterchainTx,
  InterchainParams,
  IBCInterchainTx,
} from "./_InterchainApi";
import { SifchainChain, CosmoshubChain } from "../../services/ChainsService";
import { isBroadcastTxFailure } from "@cosmjs/stargate";
import { findAttribute, parseRawLog, Log } from "@cosmjs/stargate/build/logs";
import { createIteratorSubject } from "../../utils/iteratorSubject";

import { IBCTransferSubscriber } from "./utils";

export class CosmosSifchainInterchainApi
  implements InterchainApi<IBCInterchainTx> {
  subscriber = IBCTransferSubscriber(this.context);
  constructor(public context: UsecaseContext) {}

  async estimateFees(params: InterchainParams) {
    return params.toChain.calculateTransferFeeToChain(params.assetAmount);
  }

  transfer(params: InterchainParams) {
    console.log("transfer", params.fromChain, params.toChain);
    return new ExecutableTransaction(async (emit) => {
      emit({ type: "signing" });
      try {
        const txSequence = await this.context.services.ibc.transferIBCTokens({
          sourceNetwork: params.fromChain.network,
          destinationNetwork: params.toChain.network,
          assetAmountToTransfer: params.assetAmount,
        });
        for (let tx of txSequence) {
          if (isBroadcastTxFailure(tx)) {
            this.context.services.bus.dispatch({
              type: "ErrorEvent",
              payload: {
                message: "IBC Transfer Failed",
              },
            });
            emit({
              type: "tx_error",
              tx: {
                state: tx.rawLog?.includes("out of gas")
                  ? "out_of_gas"
                  : "failed",
                memo: tx.rawLog || "",
                hash: tx.transactionHash,
              },
            });
            return;
          } else {
            const logs = parseRawLog(tx.rawLog);
            emit({
              type: "sent",
              tx: { state: "completed", hash: tx.transactionHash },
            });

            return {
              ...params,
              fromChain: params.fromChain,
              toChain: params.toChain,
              hash: tx.transactionHash,
              meta: { logs },
            } as IBCInterchainTx;
          }
        }
      } catch (err) {
        // "signing_error"?
        console.error(err);
        emit({ type: "approve_error" });
        return;
      }
    });
  }

  async *subscribeToTransfer(
    tx: IBCInterchainTx,
  ): AsyncGenerator<TransactionStatus> {
    for await (const ev of this.subscriber.subscribe(tx)) {
      yield ev;
    }
  }
}