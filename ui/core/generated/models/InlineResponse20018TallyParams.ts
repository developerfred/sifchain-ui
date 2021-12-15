/* tslint:disable */
/* eslint-disable */
/**
 * Sifchain - gRPC Gateway docs
 * A REST interface for state queries, legacy transactions
 *
 * The version of the OpenAPI document: 1.0.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from "../runtime";
/**
 * tally_params defines the parameters related to tally.
 * @export
 * @interface InlineResponse20018TallyParams
 */
export interface InlineResponse20018TallyParams {
  /**
   * Minimum percentage of total stake needed to vote for a result to be
   *  considered valid.
   * @type {string}
   * @memberof InlineResponse20018TallyParams
   */
  quorum?: string;
  /**
   * Minimum proportion of Yes votes for proposal to pass. Default value: 0.5.
   * @type {string}
   * @memberof InlineResponse20018TallyParams
   */
  threshold?: string;
  /**
   * Minimum value of Veto votes to Total votes ratio for proposal to be
   *  vetoed. Default value: 1/3.
   * @type {string}
   * @memberof InlineResponse20018TallyParams
   */
  vetoThreshold?: string;
}

export function InlineResponse20018TallyParamsFromJSON(
  json: any,
): InlineResponse20018TallyParams {
  return InlineResponse20018TallyParamsFromJSONTyped(json, false);
}

export function InlineResponse20018TallyParamsFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): InlineResponse20018TallyParams {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    quorum: !exists(json, "quorum") ? undefined : json["quorum"],
    threshold: !exists(json, "threshold") ? undefined : json["threshold"],
    vetoThreshold: !exists(json, "veto_threshold")
      ? undefined
      : json["veto_threshold"],
  };
}

export function InlineResponse20018TallyParamsToJSON(
  value?: InlineResponse20018TallyParams | null,
): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    quorum: value.quorum,
    threshold: value.threshold,
    veto_threshold: value.vetoThreshold,
  };
}