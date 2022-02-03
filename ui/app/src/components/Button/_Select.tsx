import { ButtonHTMLAttributes, SetupContext } from "vue";
import AssetIcon, { IconName } from "@/components/AssetIcon";

export function _Select(
  props: ButtonHTMLAttributes & {
    active?: boolean;
    chevronIcon?: IconName;
    hideIcon?: boolean;
  },
  ctx: SetupContext,
) {
  return (
    <button
      {...props}
      class={[
        "transition-all text-white text-[18px] font-bold duration-200 relative flex justify-between items-center h-[54px] pl-[8px] pr-0 rounded-[4px]  active:border-white disabled:bg-transparent text-lg font-medium whitespace-nowrap",
        props.active && "border-white",
        props.class,
      ]}
    >
      {ctx.slots.default?.()}
      {!props.hideIcon && (
        <AssetIcon
          class={[
            "w-[24px] h-[24px] ml-[8px] mr-[16px] transition-all duration-100 flex-shrink-0 opacity-[0.66]",
            props.active && "rotate-180",
          ]}
          size={24}
          icon={props.chevronIcon || "interactive/chevron-down"}
        />
      )}
    </button>
  );
}
