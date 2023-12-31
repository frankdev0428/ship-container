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
 * @interface Model38
 */
export interface Model38 {
    /**
     * 
     * @type {string}
     * @memberof Model38
     */
    equipmentLeaseContractId: string;
    /**
     * 
     * @type {Date}
     * @memberof Model38
     */
    startDate: Date;
    /**
     * 
     * @type {Date}
     * @memberof Model38
     */
    stopDate: Date;
}

export function Model38FromJSON(json: any): Model38 {
    return Model38FromJSONTyped(json, false);
}

export function Model38FromJSONTyped(json: any, ignoreDiscriminator: boolean): Model38 {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'equipmentLeaseContractId': json['equipmentLeaseContractId'],
        'startDate': (new Date(json['startDate'])),
        'stopDate': (new Date(json['stopDate'])),
    };
}

export function Model38ToJSON(value?: Model38 | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'equipmentLeaseContractId': value.equipmentLeaseContractId,
        'startDate': (value.startDate.toISOString()),
        'stopDate': (value.stopDate.toISOString()),
    };
}


