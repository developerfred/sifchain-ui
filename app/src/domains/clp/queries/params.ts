import { useSifchainClients } from "@/business/providers/SifchainClientsProvider";
import { useBlockTimeQuery } from "@/domains/statistics/queries/blockTime";
import dangerouslyAssert from "@/utils/dangerouslyAssert";
import { addMilliseconds, minutesToMilliseconds } from "date-fns";
import { computed } from "vue";
import { useQuery } from "vue-query";

const REWARD_PARAMS_KEY = "rewardsParams";

export const useRewardsParamsQuery = () => {
  const sifchainClients = useSifchainClients();

  return useQuery(
    REWARD_PARAMS_KEY,
    () => {
      dangerouslyAssert<"fulfilled">(sifchainClients.queryClientStatus);
      return sifchainClients.queryClient.clp.GetRewardParams({});
    },
    {
      enabled: computed(
        () => sifchainClients.queryClientStatus === "fulfilled",
      ),
      staleTime: minutesToMilliseconds(5),
    },
  );
};

export const useCurrentRewardPeriod = () => {
  const sifchainClients = useSifchainClients();
  const { data: blockTime } = useBlockTimeQuery();
  const { data: rewardsParams } = useRewardsParamsQuery();

  return useQuery(
    "currentRewardPeriod",
    async () => {
      dangerouslyAssert<"fulfilled">(sifchainClients.queryClientStatus);
      dangerouslyAssert<"fulfilled">(sifchainClients.signingClientStatus);

      const currentHeight = await sifchainClients.signingClient.getHeight();

      const currentRewardPeriod =
        rewardsParams.value?.params?.rewardPeriods.find((x) => {
          const startBlock = x.rewardPeriodStartBlock.toNumber();
          const endBlock = x.rewardPeriodEndBlock.toNumber();

          return startBlock <= currentHeight && currentHeight < endBlock;
        });

      if (currentRewardPeriod === undefined) return;

      const blocksRemainingTilInactive =
        currentRewardPeriod.rewardPeriodEndBlock.toNumber() - currentHeight;
      const estimatedRewardPeriodEndDate = addMilliseconds(
        new Date(),
        blocksRemainingTilInactive * (blockTime.value ?? 0),
      );

      return { ...currentRewardPeriod, estimatedRewardPeriodEndDate };
    },
    {
      enabled: computed(
        () =>
          sifchainClients.queryClientStatus === "fulfilled" &&
          sifchainClients.signingClientStatus === "fulfilled" &&
          blockTime.value !== undefined &&
          rewardsParams.value !== undefined,
      ),
    },
  );
};
