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
 * @interface Model33
 */
export interface Model33 {
    /**
     * 
     * @type {number}
     * @memberof Model33
     */
    pctUtilization: number;
}

export function Model33FromJSON(json: any): Model33 {
    return Model33FromJSONTyped(json, false);
}

export function Model33FromJSONTyped(json: any, ignoreDiscriminator: boolean): Model33 {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'pctUtilization': json['pctUtilization'],
    };
}

export function Model33ToJSON(value?: Model33 | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'pctUtilization': value.pctUtilization,
    };
}


