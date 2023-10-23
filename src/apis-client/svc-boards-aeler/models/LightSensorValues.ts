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
 * @interface LightSensorValues
 */
export interface LightSensorValues {
    /**
     * 
     * @type {number}
     * @memberof LightSensorValues
     */
    devId?: number;
    /**
     * 
     * @type {number}
     * @memberof LightSensorValues
     */
    status?: number;
    /**
     * 
     * @type {number}
     * @memberof LightSensorValues
     */
    lux?: number;
}

export function LightSensorValuesFromJSON(json: any): LightSensorValues {
    return LightSensorValuesFromJSONTyped(json, false);
}

export function LightSensorValuesFromJSONTyped(json: any, ignoreDiscriminator: boolean): LightSensorValues {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'devId': !exists(json, 'devId') ? undefined : json['devId'],
        'status': !exists(json, 'status') ? undefined : json['status'],
        'lux': !exists(json, 'lux') ? undefined : json['lux'],
    };
}

export function LightSensorValuesToJSON(value?: LightSensorValues | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'devId': value.devId,
        'status': value.status,
        'lux': value.lux,
    };
}

