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
 * @interface Model26
 */
export interface Model26 {
    /**
     * 
     * @type {number}
     * @memberof Model26
     */
    pctIdle: number;
}

export function Model26FromJSON(json: any): Model26 {
    return Model26FromJSONTyped(json, false);
}

export function Model26FromJSONTyped(json: any, ignoreDiscriminator: boolean): Model26 {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'pctIdle': json['pctIdle'],
    };
}

export function Model26ToJSON(value?: Model26 | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'pctIdle': value.pctIdle,
    };
}

