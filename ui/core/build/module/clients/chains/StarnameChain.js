import { urlJoin } from "url-join-ts";
import { BaseChain } from "./_BaseChain";
export class StarnameChain extends BaseChain {
  getBlockExplorerUrlForTxHash(hash) {
    return urlJoin(this.chainConfig.blockExplorerUrl, "tx", hash);
  }
  getBlockExplorerUrlForAddress(hash) {
    return urlJoin(this.chainConfig.blockExplorerUrl, "account", hash);
  }
}
//# sourceMappingURL=StarnameChain.js.map