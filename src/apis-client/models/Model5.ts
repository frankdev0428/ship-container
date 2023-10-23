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
 * @interface Model5
 */
export interface Model5 {
    /**
     * 
     * @type {number}
     * @memberof Model5
     */
    rate: number;
    /**
     * 
     * @type {Date}
     * @memberof Model5
     */
    dataDate: Date;
    /**
     * 
     * @type {boolean}
     * @memberof Model5
     */
    valid: boolean;
}

export function Model5FromJSON(json: any): Model5 {
    return Model5FromJSONTyped(json, false);
}

export function Model5FromJSONTyped(json: any, ignoreDiscriminator: boolean): Model5 {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'rate': json['rate'],
        'dataDate': (new Date(json['dataDate'])),
        'valid': json['valid'],
    };
}

export function Model5ToJSON(value?: Model5 | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'rate': value.rate,
        'dataDate': (value.dataDate.toISOString()),
        'valid': value.valid,
    };
}

