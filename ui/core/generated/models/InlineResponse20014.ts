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

import { exists, mapValues } from '../runtime';
import {
    InlineResponse20014Rewards,
    InlineResponse20014RewardsFromJSON,
    InlineResponse20014RewardsFromJSONTyped,
    InlineResponse20014RewardsToJSON,
} from './';

/**
 * QueryValidatorOutstandingRewardsResponse is the response type for the
 * Query/ValidatorOutstandingRewards RPC method.
 * @export
 * @interface InlineResponse20014
 */
export interface InlineResponse20014 {
    /**
     * 
     * @type {InlineResponse20014Rewards}
     * @memberof InlineResponse20014
     */
    rewards?: InlineResponse20014Rewards;
}

export function InlineResponse20014FromJSON(json: any): InlineResponse20014 {
    return InlineResponse20014FromJSONTyped(json, false);
}

export function InlineResponse20014FromJSONTyped(json: any, ignoreDiscriminator: boolean): InlineResponse20014 {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'rewards': !exists(json, 'rewards') ? undefined : InlineResponse20014RewardsFromJSON(json['rewards']),
    };
}

export function InlineResponse20014ToJSON(value?: InlineResponse20014 | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'rewards': InlineResponse20014RewardsToJSON(value.rewards),
    };
}

