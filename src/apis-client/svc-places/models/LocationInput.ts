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
import {
    LocationInputOptional,
    LocationInputOptionalFromJSON,
    LocationInputOptionalFromJSONTyped,
    LocationInputOptionalToJSON,
} from './';

/**
 * 
 * @export
 * @interface LocationInput
 */
export interface LocationInput {
    /**
     * Latitude in degrees
     * @type {number}
     * @memberof LocationInput
     */
    lat: number;
    /**
     * Longitude in degrees
     * @type {number}
     * @memberof LocationInput
     */
    lon: number;
    /**
     * 
     * @type {LocationInputOptional}
     * @memberof LocationInput
     */
    optional?: LocationInputOptional;
}

export function LocationInputFromJSON(json: any): LocationInput {
    return LocationInputFromJSONTyped(json, false);
}

export function LocationInputFromJSONTyped(json: any, ignoreDiscriminator: boolean): LocationInput {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'lat': json['lat'],
        'lon': json['lon'],
        'optional': !exists(json, 'optional') ? undefined : LocationInputOptionalFromJSON(json['optional']),
    };
}

export function LocationInputToJSON(value?: LocationInput | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'lat': value.lat,
        'lon': value.lon,
        'optional': LocationInputOptionalToJSON(value.optional),
    };
}


