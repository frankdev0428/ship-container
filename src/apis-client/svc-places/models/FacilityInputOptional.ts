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
 * FacilityInputOptional
 * @export
 * @interface FacilityInputOptional
 */
export interface FacilityInputOptional {
    /**
     * location Id
     * @type {string}
     * @memberof FacilityInputOptional
     */
    locationId?: string;
    /**
     * name of operating company
     * @type {string}
     * @memberof FacilityInputOptional
     */
    operatorName?: string;
}

export function FacilityInputOptionalFromJSON(json: any): FacilityInputOptional {
    return FacilityInputOptionalFromJSONTyped(json, false);
}

export function FacilityInputOptionalFromJSONTyped(json: any, ignoreDiscriminator: boolean): FacilityInputOptional {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'locationId': !exists(json, 'locationId') ? undefined : json['locationId'],
        'operatorName': !exists(json, 'operatorName') ? undefined : json['operatorName'],
    };
}

export function FacilityInputOptionalToJSON(value?: FacilityInputOptional | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'locationId': value.locationId,
        'operatorName': value.operatorName,
    };
}


