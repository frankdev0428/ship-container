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
    AllValues,
    AllValuesFromJSON,
    AllValuesFromJSONTyped,
    AllValuesToJSON,
} from './';

/**
 * 
 * @export
 * @interface TimedSample
 */
export interface TimedSample {
    /**
     * 
     * @type {Date}
     * @memberof TimedSample
     */
    time: Date;
    /**
     * 
     * @type {Date}
     * @memberof TimedSample
     */
    timeReceived: Date;
    /**
     * 
     * @type {AllValues}
     * @memberof TimedSample
     */
    values: AllValues;
}

export function TimedSampleFromJSON(json: any): TimedSample {
    return TimedSampleFromJSONTyped(json, false);
}

export function TimedSampleFromJSONTyped(json: any, ignoreDiscriminator: boolean): TimedSample {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'time': (new Date(json['time'])),
        'timeReceived': (new Date(json['timeReceived'])),
        'values': AllValuesFromJSON(json['values']),
    };
}

export function TimedSampleToJSON(value?: TimedSample | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'time': (value.time.toISOString()),
        'timeReceived': (value.timeReceived.toISOString()),
        'values': AllValuesToJSON(value.values),
    };
}


