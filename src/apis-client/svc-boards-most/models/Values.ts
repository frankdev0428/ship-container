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
    Events,
    EventsFromJSON,
    EventsFromJSONTyped,
    EventsToJSON,
    Location,
    LocationFromJSON,
    LocationFromJSONTyped,
    LocationToJSON,
    Sensors,
    SensorsFromJSON,
    SensorsFromJSONTyped,
    SensorsToJSON,
} from './';

/**
 * 
 * @export
 * @interface Values
 */
export interface Values {
    /**
     * 
     * @type {Date}
     * @memberof Values
     */
    measurementTime: Date;
    /**
     * 
     * @type {string}
     * @memberof Values
     */
    measurementType: ValuesMeasurementTypeEnum;
    /**
     * 
     * @type {Sensors}
     * @memberof Values
     */
    sensors?: Sensors;
    /**
     * 
     * @type {Events}
     * @memberof Values
     */
    events?: Events;
    /**
     * 
     * @type {Location}
     * @memberof Values
     */
    location?: Location;
}

/**
* @export
* @enum {string}
*/
export enum ValuesMeasurementTypeEnum {
    Sensors = 'sensors',
    Location = 'location',
    Events = 'events'
}

export function ValuesFromJSON(json: any): Values {
    return ValuesFromJSONTyped(json, false);
}

export function ValuesFromJSONTyped(json: any, ignoreDiscriminator: boolean): Values {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'measurementTime': (new Date(json['measurementTime'])),
        'measurementType': json['measurementType'],
        'sensors': !exists(json, 'sensors') ? undefined : SensorsFromJSON(json['sensors']),
        'events': !exists(json, 'events') ? undefined : EventsFromJSON(json['events']),
        'location': !exists(json, 'location') ? undefined : LocationFromJSON(json['location']),
    };
}

export function ValuesToJSON(value?: Values | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'measurementTime': (value.measurementTime.toISOString().substr(0,10)),
        'measurementType': value.measurementType,
        'sensors': SensorsToJSON(value.sensors),
        'events': EventsToJSON(value.events),
        'location': LocationToJSON(value.location),
    };
}


