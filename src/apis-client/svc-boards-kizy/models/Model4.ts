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
    Values,
    ValuesFromJSON,
    ValuesFromJSONTyped,
    ValuesToJSON,
} from './';

/**
 * 
 * @export
 * @interface Model4
 */
export interface Model4 {
    /**
     * device id, or tracker id if kizy
     * @type {string}
     * @memberof Model4
     */
    deviceId: string;
    /**
     * 
     * @type {Values}
     * @memberof Model4
     */
    values: Values;
    /**
     * 
     * @type {string}
     * @memberof Model4
     */
    containerId?: string;
    /**
     * 
     * @type {string}
     * @memberof Model4
     */
    missionId?: string;
}

export function Model4FromJSON(json: any): Model4 {
    return Model4FromJSONTyped(json, false);
}

export function Model4FromJSONTyped(json: any, ignoreDiscriminator: boolean): Model4 {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'deviceId': json['deviceId'],
        'values': ValuesFromJSON(json['values']),
        'containerId': !exists(json, 'containerId') ? undefined : json['containerId'],
        'missionId': !exists(json, 'missionId') ? undefined : json['missionId'],
    };
}

export function Model4ToJSON(value?: Model4 | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'deviceId': value.deviceId,
        'values': ValuesToJSON(value.values),
        'containerId': value.containerId,
        'missionId': value.missionId,
    };
}


