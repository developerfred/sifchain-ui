import { NetworkEnv } from "../getEnv";
import { Network } from "../../entities";
import ethereum from "./ethereum";
import sifchain from "./sifchain";
import cosmoshub from "./cosmoshub";
import iris from "./iris";
import akash from "./akash";
import sentinel from "./sentinel";
import cryptoOrg from "./crypto-org";
import persistence from "./persistence";
import regen from "./regen";
import osmosis from "./osmosis";
import terra from "./terra";
import juno from "./juno";
import ixo from "./ixo";
import band from "./band";
import likecoin from "./likecoin";
import emoney from "./emoney";
import starname from "./starname";
import bitsong from "./bitsong";
import cerberus from "./cerberus";
import chihuahua from "./chihuahua";
import comdex from "./comdex";
import ki from "./ki";
import stargaze from "./stargaze";

export const chainConfigByNetworkEnv = Object.fromEntries(
  Object.values(NetworkEnv).map((env) => {
    return [
      env as NetworkEnv,
      {
        [Network.SIFCHAIN]: sifchain[env],
        [Network.COSMOSHUB]: cosmoshub[env],
        [Network.IRIS]: iris[env],
        [Network.AKASH]: akash[env],
        [Network.SENTINEL]: sentinel[env],
        [Network.ETHEREUM]: ethereum[env],
        [Network.CRYPTO_ORG]: cryptoOrg[env],
        [Network.OSMOSIS]: osmosis[env],
        [Network.PERSISTENCE]: persistence[env],
        [Network.REGEN]: regen[env],
        [Network.TERRA]: terra[env],
        [Network.JUNO]: juno[env],
        [Network.IXO]: ixo[env],
        [Network.BAND]: band[env],
        [Network.BITSONG]: bitsong[env],
        [Network.LIKECOIN]: likecoin[env],
        [Network.EMONEY]: emoney[env],
        [Network.STARNAME]: starname[env],
        [Network.CERBERUS]: cerberus[env],
        [Network.CHIHUAHUA]: chihuahua[env],
        [Network.COMDEX]: comdex[env],
        [Network.KI]: ki[env],
        [Network.STARGAZE]: stargaze[env],
      },
    ];
  }),
);
