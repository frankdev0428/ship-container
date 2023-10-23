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
 * @interface MostSensorsUpdatedAt
 */
export interface MostSensorsUpdatedAt {
    /**
     * 
     * @type {string}
     * @memberof MostSensorsUpdatedAt
     */
    type: MostSensorsUpdatedAtTypeEnum;
    /**
     * 
     * @type {number}
     * @memberof MostSensorsUpdatedAt
     */
    temperature?: number;
    /**
     * 
     * @type {number}
     * @memberof MostSensorsUpdatedAt
     */
    humidity?: number;
    /**
     * 
     * @type {number}
     * @memberof MostSensorsUpdatedAt
     */
    luminance?: number;
    /**
     * 
     * @type {number}
     * @memberof MostSensorsUpdatedAt
     */
    g?: number;
    /**
     * 
     * @type {number}
     * @memberof MostSensorsUpdatedAt
     */
    dewpoint?: number;
    /**
     * 
     * @type {number}
     * @memberof MostSensorsUpdatedAt
     */
    battery?: number;
    /**
     * 
     * @type {number}
     * @memberof MostSensorsUpdatedAt
     */
    rssi?: number;
    /**
     * 
     * @type {Date}
     * @memberof MostSensorsUpdatedAt
     */
    updatedAt: Date;
}

/**
* @export
* @enum {string}
*/
export enum MostSensorsUpdatedAtTypeEnum {
    Temperature = 'temperature',
    Humidity = 'humidity',
    Luminance = 'luminance',
    G = 'g',
    Dewpoint = 'dewpoint',
    All = 'all',
    Battery = 'battery',
    Rssi = 'rssi'
}

export function MostSensorsUpdatedAtFromJSON(json: any): MostSensorsUpdatedAt {
    return MostSensorsUpdatedAtFromJSONTyped(json, false);
}

export function MostSensorsUpdatedAtFromJSONTyped(json: any, ignoreDiscriminator: boolean): MostSensorsUpdatedAt {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'type': json['type'],
        'temperature': !exists(json, 'temperature') ? undefined : json['temperature'],
        'humidity': !exists(json, 'humidity') ? undefined : json['humidity'],
        'luminance': !exists(json, 'luminance') ? undefined : json['luminance'],
        'g': !exists(json, 'g') ? undefined : json['g'],
        'dewpoint': !exists(json, 'dewpoint') ? undefined : json['dewpoint'],
        'battery': !exists(json, 'battery') ? undefined : json['battery'],
        'rssi': !exists(json, 'rssi') ? undefined : json['rssi'],
        'updatedAt': (new Date(json['updatedAt'])),
    };
}

export function MostSensorsUpdatedAtToJSON(value?: MostSensorsUpdatedAt | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'type': value.type,
        'temperature': value.temperature,
        'humidity': value.humidity,
        'luminance': value.luminance,
        'g': value.g,
        'dewpoint': value.dewpoint,
        'battery': value.battery,
        'rssi': value.rssi,
        'updatedAt': (value.updatedAt.toISOString().substr(0,10)),
    };
}


