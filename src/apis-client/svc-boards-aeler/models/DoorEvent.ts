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
 * @interface DoorEvent
 */
export interface DoorEvent {
    /**
     * unparsed Port values
     * @type {number}
     * @memberof DoorEvent
     */
    inputPortRegister?: number;
    /**
     * port pin cursor (debugging)
     * @type {number}
     * @memberof DoorEvent
     */
    eventPinCursor?: number;
    /**
     * First door sensor - 1 is closed 0 is open
     * @type {number}
     * @memberof DoorEvent
     */
    door?: number;
    /**
     * Second door sensor, redundant - 1 is closed 0 is open
     * @type {number}
     * @memberof DoorEvent
     */
    doorBackup?: number;
    /**
     * 
     * @type {string}
     * @memberof DoorEvent
     */
    doorStatus?: DoorEventDoorStatusEnum;
}

/**
* @export
* @enum {string}
*/
export enum DoorEventDoorStatusEnum {
    Opened = 'opened',
    Closed = 'closed'
}

export function DoorEventFromJSON(json: any): DoorEvent {
    return DoorEventFromJSONTyped(json, false);
}

export function DoorEventFromJSONTyped(json: any, ignoreDiscriminator: boolean): DoorEvent {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'inputPortRegister': !exists(json, 'inputPortRegister') ? undefined : json['inputPortRegister'],
        'eventPinCursor': !exists(json, 'eventPinCursor') ? undefined : json['eventPinCursor'],
        'door': !exists(json, 'door') ? undefined : json['door'],
        'doorBackup': !exists(json, 'doorBackup') ? undefined : json['doorBackup'],
        'doorStatus': !exists(json, 'doorStatus') ? undefined : json['doorStatus'],
    };
}

export function DoorEventToJSON(value?: DoorEvent | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'inputPortRegister': value.inputPortRegister,
        'eventPinCursor': value.eventPinCursor,
        'door': value.door,
        'doorBackup': value.doorBackup,
        'doorStatus': value.doorStatus,
    };
}

