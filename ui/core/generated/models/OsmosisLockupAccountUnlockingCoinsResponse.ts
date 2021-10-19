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
    InlineResponse2002Balances,
    InlineResponse2002BalancesFromJSON,
    InlineResponse2002BalancesFromJSONTyped,
    InlineResponse2002BalancesToJSON,
} from './';

/**
 * 
 * @export
 * @interface OsmosisLockupAccountUnlockingCoinsResponse
 */
export interface OsmosisLockupAccountUnlockingCoinsResponse {
    /**
     * 
     * @type {Array<InlineResponse2002Balances>}
     * @memberof OsmosisLockupAccountUnlockingCoinsResponse
     */
    coins?: Array<InlineResponse2002Balances>;
}

export function OsmosisLockupAccountUnlockingCoinsResponseFromJSON(json: any): OsmosisLockupAccountUnlockingCoinsResponse {
    return OsmosisLockupAccountUnlockingCoinsResponseFromJSONTyped(json, false);
}

export function OsmosisLockupAccountUnlockingCoinsResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): OsmosisLockupAccountUnlockingCoinsResponse {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'coins': !exists(json, 'coins') ? undefined : ((json['coins'] as Array<any>).map(InlineResponse2002BalancesFromJSON)),
    };
}

export function OsmosisLockupAccountUnlockingCoinsResponseToJSON(value?: OsmosisLockupAccountUnlockingCoinsResponse | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'coins': value.coins === undefined ? undefined : ((value.coins as Array<any>).map(InlineResponse2002BalancesToJSON)),
    };
}

