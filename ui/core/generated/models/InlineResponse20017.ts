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
    InlineResponse20017Evidence,
    InlineResponse20017EvidenceFromJSON,
    InlineResponse20017EvidenceFromJSONTyped,
    InlineResponse20017EvidenceToJSON,
} from './';

/**
 * QueryEvidenceResponse is the response type for the Query/Evidence RPC method.
 * @export
 * @interface InlineResponse20017
 */
export interface InlineResponse20017 {
    /**
     * 
     * @type {InlineResponse20017Evidence}
     * @memberof InlineResponse20017
     */
    evidence?: InlineResponse20017Evidence;
}

export function InlineResponse20017FromJSON(json: any): InlineResponse20017 {
    return InlineResponse20017FromJSONTyped(json, false);
}

export function InlineResponse20017FromJSONTyped(json: any, ignoreDiscriminator: boolean): InlineResponse20017 {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'evidence': !exists(json, 'evidence') ? undefined : InlineResponse20017EvidenceFromJSON(json['evidence']),
    };
}

export function InlineResponse20017ToJSON(value?: InlineResponse20017 | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'evidence': InlineResponse20017EvidenceToJSON(value.evidence),
    };
}

