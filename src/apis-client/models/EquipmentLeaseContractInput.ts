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
/**
 * 
 * @export
 * @interface EquipmentLeaseContractInput
 */
export interface EquipmentLeaseContractInput {
    /**
     * 
     * @type {string}
     * @memberof EquipmentLeaseContractInput
     */
    orderId: string;
}

export function EquipmentLeaseContractInputFromJSON(json: any): EquipmentLeaseContractInput {
    return EquipmentLeaseContractInputFromJSONTyped(json, false);
}

export function EquipmentLeaseContractInputFromJSONTyped(json: any, ignoreDiscriminator: boolean): EquipmentLeaseContractInput {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'orderId': json['orderId'],
    };
}

export function EquipmentLeaseContractInputToJSON(value?: EquipmentLeaseContractInput | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'orderId': value.orderId,
    };
}

