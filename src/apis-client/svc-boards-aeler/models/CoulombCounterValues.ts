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
 * @interface CoulombCounterValues
 */
export interface CoulombCounterValues {
    /**
     * 
     * @type {number}
     * @memberof CoulombCounterValues
     */
    statusRegister?: number;
    /**
     * 
     * @type {number}
     * @memberof CoulombCounterValues
     */
    controlRegister?: number;
    /**
     * 
     * @type {number}
     * @memberof CoulombCounterValues
     */
    fsmState?: number;
    /**
     * 
     * @type {number}
     * @memberof CoulombCounterValues
     */
    eventID?: number;
    /**
     * 
     * @type {number}
     * @memberof CoulombCounterValues
     */
    metadata?: number;
    /**
     * 
     * @type {number}
     * @memberof CoulombCounterValues
     */
    accumulatedCharge?: number;
    /**
     * 
     * @type {number}
     * @memberof CoulombCounterValues
     */
    voltage?: number;
    /**
     * 
     * @type {number}
     * @memberof CoulombCounterValues
     */
    current?: number;
    /**
     * 
     * @type {number}
     * @memberof CoulombCounterValues
     */
    temperature?: number;
}

export function CoulombCounterValuesFromJSON(json: any): CoulombCounterValues {
    return CoulombCounterValuesFromJSONTyped(json, false);
}

export function CoulombCounterValuesFromJSONTyped(json: any, ignoreDiscriminator: boolean): CoulombCounterValues {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'statusRegister': !exists(json, 'statusRegister') ? undefined : json['statusRegister'],
        'controlRegister': !exists(json, 'controlRegister') ? undefined : json['controlRegister'],
        'fsmState': !exists(json, 'fsmState') ? undefined : json['fsmState'],
        'eventID': !exists(json, 'eventID') ? undefined : json['eventID'],
        'metadata': !exists(json, 'metadata') ? undefined : json['metadata'],
        'accumulatedCharge': !exists(json, 'accumulatedCharge') ? undefined : json['accumulatedCharge'],
        'voltage': !exists(json, 'voltage') ? undefined : json['voltage'],
        'current': !exists(json, 'current') ? undefined : json['current'],
        'temperature': !exists(json, 'temperature') ? undefined : json['temperature'],
    };
}

export function CoulombCounterValuesToJSON(value?: CoulombCounterValues | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'statusRegister': value.statusRegister,
        'controlRegister': value.controlRegister,
        'fsmState': value.fsmState,
        'eventID': value.eventID,
        'metadata': value.metadata,
        'accumulatedCharge': value.accumulatedCharge,
        'voltage': value.voltage,
        'current': value.current,
        'temperature': value.temperature,
    };
}


