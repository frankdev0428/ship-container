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
 * @interface MsgBatteryManagerUpdatedAt
 */
export interface MsgBatteryManagerUpdatedAt {
    /**
     * 
     * @type {number}
     * @memberof MsgBatteryManagerUpdatedAt
     */
    charger?: number;
    /**
     * 
     * @type {number}
     * @memberof MsgBatteryManagerUpdatedAt
     */
    system?: number;
    /**
     * 
     * @type {number}
     * @memberof MsgBatteryManagerUpdatedAt
     */
    supply?: number;
    /**
     * 
     * @type {number}
     * @memberof MsgBatteryManagerUpdatedAt
     */
    ts0?: number;
    /**
     * 
     * @type {number}
     * @memberof MsgBatteryManagerUpdatedAt
     */
    ts1?: number;
    /**
     * 
     * @type {number}
     * @memberof MsgBatteryManagerUpdatedAt
     */
    ts2?: number;
    /**
     * 
     * @type {number}
     * @memberof MsgBatteryManagerUpdatedAt
     */
    ts3?: number;
    /**
     * 
     * @type {number}
     * @memberof MsgBatteryManagerUpdatedAt
     */
    chargerFaults?: number;
    /**
     * 
     * @type {number}
     * @memberof MsgBatteryManagerUpdatedAt
     */
    fwVersion?: number;
    /**
     * 
     * @type {number}
     * @memberof MsgBatteryManagerUpdatedAt
     */
    bootCRC?: number;
    /**
     * 
     * @type {number}
     * @memberof MsgBatteryManagerUpdatedAt
     */
    cfgCRC?: number;
    /**
     * 
     * @type {number}
     * @memberof MsgBatteryManagerUpdatedAt
     */
    tBat?: number;
    /**
     * 
     * @type {number}
     * @memberof MsgBatteryManagerUpdatedAt
     */
    powerOut?: number;
    /**
     * 
     * @type {number}
     * @memberof MsgBatteryManagerUpdatedAt
     */
    powerIn?: number;
    /**
     * 
     * @type {number}
     * @memberof MsgBatteryManagerUpdatedAt
     */
    efficiency?: number;
    /**
     * 
     * @type {number}
     * @memberof MsgBatteryManagerUpdatedAt
     */
    iOut?: number;
    /**
     * 
     * @type {number}
     * @memberof MsgBatteryManagerUpdatedAt
     */
    iIn?: number;
    /**
     * 
     * @type {number}
     * @memberof MsgBatteryManagerUpdatedAt
     */
    vBat?: number;
    /**
     * 
     * @type {number}
     * @memberof MsgBatteryManagerUpdatedAt
     */
    vIn?: number;
    /**
     * 
     * @type {number}
     * @memberof MsgBatteryManagerUpdatedAt
     */
    vInr?: number;
    /**
     * 
     * @type {Date}
     * @memberof MsgBatteryManagerUpdatedAt
     */
    updatedAt: Date;
}

export function MsgBatteryManagerUpdatedAtFromJSON(json: any): MsgBatteryManagerUpdatedAt {
    return MsgBatteryManagerUpdatedAtFromJSONTyped(json, false);
}

export function MsgBatteryManagerUpdatedAtFromJSONTyped(json: any, ignoreDiscriminator: boolean): MsgBatteryManagerUpdatedAt {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'charger': !exists(json, 'charger') ? undefined : json['charger'],
        'system': !exists(json, 'system') ? undefined : json['system'],
        'supply': !exists(json, 'supply') ? undefined : json['supply'],
        'ts0': !exists(json, 'ts0') ? undefined : json['ts0'],
        'ts1': !exists(json, 'ts1') ? undefined : json['ts1'],
        'ts2': !exists(json, 'ts2') ? undefined : json['ts2'],
        'ts3': !exists(json, 'ts3') ? undefined : json['ts3'],
        'chargerFaults': !exists(json, 'chargerFaults') ? undefined : json['chargerFaults'],
        'fwVersion': !exists(json, 'fwVersion') ? undefined : json['fwVersion'],
        'bootCRC': !exists(json, 'bootCRC') ? undefined : json['bootCRC'],
        'cfgCRC': !exists(json, 'cfgCRC') ? undefined : json['cfgCRC'],
        'tBat': !exists(json, 'tBat') ? undefined : json['tBat'],
        'powerOut': !exists(json, 'powerOut') ? undefined : json['powerOut'],
        'powerIn': !exists(json, 'powerIn') ? undefined : json['powerIn'],
        'efficiency': !exists(json, 'efficiency') ? undefined : json['efficiency'],
        'iOut': !exists(json, 'iOut') ? undefined : json['iOut'],
        'iIn': !exists(json, 'iIn') ? undefined : json['iIn'],
        'vBat': !exists(json, 'vBat') ? undefined : json['vBat'],
        'vIn': !exists(json, 'vIn') ? undefined : json['vIn'],
        'vInr': !exists(json, 'vInr') ? undefined : json['vInr'],
        'updatedAt': (new Date(json['updatedAt'])),
    };
}

export function MsgBatteryManagerUpdatedAtToJSON(value?: MsgBatteryManagerUpdatedAt | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'charger': value.charger,
        'system': value.system,
        'supply': value.supply,
        'ts0': value.ts0,
        'ts1': value.ts1,
        'ts2': value.ts2,
        'ts3': value.ts3,
        'chargerFaults': value.chargerFaults,
        'fwVersion': value.fwVersion,
        'bootCRC': value.bootCRC,
        'cfgCRC': value.cfgCRC,
        'tBat': value.tBat,
        'powerOut': value.powerOut,
        'powerIn': value.powerIn,
        'efficiency': value.efficiency,
        'iOut': value.iOut,
        'iIn': value.iIn,
        'vBat': value.vBat,
        'vIn': value.vIn,
        'vInr': value.vInr,
        'updatedAt': (value.updatedAt.toISOString()),
    };
}

