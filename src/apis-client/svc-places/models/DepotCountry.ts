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
 * @interface DepotCountry
 */
export interface DepotCountry {
    /**
     * 
     * @type {string}
     * @memberof DepotCountry
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof DepotCountry
     */
    code: string;
}

export function DepotCountryFromJSON(json: any): DepotCountry {
    return DepotCountryFromJSONTyped(json, false);
}

export function DepotCountryFromJSONTyped(json: any, ignoreDiscriminator: boolean): DepotCountry {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'name': json['name'],
        'code': json['code'],
    };
}

export function DepotCountryToJSON(value?: DepotCountry | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'name': value.name,
        'code': value.code,
    };
}


