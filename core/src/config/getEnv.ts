import { Network } from "../entities";
import { AppCookies } from "./AppCookies";

export enum NetworkEnv {
  MAINNET = "mainnet",
  TESTNET = "testnet",
  DEVNET = "devnet",
  LOCALNET = "localnet",
  DEVNET_042 = "devnet_042",
  TESTNET_042_IBC = "testnet_042_ibc",
}

// NOTE(ajoslin): support legacy `?_env=n` urls
export const networkEnvsByIndex = [
  NetworkEnv.MAINNET,
  NetworkEnv.TESTNET,
  NetworkEnv.DEVNET,
  NetworkEnv.LOCALNET,
  NetworkEnv.DEVNET_042,
  NetworkEnv.TESTNET_042_IBC,
];

type AssetTag = `${Network}.${NetworkEnv}`;

type ProfileLookup = Record<
  NetworkEnv | number,
  {
    tag: NetworkEnv;
    ethAssetTag: AssetTag;
    sifAssetTag: AssetTag;
    cosmoshubAssetTag: AssetTag;
  }
>;

export const profileLookup: ProfileLookup = {
  [NetworkEnv.MAINNET]: {
    tag: NetworkEnv.MAINNET,
    ethAssetTag: "ethereum.mainnet",
    sifAssetTag: "sifchain.mainnet",
    cosmoshubAssetTag: "cosmoshub.mainnet",
  },
  [NetworkEnv.DEVNET_042]: {
    tag: NetworkEnv.DEVNET_042,
    ethAssetTag: "ethereum.devnet",
    sifAssetTag: "sifchain.devnet",
    cosmoshubAssetTag: "cosmoshub.testnet",
  },
  [NetworkEnv.TESTNET_042_IBC]: {
    tag: NetworkEnv.TESTNET_042_IBC,
    ethAssetTag: "ethereum.testnet_042_ibc",
    sifAssetTag: "sifchain.devnet",
    cosmoshubAssetTag: "cosmoshub.testnet",
  },
  [NetworkEnv.TESTNET]: {
    tag: NetworkEnv.TESTNET,
    ethAssetTag: "ethereum.testnet",
    sifAssetTag: "sifchain.devnet",
    cosmoshubAssetTag: "cosmoshub.testnet",
  },
  [NetworkEnv.DEVNET]: {
    tag: NetworkEnv.DEVNET,
    ethAssetTag: "ethereum.devnet",
    sifAssetTag: "sifchain.devnet",
    cosmoshubAssetTag: "cosmoshub.testnet",
  },
  [NetworkEnv.LOCALNET]: {
    tag: NetworkEnv.LOCALNET,
    ethAssetTag: "ethereum.localnet",
    sifAssetTag: "sifchain.localnet",
    cosmoshubAssetTag: "cosmoshub.testnet",
  },
} as const;

// Here we list hostnames that have default env settings
const hostDefaultEnvs = [
  { test: /dex\.sifchain\.finance$/, net: NetworkEnv.MAINNET },
  { test: /testnet\.sifchain\.finance$/, net: NetworkEnv.TESTNET },
  { test: /devnet\.sifchain\.finance$/, net: NetworkEnv.DEVNET },
  { test: /dex-v2.*?\.sifchain\.finance$/, net: NetworkEnv.TESTNET_042_IBC },
  { test: /sifchain\.vercel\.app$/, net: NetworkEnv.DEVNET },
  { test: /gateway\.pinata\.cloud$/, net: NetworkEnv.DEVNET },
  { test: /localhost$/, net: NetworkEnv.DEVNET },
];

export function getNetworkEnv(hostname: string) {
  for (const { test, net } of hostDefaultEnvs) {
    if (test.test(hostname)) {
      return net;
    }
  }
  return null;
}

export function isNetworkEnvSymbol(a: any): a is NetworkEnv {
  return (
    Object.values(NetworkEnv).includes(a) || !!networkEnvsByIndex[a as number]
  );
}

type GetEnvArgs = {
  location: { hostname: string };
  cookies?: Pick<AppCookies, "getEnv">;
};

export function getEnv({
  location: { hostname },
  cookies = AppCookies(),
}: GetEnvArgs) {
  const cookieEnv = cookies.getEnv();
  const defaultNetworkEnv = getNetworkEnv(hostname);

  let sifEnv: NetworkEnv | null;

  if (cookieEnv != null && networkEnvsByIndex[+cookieEnv]) {
    console.log({ cookieEnv });
    sifEnv = networkEnvsByIndex[+cookieEnv];
  } else if (isNetworkEnvSymbol(cookieEnv)) {
    sifEnv = cookieEnv;
  } else {
    sifEnv = defaultNetworkEnv;
  }

  if (sifEnv != null && profileLookup[sifEnv]) {
    return profileLookup[sifEnv];
  }

  console.error(new Error(`Cannot render environment ${sifEnv} ${cookieEnv}`));

  return profileLookup[NetworkEnv.MAINNET];
}
