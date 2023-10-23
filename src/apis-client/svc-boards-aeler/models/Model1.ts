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
 * @interface Model1
 */
export interface Model1 {
    /**
     * 
     * @type {number}
     * @memberof Model1
     */
    tSleepSeconds?: number;
    /**
     * 
     * @type {number}
     * @memberof Model1
     */
    nWakeForCom?: number;
    /**
     * 
     * @type {number}
     * @memberof Model1
     */
    targetAutonomy?: number;
    /**
     * 
     * @type {number}
     * @memberof Model1
     */
    powerCtrlMode?: number;
    /**
     * 
     * @type {number}
     * @memberof Model1
     */
    batterySoCfromVoC?: number;
    /**
     * 
     * @type {number}
     * @memberof Model1
     */
    batterySoCfromCoulomb?: number;
    /**
     * 
     * @type {number}
     * @memberof Model1
     */
    batterySoH?: number;
    /**
     * 
     * @type {number}
     * @memberof Model1
     */
    projectedAutonomy?: number;
    /**
     * 
     * @type {Date}
     * @memberof Model1
     */
    updatedAt: Date;
}

export function Model1FromJSON(json: any): Model1 {
    return Model1FromJSONTyped(json, false);
}

export function Model1FromJSONTyped(json: any, ignoreDiscriminator: boolean): Model1 {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'tSleepSeconds': !exists(json, 'tSleepSeconds') ? undefined : json['tSleepSeconds'],
        'nWakeForCom': !exists(json, 'nWakeForCom') ? undefined : json['nWakeForCom'],
        'targetAutonomy': !exists(json, 'targetAutonomy') ? undefined : json['targetAutonomy'],
        'powerCtrlMode': !exists(json, 'powerCtrlMode') ? undefined : json['powerCtrlMode'],
        'batterySoCfromVoC': !exists(json, 'batterySoCfromVoC') ? undefined : json['batterySoCfromVoC'],
        'batterySoCfromCoulomb': !exists(json, 'batterySoCfromCoulomb') ? undefined : json['batterySoCfromCoulomb'],
        'batterySoH': !exists(json, 'batterySoH') ? undefined : json['batterySoH'],
        'projectedAutonomy': !exists(json, 'projectedAutonomy') ? undefined : json['projectedAutonomy'],
        'updatedAt': (new Date(json['updatedAt'])),
    };
}

export function Model1ToJSON(value?: Model1 | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'tSleepSeconds': value.tSleepSeconds,
        'nWakeForCom': value.nWakeForCom,
        'targetAutonomy': value.targetAutonomy,
        'powerCtrlMode': value.powerCtrlMode,
        'batterySoCfromVoC': value.batterySoCfromVoC,
        'batterySoCfromCoulomb': value.batterySoCfromCoulomb,
        'batterySoH': value.batterySoH,
        'projectedAutonomy': value.projectedAutonomy,
        'updatedAt': (value.updatedAt.toISOString()),
    };
}

