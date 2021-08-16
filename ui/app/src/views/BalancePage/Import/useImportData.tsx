import { RouteLocationRaw, useRouter } from "vue-router";
import { computed, ref, Ref } from "vue";
import { TokenIcon } from "@/components/TokenIcon";
import { useToken, useTokenList } from "@/hooks/useToken";
import { formatAssetAmount } from "@/componentsLegacy/shared/utils";
import { Network, AssetAmount, toBaseUnits } from "@sifchain/sdk";
import { Button } from "@/components/Button/Button";
import { rootStore } from "@/store";
import { usePegEventDetails } from "@/hooks/useTransactionDetails";
import { ImportDraft } from "@/store/modules/import";
import { accountStore } from "@/store/modules/accounts";
import { PegEvent } from "../../../../../core/src/usecases/peg/peg";
import { useBoundRoute } from "@/hooks/useBoundRoute";
import { isLikeSymbol } from "@sifchain/sdk/src/utils/isLikeSymbol";

export type ImportStep = "select" | "confirm" | "processing";

export function getImportLocation(
  step: ImportStep,
  params: Partial<ImportDraft & { txHash?: string }>,
): RouteLocationRaw {
  return {
    name:
      step === "select"
        ? "Import"
        : step === "confirm"
        ? "ConfirmImport"
        : "ProcessingImport",
    params: {
      displaySymbol: params.symbol || "",
    },
    query: {
      network: params.network || "",
      amount: params.amount || "",
    },
  };
}

export const useImportData = () => {
  const router = useRouter();
  const importStore = rootStore.import;
  const importDraft = importStore.refs.draft.computed();

  useBoundRoute({
    params: {
      displaySymbol: computed({
        get: () => importStore.state.draft.symbol,
        set: (v) => importStore.setDraft({ symbol: v }),
      }),
    },
    query: {
      network: computed({
        get: () => importStore.state.draft.network,
        set: (v) => importStore.setDraft({ network: v }),
      }),
      amount: computed({
        get: () => importStore.state.draft.amount,
        set: (v) => importStore.setDraft({ amount: v }),
      }),
    },
  });

  const exitImport = () => {
    router.replace({ name: "Balances" });
  };

  const chainsRef = importStore.refs.chains.computed();
  const networksRef = computed(() => chainsRef.value.map((c) => c.network));
  // const chainsRef1 = importStore.computed((store) => store.getters.networks);
  // const chainsRef2 = importStore.refs.networks.computed()

  const tokenListRef = useTokenList({
    networks: networksRef,
  });

  const tokenRef = useToken({
    network: computed(() => importDraft.value.network),
    symbol: computed(() => importDraft.value.symbol),
  });

  const computedImportAssetAmount = computed(() => {
    if (!tokenRef.value?.asset) return null;

    return AssetAmount(
      tokenRef.value?.asset || "rowan",
      toBaseUnits(
        importDraft.value.amount?.trim() || "0.0",
        tokenRef.value?.asset,
      ),
    );
  });

  const nativeToken = useToken({
    network: ref(Network.SIFCHAIN),
    symbol: computed(() => importDraft.value.symbol),
  });

  const pickableTokensRef = computed(() => {
    return tokenListRef.value.filter((token) => {
      return token.asset.network === importDraft.value.network;
    });
  });

  const pegEventRef = importStore.refs.draft.pegEvent.computed();

  const pegEventDetails = usePegEventDetails({
    pegEvent: pegEventRef as Ref<PegEvent>,
  });

  const sifchainBalance = computed(() => nativeToken.value?.amount);

  const detailsRef = computed<[any, any][]>(() => [
    [
      "Current Sifchain Balance",
      <span class="flex items-center font-mono">
        {sifchainBalance.value ? (
          <>
            {formatAssetAmount(sifchainBalance.value)}{" "}
            {sifchainBalance.value?.asset.displaySymbol.toUpperCase()}
            <TokenIcon
              size={18}
              assetValue={sifchainBalance.value?.asset}
              class="ml-[4px]"
            />
          </>
        ) : (
          "0"
        )}
      </span>,
    ],
    [
      "Direction",
      <span class="capitalize">
        {importDraft.value.network}
        <span
          class="mx-[6px] inline-block"
          style={{ transform: "translateY(-1px)" }}
        >
          ⟶
        </span>
        Sifchain
      </span>,
    ],
    [
      "Import Amount",
      <span class="flex items-center font-mono">
        {importDraft.value.amount}{" "}
        {tokenRef.value?.asset.displaySymbol.toUpperCase()}
        <TokenIcon
          size={18}
          assetValue={tokenRef.value?.asset}
          class="ml-[4px]"
        />
      </span>,
    ],
    [
      <>
        New Sifchain Balance
        <Button.InlineHelp>Estimated amount</Button.InlineHelp>
      </>,
      <span class="flex items-center font-mono">
        {sifchainBalance.value && computedImportAssetAmount.value ? (
          <>
            {formatAssetAmount(
              AssetAmount(
                sifchainBalance.value.asset,
                sifchainBalance.value.add(
                  computedImportAssetAmount.value.amount,
                ),
              ),
            )}{" "}
            {(sifchainBalance.value?.asset.displaySymbol || "").toUpperCase()}{" "}
            <TokenIcon
              size={18}
              assetValue={sifchainBalance.value.asset}
              class="ml-[4px]"
            />
          </>
        ) : (
          !!computedImportAssetAmount.value &&
          formatAssetAmount(computedImportAssetAmount.value)
        )}
      </span>,
    ],
  ]);

  return {
    importDraft,
    chainsRef,
    networksRef,
    pickableTokensRef,
    tokenRef,
    computedImportAssetAmount,
    runImport: () =>
      computedImportAssetAmount.value &&
      importStore.runImport({
        assetAmount: computedImportAssetAmount.value,
      }),
    pegEventRef: importStore.refs.draft.pegEvent.computed(),
    exitImport: exitImport,
    detailsRef,
    pegEventDetails,
  };
};