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
 * @interface Model29
 */
export interface Model29 {
    /**
     * 
     * @type {number}
     * @memberof Model29
     */
    totalAv: number;
}

export function Model29FromJSON(json: any): Model29 {
    return Model29FromJSONTyped(json, false);
}

export function Model29FromJSONTyped(json: any, ignoreDiscriminator: boolean): Model29 {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'totalAv': json['totalAv'],
    };
}

export function Model29ToJSON(value?: Model29 | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'totalAv': value.totalAv,
    };
}


