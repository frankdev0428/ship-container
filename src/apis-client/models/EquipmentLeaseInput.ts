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
    Lease,
    LeaseFromJSON,
    LeaseFromJSONTyped,
    LeaseToJSON,
    Status,
    StatusFromJSON,
    StatusFromJSONTyped,
    StatusToJSON,
} from './';

/**
 * 
 * @export
 * @interface EquipmentLeaseInput
 */
export interface EquipmentLeaseInput {
    /**
     * 
     * @type {Lease}
     * @memberof EquipmentLeaseInput
     */
    lease: Lease;
    /**
     * 
     * @type {Status}
     * @memberof EquipmentLeaseInput
     */
    status: Status;
}

export function EquipmentLeaseInputFromJSON(json: any): EquipmentLeaseInput {
    return EquipmentLeaseInputFromJSONTyped(json, false);
}

export function EquipmentLeaseInputFromJSONTyped(json: any, ignoreDiscriminator: boolean): EquipmentLeaseInput {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'lease': LeaseFromJSON(json['lease']),
        'status': StatusFromJSON(json['status']),
    };
}

export function EquipmentLeaseInputToJSON(value?: EquipmentLeaseInput | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'lease': LeaseToJSON(value.lease),
        'status': StatusToJSON(value.status),
    };
}


