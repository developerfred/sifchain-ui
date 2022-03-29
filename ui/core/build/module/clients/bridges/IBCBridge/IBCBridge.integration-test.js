var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
import { IBCBridge } from "./IBCBridge";
import { AssetAmount } from "../../../entities";
import { SifchainChain, AkashChain } from "../../../clients/chains";
import { getSdkConfig } from "../../../utils/getSdkConfig";
import { NetworkEnv } from "../../../config/getEnv";
import { DirectSecp256k1HdWalletProvider } from "../../wallets/cosmos/DirectSecp256k1HdWalletProvider";
import { toBaseUnits } from "../../../utils";
import { Random, Bip39 } from "@cosmjs/crypto";
import { runRowanFaucet, runAkashFaucet } from "./testFaucets";
import { AKASH_TESTNET } from "../../../config/chains/akash/akash-testnet";
import { SIFCHAIN_TESTNET } from "../../../config/chains/sifchain/sifchain-testnet";
const createMnemonic = (length = 24) => {
  const entropyLength = 4 * Math.floor((11 * length) / 33);
  const entropy = Random.getBytes(entropyLength);
  const mnemonic = Bip39.encode(entropy);
  return mnemonic;
};
let setup = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    const config = getSdkConfig({
      environment: NetworkEnv.TESTNET,
    });
    const bridge = new IBCBridge(config);
    // @ts-ignore
    SIFCHAIN_TESTNET.keplrChainInfo.gasPriceStep = {
      low: "2500000000000000000",
      medium: "2500000000000000000",
      high: "2500000000000000000",
    };
    const chains = {
      native: new SifchainChain({
        assets: config.assets,
        chainConfig: SIFCHAIN_TESTNET,
      }),
      counterparty: new AkashChain({
        assets: config.assets,
        chainConfig: AKASH_TESTNET,
      }),
    };
    const wallet = new DirectSecp256k1HdWalletProvider(config, {
      mnemonic: createMnemonic().toString(),
    });
    const nativeAddress = yield wallet.connect(chains.native);
    const counterpartyAddress = yield wallet.connect(chains.counterparty);
    console.log({ nativeAddress, counterpartyAddress });
    try {
      yield Promise.all([
        runRowanFaucet(nativeAddress),
        runAkashFaucet(counterpartyAddress),
      ]);
    } catch (error) {
      console.error(error);
    }
    console.log(
      (yield wallet.fetchBalances(chains.native, nativeAddress)).map((s) =>
        s.toString(),
      ),
    );
    console.log(
      (yield wallet.fetchBalances(
        chains.counterparty,
        counterpartyAddress,
      )).map((s) => s.toString()),
    );
    return { bridge, chains, wallet, nativeAddress, counterpartyAddress };
  });
describe("IBCBridge", () => {
  let setupPromise;
  beforeAll(() =>
    __awaiter(void 0, void 0, void 0, function* () {
      setupPromise = setup();
    }),
  );
  test("it transfers into sifchain", () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const { wallet, chains, bridge, nativeAddress, counterpartyAddress } =
        yield setupPromise;
      const counterpartyAsset = chains.counterparty.lookupAssetOrThrow(
        chains.counterparty.chainConfig.nativeAssetSymbol,
      );
      const decimalAmount = toBaseUnits("0.001", counterpartyAsset);
      const importParams = {
        fromChain: chains.counterparty,
        toChain: chains.native,
        assetAmount: AssetAmount(counterpartyAsset, decimalAmount),
        fromAddress: counterpartyAddress,
        toAddress: nativeAddress,
      };
      const nativeBalanceOfCounterAsset = yield wallet.fetchBalance(
        chains.native,
        nativeAddress,
        chains.counterparty.chainConfig.nativeAssetSymbol,
      );
      expect(+nativeBalanceOfCounterAsset.amount.toBigInt().toString()).toEqual(
        0,
      );
      const bridgeTx = yield bridge.transfer(wallet, importParams);
      expect(bridgeTx.assetAmount.toString()).toEqual(
        importParams.assetAmount.toString(),
      );
      expect(bridgeTx.fromChain).toBe(importParams.fromChain);
      expect(bridgeTx.toChain).toBe(importParams.toChain);
      const result = yield bridge.waitForTransferComplete(wallet, bridgeTx);
      expect(result).toEqual(true);
      const newCounterpartyNativeBalance = yield wallet.fetchBalance(
        chains.native,
        nativeAddress,
        chains.counterparty.chainConfig.nativeAssetSymbol,
      );
      expect(newCounterpartyNativeBalance.toBigInt().toString()).toEqual(
        decimalAmount,
      );
    }));
  test("it transfers out of sifchain", () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const { wallet, chains, bridge, nativeAddress, counterpartyAddress } =
        yield setupPromise;
      const nativeBalanceOfCounterAsset = yield wallet.fetchBalance(
        chains.native,
        nativeAddress,
        chains.counterparty.chainConfig.nativeAssetSymbol,
      );
      const decimalAmount = nativeBalanceOfCounterAsset.toBigInt().toString();
      const exportParams = {
        fromChain: chains.native,
        toChain: chains.counterparty,
        assetAmount: nativeBalanceOfCounterAsset,
        fromAddress: nativeAddress,
        toAddress: counterpartyAddress,
      };
      const counterpartyBalance = yield wallet.fetchBalance(
        chains.counterparty,
        counterpartyAddress,
        chains.counterparty.chainConfig.nativeAssetSymbol,
      );
      const bridgeTx = yield bridge.transfer(wallet, exportParams);
      expect(bridgeTx.assetAmount.toString()).toEqual(
        exportParams.assetAmount.toString(),
      );
      expect(bridgeTx.fromChain).toBe(exportParams.fromChain);
      expect(bridgeTx.toChain).toBe(exportParams.toChain);
      const result = yield bridge.waitForTransferComplete(wallet, bridgeTx);
      expect(result).toEqual(true);
      const newNativeCounterpartyBalance = yield wallet.fetchBalance(
        chains.native,
        nativeAddress,
        chains.counterparty.chainConfig.nativeAssetSymbol,
      );
      const newCounterpartyBalance = yield wallet.fetchBalance(
        chains.counterparty,
        counterpartyAddress,
        chains.counterparty.chainConfig.nativeAssetSymbol,
      );
      expect(
        newNativeCounterpartyBalance.toBigInt().toString().charAt(0),
      ).toEqual("0");
      expect(newCounterpartyBalance.toString()).toEqual(
        counterpartyBalance.add(decimalAmount).toString(),
      );
    }));
});
//# sourceMappingURL=IBCBridge.integration-test.js.map