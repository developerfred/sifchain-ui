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
/**
 * 
 * @export
 * @interface OsmosisPoolincentivesV1beta1DistrInfoRecords
 */
export interface OsmosisPoolincentivesV1beta1DistrInfoRecords {
    /**
     * 
     * @type {string}
     * @memberof OsmosisPoolincentivesV1beta1DistrInfoRecords
     */
    gaugeId?: string;
    /**
     * 
     * @type {string}
     * @memberof OsmosisPoolincentivesV1beta1DistrInfoRecords
     */
    weight?: string;
}

export function OsmosisPoolincentivesV1beta1DistrInfoRecordsFromJSON(json: any): OsmosisPoolincentivesV1beta1DistrInfoRecords {
    return OsmosisPoolincentivesV1beta1DistrInfoRecordsFromJSONTyped(json, false);
}

export function OsmosisPoolincentivesV1beta1DistrInfoRecordsFromJSONTyped(json: any, ignoreDiscriminator: boolean): OsmosisPoolincentivesV1beta1DistrInfoRecords {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'gaugeId': !exists(json, 'gauge_id') ? undefined : json['gauge_id'],
        'weight': !exists(json, 'weight') ? undefined : json['weight'],
    };
}

export function OsmosisPoolincentivesV1beta1DistrInfoRecordsToJSON(value?: OsmosisPoolincentivesV1beta1DistrInfoRecords | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'gauge_id': value.gaugeId,
        'weight': value.weight,
    };
}

