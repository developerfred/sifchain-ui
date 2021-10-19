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
    InlineResponse20013Params,
    InlineResponse20013ParamsFromJSON,
    InlineResponse20013ParamsFromJSONTyped,
    InlineResponse20013ParamsToJSON,
} from './';

/**
 * QueryParamsResponse is the response type for the Query/Params RPC method.
 * @export
 * @interface InlineResponse20013
 */
export interface InlineResponse20013 {
    /**
     * 
     * @type {InlineResponse20013Params}
     * @memberof InlineResponse20013
     */
    params?: InlineResponse20013Params;
}

export function InlineResponse20013FromJSON(json: any): InlineResponse20013 {
    return InlineResponse20013FromJSONTyped(json, false);
}

export function InlineResponse20013FromJSONTyped(json: any, ignoreDiscriminator: boolean): InlineResponse20013 {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'params': !exists(json, 'params') ? undefined : InlineResponse20013ParamsFromJSON(json['params']),
    };
}

export function InlineResponse20013ToJSON(value?: InlineResponse20013 | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'params': InlineResponse20013ParamsToJSON(value.params),
    };
}

