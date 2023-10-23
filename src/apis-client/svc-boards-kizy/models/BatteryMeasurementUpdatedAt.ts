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
 * @interface BatteryMeasurementUpdatedAt
 */
export interface BatteryMeasurementUpdatedAt {
    /**
     * from 0 to 100
     * @type {number}
     * @memberof BatteryMeasurementUpdatedAt
     */
    batteryLevel: number;
    /**
     * 
     * @type {Date}
     * @memberof BatteryMeasurementUpdatedAt
     */
    updatedAt: Date;
}

export function BatteryMeasurementUpdatedAtFromJSON(json: any): BatteryMeasurementUpdatedAt {
    return BatteryMeasurementUpdatedAtFromJSONTyped(json, false);
}

export function BatteryMeasurementUpdatedAtFromJSONTyped(json: any, ignoreDiscriminator: boolean): BatteryMeasurementUpdatedAt {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'batteryLevel': json['batteryLevel'],
        'updatedAt': (new Date(json['updatedAt'])),
    };
}

export function BatteryMeasurementUpdatedAtToJSON(value?: BatteryMeasurementUpdatedAt | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'batteryLevel': value.batteryLevel,
        'updatedAt': (value.updatedAt.toISOString().substr(0,10)),
    };
}


