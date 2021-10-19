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
    InlineResponse20027Delegation,
    InlineResponse20027DelegationFromJSON,
    InlineResponse20027DelegationFromJSONTyped,
    InlineResponse20027DelegationToJSON,
    InlineResponse2002Balances,
    InlineResponse2002BalancesFromJSON,
    InlineResponse2002BalancesFromJSONTyped,
    InlineResponse2002BalancesToJSON,
} from './';

/**
 * DelegationResponse is equivalent to Delegation except that it contains a
 * balance in addition to shares which is more suitable for client responses.
 * @export
 * @interface CosmosStakingV1beta1DelegationResponse
 */
export interface CosmosStakingV1beta1DelegationResponse {
    /**
     * 
     * @type {InlineResponse20027Delegation}
     * @memberof CosmosStakingV1beta1DelegationResponse
     */
    delegation?: InlineResponse20027Delegation;
    /**
     * 
     * @type {InlineResponse2002Balances}
     * @memberof CosmosStakingV1beta1DelegationResponse
     */
    balance?: InlineResponse2002Balances;
}

export function CosmosStakingV1beta1DelegationResponseFromJSON(json: any): CosmosStakingV1beta1DelegationResponse {
    return CosmosStakingV1beta1DelegationResponseFromJSONTyped(json, false);
}

export function CosmosStakingV1beta1DelegationResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): CosmosStakingV1beta1DelegationResponse {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'delegation': !exists(json, 'delegation') ? undefined : InlineResponse20027DelegationFromJSON(json['delegation']),
        'balance': !exists(json, 'balance') ? undefined : InlineResponse2002BalancesFromJSON(json['balance']),
    };
}

export function CosmosStakingV1beta1DelegationResponseToJSON(value?: CosmosStakingV1beta1DelegationResponse | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'delegation': InlineResponse20027DelegationToJSON(value.delegation),
        'balance': InlineResponse2002BalancesToJSON(value.balance),
    };
}

