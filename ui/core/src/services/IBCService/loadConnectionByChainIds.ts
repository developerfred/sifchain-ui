/* 
  async for future-proofing. At some point, we may want to pull these connections from
  sifnode
*/
export const loadConnectionByChainIds = async ({
  sourceChainId,
  counterpartyChainId,
}: {
  sourceChainId: string;
  counterpartyChainId: string;
}) => {
  return connectionsByChainIds[sourceChainId][counterpartyChainId];
};

const connectionsByChainIds: {
  [chainId: string]: {
    [externalChainId: string]: {
      channelId: string;
    };
  };
} = {
  "sifchain-devnet-1": {
    "cosmoshub-testnet": {
      channelId: "channel-53",
    },
  },
  "sifchain-devnet-042": {
    "cosmoshub-testnet": {
      channelId: "channel-0",
    },
  },
  "sifchain-testnet-042-ibc": {
    "cosmoshub-testnet": {
      channelId: "channel-0",
    },
  },
  "cosmoshub-testnet": {
    "sifchain-devnet-1": {
      channelId: "channel-124",
    },
    "sifchain-devnet-042": {
      channelId: "channel-53",
    },
    "sifchain-testnet-042-ibc": {
      channelId: "channel-86",
    },
  },
};