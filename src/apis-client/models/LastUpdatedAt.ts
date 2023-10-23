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
 * @interface LastUpdatedAt
 */
export interface LastUpdatedAt {
    /**
     * 
     * @type {Date}
     * @memberof LastUpdatedAt
     */
    temperature_int?: Date;
    /**
     * 
     * @type {Date}
     * @memberof LastUpdatedAt
     */
    temperature_ext?: Date;
    /**
     * 
     * @type {Date}
     * @memberof LastUpdatedAt
     */
    humidityInt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof LastUpdatedAt
     */
    humidityExt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof LastUpdatedAt
     */
    pressureInt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof LastUpdatedAt
     */
    pressureExt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof LastUpdatedAt
     */
    lightInt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof LastUpdatedAt
     */
    lightExt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof LastUpdatedAt
     */
    doorEvents?: Date;
    /**
     * 
     * @type {Date}
     * @memberof LastUpdatedAt
     */
    shockEvents?: Date;
    /**
     * 
     * @type {Date}
     * @memberof LastUpdatedAt
     */
    doors?: Date;
    /**
     * 
     * @type {Date}
     * @memberof LastUpdatedAt
     */
    accel?: Date;
}

export function LastUpdatedAtFromJSON(json: any): LastUpdatedAt {
    return LastUpdatedAtFromJSONTyped(json, false);
}

export function LastUpdatedAtFromJSONTyped(json: any, ignoreDiscriminator: boolean): LastUpdatedAt {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'temperature_int': !exists(json, 'temperature_int') ? undefined : (new Date(json['temperature_int'])),
        'temperature_ext': !exists(json, 'temperature_ext') ? undefined : (new Date(json['temperature_ext'])),
        'humidityInt': !exists(json, 'humidityInt') ? undefined : (new Date(json['humidityInt'])),
        'humidityExt': !exists(json, 'humidityExt') ? undefined : (new Date(json['humidityExt'])),
        'pressureInt': !exists(json, 'pressureInt') ? undefined : (new Date(json['pressureInt'])),
        'pressureExt': !exists(json, 'pressureExt') ? undefined : (new Date(json['pressureExt'])),
        'lightInt': !exists(json, 'lightInt') ? undefined : (new Date(json['lightInt'])),
        'lightExt': !exists(json, 'lightExt') ? undefined : (new Date(json['lightExt'])),
        'doorEvents': !exists(json, 'doorEvents') ? undefined : (new Date(json['doorEvents'])),
        'shockEvents': !exists(json, 'shockEvents') ? undefined : (new Date(json['shockEvents'])),
        'doors': !exists(json, 'doors') ? undefined : (new Date(json['doors'])),
        'accel': !exists(json, 'accel') ? undefined : (new Date(json['accel'])),
    };
}

export function LastUpdatedAtToJSON(value?: LastUpdatedAt | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'temperature_int': value.temperature_int === undefined ? undefined : (value.temperature_int.toISOString()),
        'temperature_ext': value.temperature_ext === undefined ? undefined : (value.temperature_ext.toISOString()),
        'humidityInt': value.humidityInt === undefined ? undefined : (value.humidityInt.toISOString()),
        'humidityExt': value.humidityExt === undefined ? undefined : (value.humidityExt.toISOString()),
        'pressureInt': value.pressureInt === undefined ? undefined : (value.pressureInt.toISOString()),
        'pressureExt': value.pressureExt === undefined ? undefined : (value.pressureExt.toISOString()),
        'lightInt': value.lightInt === undefined ? undefined : (value.lightInt.toISOString()),
        'lightExt': value.lightExt === undefined ? undefined : (value.lightExt.toISOString()),
        'doorEvents': value.doorEvents === undefined ? undefined : (value.doorEvents.toISOString()),
        'shockEvents': value.shockEvents === undefined ? undefined : (value.shockEvents.toISOString()),
        'doors': value.doors === undefined ? undefined : (value.doors.toISOString()),
        'accel': value.accel === undefined ? undefined : (value.accel.toISOString()),
    };
}

