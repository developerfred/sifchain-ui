import { Component, defineComponent, PropType, Ref, ref } from "vue";

export const _Details = defineComponent({
  props: {
    details: {
      type: Array as PropType<[any, any][]>,
      required: true,
    },
  },
  setup: (props) => {
    return () => (
      <div class="mt-[10px] w-full">
        {props.details.map(([key, value], index, arr) => (
          <div
            class={[
              `
              h-[49px] w-full flex justify-between items-center
              box-border bg-gray-base border-gray-input_outline border-l-[1px] border-b-[1px] border-r-[1px] border-solid`,
              index == 0 && `rounded-t border-t-[1px]`,
              index == arr.length - 1 && `rounded-b border-b-[1px]`,
            ]}
          >
            <div class="pl-[20px] text-left text-[16px] text-white font-sans font-medium">
              {key}
            </div>
            <div
              class={[
                `flex flex-row justify-end mr-[14px] items-center pl-[20px] text-right text-[16px] text-white font-mono font-medium`,
              ]}
            >
              {value}
              {/* <span class="mr-[4px] whitespace-nowrap"></span> */}
              {/* <img class="h-[18px]" src={props.toTokenImageUrl} alt="" /> */}
            </div>
          </div>
        ))}
      </div>
    );
  },
});