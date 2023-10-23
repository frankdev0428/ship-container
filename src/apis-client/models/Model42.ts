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
 * @interface Model42
 */
export interface Model42 {
    /**
     * 
     * @type {Date}
     * @memberof Model42
     */
    date: Date;
    /**
     * 
     * @type {number}
     * @memberof Model42
     */
    numDays: number;
}

export function Model42FromJSON(json: any): Model42 {
    return Model42FromJSONTyped(json, false);
}

export function Model42FromJSONTyped(json: any, ignoreDiscriminator: boolean): Model42 {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'date': (new Date(json['date'])),
        'numDays': json['numDays'],
    };
}

export function Model42ToJSON(value?: Model42 | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'date': (value.date.toISOString()),
        'numDays': value.numDays,
    };
}


