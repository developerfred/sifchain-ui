"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CosmoshubChain = void 0;
const _BaseChain_1 = require("./_BaseChain");
const url_join_ts_1 = require("url-join-ts");
class CosmoshubChain extends _BaseChain_1.BaseChain {
  getBlockExplorerUrlForTxHash(hash) {
    return (0, url_join_ts_1.urlJoin)(
      this.chainConfig.blockExplorerUrl,
      "txs",
      hash,
    );
  }
  getBlockExplorerUrlForAddress(hash) {
    return (0, url_join_ts_1.urlJoin)(
      this.chainConfig.blockExplorerUrl,
      "account",
      hash,
    );
  }
}
exports.CosmoshubChain = CosmoshubChain;
//# sourceMappingURL=CosmoshubChain.js.map