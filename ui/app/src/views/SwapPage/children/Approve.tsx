import { Form, FormDetailsType } from "@/components/Form";
import Modal from "@/components/Modal";
import { TokenIcon } from "@/components/TokenIcon";
import { defineComponent, computed, watchEffect, onMounted } from "vue";
import { useSwapPageData } from "../useSwapPageData";
import TransactionDetailsModal from "@/components/TransactionDetailsModal";
import { useTransactionDetails } from "@/hooks/useTransactionDetails";
import { propsToAttrMap } from "@vue/shared";

export const ApproveSwap = defineComponent({
  setup() {
    const data = useSwapPageData();

    onMounted(() => {
      data.handleBeginSwap();
    });

    const detailsRef = computed<FormDetailsType>(() => ({
      label: "Swapping",
      details: [
        [
          <div class="flex items-center">
            {data.fromAsset.value && (
              <TokenIcon asset={data.fromAsset} size={18}></TokenIcon>
            )}
            <span class="ml-[4px]">
              {(
                data.fromAsset.value.displaySymbol ||
                data.fromAsset.value.symbol ||
                ""
              ).toUpperCase()}
            </span>
          </div>,
          <span class="font-mono">{data.fromAmount.value}</span>,
        ],
        [
          <div class="flex items-center">
            {data.toAsset.value && (
              <TokenIcon asset={data.toAsset} size={18}></TokenIcon>
            )}
            <span class="ml-[4px]">
              {(
                data.toAsset?.value?.displaySymbol ||
                data.toAsset.value?.symbol ||
                ""
              ).toUpperCase()}
            </span>
          </div>,
          <span class="font-mono">{data.toAmount.value}</span>,
        ],
      ],
    }));

    const transactionDetails = useTransactionDetails({
      tx: data.txStatus,
    });
    watchEffect(() => {
      console.log(transactionDetails.value, data.txStatus.value);
    });

    return () => {
      return (
        <TransactionDetailsModal
          icon="navigation/swap"
          onClose={data.requestTransactionModalClose}
          details={detailsRef}
          transactionDetails={transactionDetails}
        />
      );
    };
  },
});