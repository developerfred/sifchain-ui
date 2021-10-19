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
    InlineResponse2002Pagination,
    InlineResponse2002PaginationFromJSON,
    InlineResponse2002PaginationFromJSONTyped,
    InlineResponse2002PaginationToJSON,
    InlineResponse20048DenomTraces,
    InlineResponse20048DenomTracesFromJSON,
    InlineResponse20048DenomTracesFromJSONTyped,
    InlineResponse20048DenomTracesToJSON,
} from './';

/**
 * QueryConnectionsResponse is the response type for the Query/DenomTraces RPC
 * method.
 * @export
 * @interface InlineResponse20048
 */
export interface InlineResponse20048 {
    /**
     * denom_traces returns all denominations trace information.
     * @type {Array<InlineResponse20048DenomTraces>}
     * @memberof InlineResponse20048
     */
    denomTraces?: Array<InlineResponse20048DenomTraces>;
    /**
     * 
     * @type {InlineResponse2002Pagination}
     * @memberof InlineResponse20048
     */
    pagination?: InlineResponse2002Pagination;
}

export function InlineResponse20048FromJSON(json: any): InlineResponse20048 {
    return InlineResponse20048FromJSONTyped(json, false);
}

export function InlineResponse20048FromJSONTyped(json: any, ignoreDiscriminator: boolean): InlineResponse20048 {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'denomTraces': !exists(json, 'denom_traces') ? undefined : ((json['denom_traces'] as Array<any>).map(InlineResponse20048DenomTracesFromJSON)),
        'pagination': !exists(json, 'pagination') ? undefined : InlineResponse2002PaginationFromJSON(json['pagination']),
    };
}

export function InlineResponse20048ToJSON(value?: InlineResponse20048 | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'denom_traces': value.denomTraces === undefined ? undefined : ((value.denomTraces as Array<any>).map(InlineResponse20048DenomTracesToJSON)),
        'pagination': InlineResponse2002PaginationToJSON(value.pagination),
    };
}

