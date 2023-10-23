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
 * @interface SystemMonitorServiceValues
 */
export interface SystemMonitorServiceValues {
    /**
     * 
     * @type {number}
     * @memberof SystemMonitorServiceValues
     */
    containerId?: number;
    /**
     * 
     * @type {number}
     * @memberof SystemMonitorServiceValues
     */
    avgCpu?: number;
    /**
     * 
     * @type {number}
     * @memberof SystemMonitorServiceValues
     */
    minCpu?: number;
    /**
     * 
     * @type {number}
     * @memberof SystemMonitorServiceValues
     */
    maxCpu?: number;
    /**
     * 
     * @type {number}
     * @memberof SystemMonitorServiceValues
     */
    avgMem?: number;
    /**
     * 
     * @type {number}
     * @memberof SystemMonitorServiceValues
     */
    minMem?: number;
    /**
     * 
     * @type {number}
     * @memberof SystemMonitorServiceValues
     */
    maxMem?: number;
    /**
     * 
     * @type {number}
     * @memberof SystemMonitorServiceValues
     */
    statusUptime?: number;
}

export function SystemMonitorServiceValuesFromJSON(json: any): SystemMonitorServiceValues {
    return SystemMonitorServiceValuesFromJSONTyped(json, false);
}

export function SystemMonitorServiceValuesFromJSONTyped(json: any, ignoreDiscriminator: boolean): SystemMonitorServiceValues {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'containerId': !exists(json, 'containerId') ? undefined : json['containerId'],
        'avgCpu': !exists(json, 'avgCpu') ? undefined : json['avgCpu'],
        'minCpu': !exists(json, 'minCpu') ? undefined : json['minCpu'],
        'maxCpu': !exists(json, 'maxCpu') ? undefined : json['maxCpu'],
        'avgMem': !exists(json, 'avgMem') ? undefined : json['avgMem'],
        'minMem': !exists(json, 'minMem') ? undefined : json['minMem'],
        'maxMem': !exists(json, 'maxMem') ? undefined : json['maxMem'],
        'statusUptime': !exists(json, 'statusUptime') ? undefined : json['statusUptime'],
    };
}

export function SystemMonitorServiceValuesToJSON(value?: SystemMonitorServiceValues | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'containerId': value.containerId,
        'avgCpu': value.avgCpu,
        'minCpu': value.minCpu,
        'maxCpu': value.maxCpu,
        'avgMem': value.avgMem,
        'minMem': value.minMem,
        'maxMem': value.maxMem,
        'statusUptime': value.statusUptime,
    };
}

