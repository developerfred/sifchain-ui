import { defineComponent, ref, computed, PropType, Ref, proxyRefs } from "vue";
import Modal from "@/components/Modal";
import AssetIcon, { IconName } from "@/components/AssetIcon";
import { formatAssetAmount } from "@/componentsLegacy/shared/utils";
import { Network } from "@sifchain/sdk";
import {
  SelectDropdown,
  SelectDropdownOption,
} from "@/components/SelectDropdown";
import { useCore } from "@/hooks/useCore";
import { TokenIcon } from "@/components/TokenIcon";
import { format } from "@sifchain/sdk/src/utils/format";
import { getMaxAmount } from "@/views/utils/getMaxAmount";
import { Input } from "@/components/Input/Input";
import { Button } from "@/components/Button/Button";
import { ImportData, getImportLocation } from "./useImportData";
import { TokenSelectDropdown } from "@/components/TokenSelectDropdown";
import { useAppWalletPicker } from "@/hooks/useAppWalletPicker";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "ImportSelect",
  props: {
    importData: {
      type: Object as PropType<ImportData>,
      required: true,
    },
  },
  setup(props) {
    const { store } = useCore();
    const appWalletPicker = useAppWalletPicker();

    const selectIsOpen = ref(false);

    const {
      importParams,
      networksRef,
      importTokenRef,
      importAmountRef,
    } = props.importData;
    const router = useRouter();

    const handleSetMax = () => {
      if (importTokenRef.value) {
        const maxAmount = getMaxAmount(
          { value: importTokenRef.value.asset.symbol } as Ref,
          importTokenRef.value.amount,
        );

        if (importParams.amount)
          importParams.amount.value = format(
            maxAmount,
            importTokenRef.value.asset,
            {
              mantissa: importTokenRef.value.asset.decimals,
              trimMantissa: true,
            },
          );
      }
    };

    const validationErrorRef = computed(() => {
      if (!importTokenRef.value) {
        return "Select Token";
      }
      if (!importAmountRef.value) {
        return "Enter Amount";
      }
      if (importAmountRef.value?.lessThanOrEqual("0.0")) {
        return "Enter Amount";
      }
      if (importTokenRef.value.amount.lessThan(importAmountRef.value)) {
        return "Amount Too Large";
      }
    });

    const buttonRef = computed(() => {
      const buttons = [
        {
          condition: !store.wallet.sif.isConnected,
          name: "Connect Sifchain Wallet",
          icon: "interactive/arrows-in" as IconName,
          props: {
            disabled: false,
            onClick: () => appWalletPicker.show(),
          },
        },
        {
          condition:
            importParams.network?.value === Network.ETHEREUM &&
            !store.wallet.eth.isConnected,
          name: "Connect Ethereum Wallet",
          icon: "interactive/arrows-in" as IconName,
          props: {
            onClick: () => appWalletPicker.show(),
          },
        },
        {
          condition: true,
          name: validationErrorRef.value || "Import",
          icon: null,
          props: {
            disabled: !!validationErrorRef.value,
            onClick: () => {
              router.replace(
                getImportLocation("confirm", proxyRefs(importParams)),
              );
            },
          },
        },
      ];
      return buttons.find((item) => item.condition) || buttons[0];
    });

    const optionsRef = computed<SelectDropdownOption[]>(() =>
      networksRef.value?.map((network) => ({
        content: <div class="capitalize">{network}</div>,
        value: network,
      })),
    );
    const networkOpenRef = ref(false);

    return () => (
      <Modal
        heading="Import Token to Sifchain"
        icon="interactive/arrow-down"
        onClose={props.importData.exitImport}
        showClose
      >
        <section class="bg-gray-base p-4 rounded">
          <div class="w-full">
            <div class="flex w-full">
              <div class="block flex-1 mr-[5px]">
                Network
                <SelectDropdown
                  options={optionsRef}
                  value={importParams.network}
                  onChangeValue={(value) => {
                    console.log("onChangeValue", value);
                    if (importParams.network)
                      importParams.network.value = value as Network;
                  }}
                  tooltipProps={{
                    onShow: () => {
                      networkOpenRef.value = true;
                    },
                    onHide: () => {
                      networkOpenRef.value = false;
                    },
                  }}
                >
                  <Button.Select
                    class="w-full relative capitalize pl-[16px] mt-[10px]"
                    active={networkOpenRef.value}
                  >
                    {importParams.network.value}
                  </Button.Select>
                </SelectDropdown>
              </div>
              <div class="block flex-1 ml-[5px]">
                Token
                <Button.Select
                  class="w-full mt-[10px]"
                  active={selectIsOpen.value}
                  onClick={(e) => {
                    e.stopPropagation();
                    selectIsOpen.value = !selectIsOpen.value;
                  }}
                >
                  <div class="flex justify-between items-center">
                    <TokenIcon
                      size={38}
                      assetValue={importTokenRef.value?.asset}
                    ></TokenIcon>
                    <div class="font-sans ml-[8px] text-[18px] font-medium text-white uppercase">
                      {importTokenRef.value?.asset?.displaySymbol ||
                        importTokenRef.value?.asset?.symbol}
                    </div>
                  </div>
                </Button.Select>
              </div>
            </div>

            <TokenSelectDropdown
              sortBy="balance"
              network={importParams.network}
              onCloseIntent={() => {
                selectIsOpen.value = false;
              }}
              onSelectAsset={(asset) => {
                selectIsOpen.value = false;
                importParams.displaySymbol.value =
                  asset.displaySymbol || asset.symbol;
              }}
              active={selectIsOpen}
            />
          </div>

          <div class="h-[40px] flex items-end justify-end">
            {!!importTokenRef.value && (
              <span
                class="text-base opacity-50 hover:text-accent-base cursor-pointer"
                onClick={handleSetMax}
              >
                Balance: {formatAssetAmount(importTokenRef.value?.amount)}
              </span>
            )}
          </div>

          <Input.Base
            type="number"
            min="0"
            style={{
              textAlign: "right",
            }}
            startContent={
              !!importTokenRef.value && (
                <Button.Pill class="z-[1]" onClick={handleSetMax}>
                  MAX
                </Button.Pill>
              )
            }
            onInput={(e) => {
              const value = (e.target as HTMLInputElement).value;
              if (isNaN(parseFloat(value))) {
                importParams.amount.value = "";
              } else {
                importParams.amount.value = value;
              }
            }}
            value={importParams.amount.value}
          />
        </section>

        <section class="bg-gray-base p-4 rounded mt-[10px]">
          <div class="text-white">Sifchain Recipient Address</div>
          <div class="relative border h-[54px] rounded border-solid border-gray-input_outline focus-within:border-white bg-gray-input mt-[10px]">
            <input
              readonly
              value={store.wallet.sif.address}
              class="absolute top-0 left-0 w-full h-full bg-transparent p-[16px] font-mono outline-none text-md"
              onClick={(e) => {
                (e.target as HTMLInputElement).setSelectionRange(0, 99999999);
              }}
            />
          </div>
        </section>

        <Button.CallToAction {...buttonRef.value.props} class="mt-[10px]">
          {!!buttonRef.value.icon && (
            <AssetIcon
              icon={buttonRef.value.icon}
              class="w-[20px] h-[20px] mr-[4px]"
            />
          )}{" "}
          {buttonRef.value.name}
        </Button.CallToAction>
      </Modal>
    );
  },
});
