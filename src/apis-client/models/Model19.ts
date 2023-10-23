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
 * @interface Model19
 */
export interface Model19 {
    /**
     * 
     * @type {number}
     * @memberof Model19
     */
    ALLOCATED: number;
    /**
     * 
     * @type {number}
     * @memberof Model19
     */
    AVAILABLE: number;
    /**
     * 
     * @type {number}
     * @memberof Model19
     */
    BLOCKED: number;
}

export function Model19FromJSON(json: any): Model19 {
    return Model19FromJSONTyped(json, false);
}

export function Model19FromJSONTyped(json: any, ignoreDiscriminator: boolean): Model19 {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'ALLOCATED': json['ALLOCATED'],
        'AVAILABLE': json['AVAILABLE'],
        'BLOCKED': json['BLOCKED'],
    };
}

export function Model19ToJSON(value?: Model19 | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'ALLOCATED': value.ALLOCATED,
        'AVAILABLE': value.AVAILABLE,
        'BLOCKED': value.BLOCKED,
    };
}

