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
 * @interface Model10
 */
export interface Model10 {
    /**
     * 
     * @type {string}
     * @memberof Model10
     */
    locode: string;
}

export function Model10FromJSON(json: any): Model10 {
    return Model10FromJSONTyped(json, false);
}

export function Model10FromJSONTyped(json: any, ignoreDiscriminator: boolean): Model10 {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'locode': json['locode'],
    };
}

export function Model10ToJSON(value?: Model10 | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'locode': value.locode,
    };
}

