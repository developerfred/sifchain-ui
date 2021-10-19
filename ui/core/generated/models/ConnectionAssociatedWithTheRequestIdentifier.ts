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
    InlineResponse20046Counterparty,
    InlineResponse20046CounterpartyFromJSON,
    InlineResponse20046CounterpartyFromJSONTyped,
    InlineResponse20046CounterpartyToJSON,
    InlineResponse20046Versions,
    InlineResponse20046VersionsFromJSON,
    InlineResponse20046VersionsFromJSONTyped,
    InlineResponse20046VersionsToJSON,
} from './';

/**
 * ConnectionEnd defines a stateful object on a chain connected to another
 * separate one.
 * NOTE: there must only be 2 defined ConnectionEnds to establish
 * a connection between two chains.
 * @export
 * @interface ConnectionAssociatedWithTheRequestIdentifier
 */
export interface ConnectionAssociatedWithTheRequestIdentifier {
    /**
     * client associated with this connection.
     * @type {string}
     * @memberof ConnectionAssociatedWithTheRequestIdentifier
     */
    clientId?: string;
    /**
     * IBC version which can be utilised to determine encodings or protocols for
     * channels or packets utilising this connection.
     * @type {Array<InlineResponse20046Versions>}
     * @memberof ConnectionAssociatedWithTheRequestIdentifier
     */
    versions?: Array<InlineResponse20046Versions>;
    /**
     * current state of the connection end.
     * @type {string}
     * @memberof ConnectionAssociatedWithTheRequestIdentifier
     */
    state?: ConnectionAssociatedWithTheRequestIdentifierStateEnum;
    /**
     * 
     * @type {InlineResponse20046Counterparty}
     * @memberof ConnectionAssociatedWithTheRequestIdentifier
     */
    counterparty?: InlineResponse20046Counterparty;
    /**
     * delay period that must pass before a consensus state can be used for packet-verification
     * NOTE: delay period logic is only implemented by some clients.
     * @type {string}
     * @memberof ConnectionAssociatedWithTheRequestIdentifier
     */
    delayPeriod?: string;
}

/**
* @export
* @enum {string}
*/
export enum ConnectionAssociatedWithTheRequestIdentifierStateEnum {
    UninitializedUnspecified = 'STATE_UNINITIALIZED_UNSPECIFIED',
    Init = 'STATE_INIT',
    Tryopen = 'STATE_TRYOPEN',
    Open = 'STATE_OPEN'
}

export function ConnectionAssociatedWithTheRequestIdentifierFromJSON(json: any): ConnectionAssociatedWithTheRequestIdentifier {
    return ConnectionAssociatedWithTheRequestIdentifierFromJSONTyped(json, false);
}

export function ConnectionAssociatedWithTheRequestIdentifierFromJSONTyped(json: any, ignoreDiscriminator: boolean): ConnectionAssociatedWithTheRequestIdentifier {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'clientId': !exists(json, 'client_id') ? undefined : json['client_id'],
        'versions': !exists(json, 'versions') ? undefined : ((json['versions'] as Array<any>).map(InlineResponse20046VersionsFromJSON)),
        'state': !exists(json, 'state') ? undefined : json['state'],
        'counterparty': !exists(json, 'counterparty') ? undefined : InlineResponse20046CounterpartyFromJSON(json['counterparty']),
        'delayPeriod': !exists(json, 'delay_period') ? undefined : json['delay_period'],
    };
}

export function ConnectionAssociatedWithTheRequestIdentifierToJSON(value?: ConnectionAssociatedWithTheRequestIdentifier | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'client_id': value.clientId,
        'versions': value.versions === undefined ? undefined : ((value.versions as Array<any>).map(InlineResponse20046VersionsToJSON)),
        'state': value.state,
        'counterparty': InlineResponse20046CounterpartyToJSON(value.counterparty),
        'delay_period': value.delayPeriod,
    };
}

