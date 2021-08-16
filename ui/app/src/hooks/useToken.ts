import { useCore } from "./useCore";
import { computed, Ref } from "vue";
import { getUnpeggedSymbol } from "@/componentsLegacy/shared/utils";
import {
  AssetAmount,
  Network,
  IAsset,
  IAssetAmount,
  TransactionStatus,
} from "@sifchain/sdk";
import { getNetworkBalances } from "./useWallet";
import { isLikeSymbol } from "@/utils/symbol";

export type TokenListItem = {
  amount: IAssetAmount;
  asset: IAsset;
  importTxs: {
    network: Network;
    tx: TransactionStatus;
  }[];
  supported: boolean;
};

export const useTokenList = (
  props: {
    networks?: Ref<Network[]>;
  } = {},
) => {
  const { store, config, usecases } = useCore();

  const pendingPegTxList = computed(() => {
    if (
      !store.wallet.eth.address ||
      !store.tx.eth ||
      !store.tx.eth[store.wallet.eth.address]
    )
      return [];

    const txs = store.tx.eth[store.wallet.eth.address];

    const txKeys = Object.keys(txs);

    const list: TransactionStatus[] = [];
    for (const key of txKeys) {
      const txStatus = txs[key];

      // Are only interested in pending txs with a symbol
      if (!txStatus.symbol || txStatus.state !== "accepted") continue;

      list.push(txStatus);
    }

    return list;
  });

  const txMatchesUnpegSymbol = (pegAssetSymbol: string) => (
    txStatus: TransactionStatus,
  ) => {
    return (
      txStatus.symbol?.toLowerCase() ===
      getUnpeggedSymbol(pegAssetSymbol.toLowerCase()).toLowerCase()
    );
  };

  function getIsSupportedNetwork(asset: IAsset): boolean {
    if (asset.network === "ethereum") {
      return usecases.wallet.eth.isSupportedNetwork();
    }

    if (asset.network === "sifchain") {
      return true; // TODO: Handle the case of whether the network is supported
    }
    return false;
  }

  const tokenList = computed<TokenListItem[]>(() => {
    const pegList = pendingPegTxList.value;

    const networksSet = new Set(props.networks?.value || []);

    return config.assets
      .filter((asset: IAsset) => {
        if (!networksSet.size) return true;
        return networksSet.has(asset.network);
      })
      .map((asset: IAsset) => {
        const balances = getNetworkBalances(store, asset.network);

        const amount = balances?.find(({ asset: { symbol, ibcDenom } }) => {
          return asset.symbol.toLowerCase() === symbol.toLowerCase();
        });

        // Get pegTxs for asset
        const ethereumImportTransactions = pegList
          ? pegList.filter(txMatchesUnpegSymbol(asset.symbol))
          : [];

        // Is the asset from a supported network
        // TODO(ajoslin): remove
        const supported = getIsSupportedNetwork(asset);
        return {
          amount: !amount ? AssetAmount(asset, "0") : amount,
          asset,
          importTxs: ethereumImportTransactions.map((tx) => ({
            network: Network.ETHEREUM,
            tx,
          })),
          supported,
        };
      })
      .sort((a, b) => {
        if (a.asset.symbol === config.nativeAsset.symbol) return -1;
        if (b.asset.symbol === config.nativeAsset.symbol) return 1;
        return a.asset.symbol.localeCompare(b.asset.symbol);
      });
  });

  return tokenList;
};

export const useToken = (params: {
  network: Ref<Network>;
  symbol: Ref<string>;
}) => {
  const tokenListRef = useTokenList();

  return computed(() => {
    return tokenListRef.value?.find((token) => {
      return (
        token.asset.network === params.network.value &&
        isLikeSymbol(token.asset.symbol, params.symbol.value)
      );
    });
  });
};