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
 * @interface EquipmentMoveStatus
 */
export interface EquipmentMoveStatus {
    /**
     * 
     * @type {string}
     * @memberof EquipmentMoveStatus
     */
    moveId: string;
    /**
     * When the move status was submitted
     * @type {Date}
     * @memberof EquipmentMoveStatus
     */
    createdAt: Date;
    /**
     * 
     * @type {string}
     * @memberof EquipmentMoveStatus
     */
    status: EquipmentMoveStatusStatusEnum;
    /**
     * the last user who changed the object
     * @type {string}
     * @memberof EquipmentMoveStatus
     */
    lastChangedByUserId?: string;
    /**
     * 
     * @type {string}
     * @memberof EquipmentMoveStatus
     */
    lastOperation?: EquipmentMoveStatusLastOperationEnum;
}

/**
* @export
* @enum {string}
*/
export enum EquipmentMoveStatusStatusEnum {
    Departed = 'DEPARTED',
    Arrived = 'ARRIVED'
}/**
* @export
* @enum {string}
*/
export enum EquipmentMoveStatusLastOperationEnum {
    D = 'D',
    C = 'C',
    U = 'U'
}

export function EquipmentMoveStatusFromJSON(json: any): EquipmentMoveStatus {
    return EquipmentMoveStatusFromJSONTyped(json, false);
}

export function EquipmentMoveStatusFromJSONTyped(json: any, ignoreDiscriminator: boolean): EquipmentMoveStatus {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'moveId': json['moveId'],
        'createdAt': (new Date(json['createdAt'])),
        'status': json['status'],
        'lastChangedByUserId': !exists(json, 'lastChangedByUserId') ? undefined : json['lastChangedByUserId'],
        'lastOperation': !exists(json, 'lastOperation') ? undefined : json['lastOperation'],
    };
}

export function EquipmentMoveStatusToJSON(value?: EquipmentMoveStatus | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'moveId': value.moveId,
        'createdAt': (value.createdAt.toISOString()),
        'status': value.status,
        'lastChangedByUserId': value.lastChangedByUserId,
        'lastOperation': value.lastOperation,
    };
}


