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
    InlineResponse2002Pagination,
    InlineResponse2002PaginationFromJSON,
    InlineResponse2002PaginationFromJSONTyped,
    InlineResponse2002PaginationToJSON,
} from './';

/**
 * QueryAllBalancesResponse is the response type for the Query/AllBalances RPC
 * method.
 * @export
 * @interface CosmosBankV1beta1QueryAllBalancesResponse
 */
export interface CosmosBankV1beta1QueryAllBalancesResponse {
    /**
     * balances is the balances of all the coins.
     * @type {Array<InlineResponse2002Balances>}
     * @memberof CosmosBankV1beta1QueryAllBalancesResponse
     */
    balances?: Array<InlineResponse2002Balances>;
    /**
     * 
     * @type {InlineResponse2002Pagination}
     * @memberof CosmosBankV1beta1QueryAllBalancesResponse
     */
    pagination?: InlineResponse2002Pagination;
}

export function CosmosBankV1beta1QueryAllBalancesResponseFromJSON(json: any): CosmosBankV1beta1QueryAllBalancesResponse {
    return CosmosBankV1beta1QueryAllBalancesResponseFromJSONTyped(json, false);
}

export function CosmosBankV1beta1QueryAllBalancesResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): CosmosBankV1beta1QueryAllBalancesResponse {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'balances': !exists(json, 'balances') ? undefined : ((json['balances'] as Array<any>).map(InlineResponse2002BalancesFromJSON)),
        'pagination': !exists(json, 'pagination') ? undefined : InlineResponse2002PaginationFromJSON(json['pagination']),
    };
}

export function CosmosBankV1beta1QueryAllBalancesResponseToJSON(value?: CosmosBankV1beta1QueryAllBalancesResponse | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'balances': value.balances === undefined ? undefined : ((value.balances as Array<any>).map(InlineResponse2002BalancesToJSON)),
        'pagination': InlineResponse2002PaginationToJSON(value.pagination),
    };
}

