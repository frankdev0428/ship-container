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
 * @interface Position
 */
export interface Position {
    /**
     * timestamp
     * @type {Date}
     * @memberof Position
     */
    timestamp: Date;
    /**
     * A tuple containing the longitude and the latitude
     * @type {Array<number>}
     * @memberof Position
     */
    coordinates: Array<number>;
}

export function PositionFromJSON(json: any): Position {
    return PositionFromJSONTyped(json, false);
}

export function PositionFromJSONTyped(json: any, ignoreDiscriminator: boolean): Position {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'timestamp': (new Date(json['timestamp'])),
        'coordinates': json['coordinates'],
    };
}

export function PositionToJSON(value?: Position | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'timestamp': (value.timestamp.toISOString()),
        'coordinates': value.coordinates,
    };
}


