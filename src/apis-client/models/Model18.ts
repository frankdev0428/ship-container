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
 * @interface Model18
 */
export interface Model18 {
    /**
     * 
     * @type {number}
     * @memberof Model18
     */
    avPctMnr: number;
}

export function Model18FromJSON(json: any): Model18 {
    return Model18FromJSONTyped(json, false);
}

export function Model18FromJSONTyped(json: any, ignoreDiscriminator: boolean): Model18 {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'avPctMnr': json['avPctMnr'],
    };
}

export function Model18ToJSON(value?: Model18 | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'avPctMnr': value.avPctMnr,
    };
}

