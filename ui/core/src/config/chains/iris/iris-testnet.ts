import { Network, IBCChainConfig } from "../../../entities";

export const IRIS_TESTNET: IBCChainConfig = {
  chainType: "ibc",
  displayName: "IRISNet",
  blockExplorerUrl: "https://nyancat.iobscan.io/",
  nativeAssetSymbol: "unyan",
  network: Network.IRIS,
  chainId: "nyancat-9",
  rpcUrl: "https://proxies.sifchain.finance/api/nyancat-9/rpc",
  restUrl: "https://proxies.sifchain.finance/api/nyancat-9/rest",
  keplrChainInfo: {
    rpc: "https://proxies.sifchain.finance/api/nyancat-9/rpc",
    rest: "https://proxies.sifchain.finance/api/nyancat-9/rest",
    chainId: "nyancat-9",
    chainName: "Iris Testnet",
    stakeCurrency: {
      coinDenom: "NYAN",
      coinMinimalDenom: "unyan",
      coinDecimals: 6,
      coinGeckoId: "iris",
    },
    walletUrl: "https://wallet.keplr.app/#/iris/stake",
    walletUrlForStaking: "https://wallet.keplr.app/#/iris/stake",
    bip44: {
      coinType: 566,
    },
    bech32Config: {
      bech32PrefixAccAddr: "iaa",
      bech32PrefixAccPub: "iaapub",
      bech32PrefixValAddr: "iaavaloper",
      bech32PrefixValPub: "iaavaloperpub",
      bech32PrefixConsAddr: "iaavalcons",
      bech32PrefixConsPub: "iaavalconspub",
    },
    currencies: [
      {
        coinDenom: "NYAN",
        coinMinimalDenom: "unyan",
        coinDecimals: 6,
        coinGeckoId: "iris",
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "NYAN",
        coinMinimalDenom: "unyan",
        coinDecimals: 6,
        coinGeckoId: "iris",
      },
    ],
    coinType: 556,
    features: ["stargate", "ibc-transfer"],
  },
};
