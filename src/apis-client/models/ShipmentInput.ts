/* tslint:disable */
/* eslint-disable */
/**
 * Aeler demo
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
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
    Shipment,
    ShipmentFromJSON,
    ShipmentFromJSONTyped,
    ShipmentToJSON,
    ShipmentCargoInput,
    ShipmentCargoInputFromJSON,
    ShipmentCargoInputFromJSONTyped,
    ShipmentCargoInputToJSON,
} from './';

/**
 * 
 * @export
 * @interface ShipmentInput
 */
export interface ShipmentInput {
    /**
     * 
     * @type {Shipment}
     * @memberof ShipmentInput
     */
    shipment: Shipment;
    /**
     * 
     * @type {Array<ShipmentCargoInput>}
     * @memberof ShipmentInput
     */
    cargo: Array<ShipmentCargoInput>;
    /**
     * shipment status during a shipment
     * @type {string}
     * @memberof ShipmentInput
     */
    status?: ShipmentInputStatusEnum;
    /**
     * 
     * @type {Array<string>}
     * @memberof ShipmentInput
     */
    equipmentIds?: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof ShipmentInput
     */
    ownerId?: string;
}

/**
* @export
* @enum {string}
*/
export enum ShipmentInputStatusEnum {
    Created = 'CREATED',
    Open = 'OPEN',
    Closed = 'CLOSED',
    Intransit = 'INTRANSIT',
    Arrived = 'ARRIVED',
    Failed = 'FAILED'
}

export function ShipmentInputFromJSON(json: any): ShipmentInput {
    return ShipmentInputFromJSONTyped(json, false);
}

export function ShipmentInputFromJSONTyped(json: any, ignoreDiscriminator: boolean): ShipmentInput {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'shipment': ShipmentFromJSON(json['shipment']),
        'cargo': ((json['cargo'] as Array<any>).map(ShipmentCargoInputFromJSON)),
        'status': !exists(json, 'status') ? undefined : json['status'],
        'equipmentIds': !exists(json, 'equipmentIds') ? undefined : json['equipmentIds'],
        'ownerId': !exists(json, 'ownerId') ? undefined : json['ownerId'],
    };
}

export function ShipmentInputToJSON(value?: ShipmentInput | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'shipment': ShipmentToJSON(value.shipment),
        'cargo': ((value.cargo as Array<any>).map(ShipmentCargoInputToJSON)),
        'status': value.status,
        'equipmentIds': value.equipmentIds,
        'ownerId': value.ownerId,
    };
}


