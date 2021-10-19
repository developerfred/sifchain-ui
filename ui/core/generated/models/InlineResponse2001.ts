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
    InlineResponse2001Params,
    InlineResponse2001ParamsFromJSON,
    InlineResponse2001ParamsFromJSONTyped,
    InlineResponse2001ParamsToJSON,
} from './';

/**
 * QueryParamsResponse is the response type for the Query/Params RPC method.
 * @export
 * @interface InlineResponse2001
 */
export interface InlineResponse2001 {
    /**
     * 
     * @type {InlineResponse2001Params}
     * @memberof InlineResponse2001
     */
    params?: InlineResponse2001Params;
}

export function InlineResponse2001FromJSON(json: any): InlineResponse2001 {
    return InlineResponse2001FromJSONTyped(json, false);
}

export function InlineResponse2001FromJSONTyped(json: any, ignoreDiscriminator: boolean): InlineResponse2001 {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'params': !exists(json, 'params') ? undefined : InlineResponse2001ParamsFromJSON(json['params']),
    };
}

export function InlineResponse2001ToJSON(value?: InlineResponse2001 | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'params': InlineResponse2001ParamsToJSON(value.params),
    };
}

