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
    EquipmentStatus,
    EquipmentStatusFromJSON,
    EquipmentStatusFromJSONTyped,
    EquipmentStatusToJSON,
    PublicEquipmentLease,
    PublicEquipmentLeaseFromJSON,
    PublicEquipmentLeaseFromJSONTyped,
    PublicEquipmentLeaseToJSON,
} from './';

/**
 * 
 * @export
 * @interface EquipmentLeaseContractWithLease
 */
export interface EquipmentLeaseContractWithLease {
    /**
     * 
     * @type {string}
     * @memberof EquipmentLeaseContractWithLease
     */
    equipmentLeaseContractId: string;
    /**
     * 
     * @type {string}
     * @memberof EquipmentLeaseContractWithLease
     */
    equipmentId: string;
    /**
     * 
     * @type {string}
     * @memberof EquipmentLeaseContractWithLease
     */
    orderId: string;
    /**
     * createdAt
     * @type {Date}
     * @memberof EquipmentLeaseContractWithLease
     */
    createdAt: Date;
    /**
     * active or canceled allocation
     * @type {boolean}
     * @memberof EquipmentLeaseContractWithLease
     */
    active: boolean;
    /**
     * 
     * @type {string}
     * @memberof EquipmentLeaseContractWithLease
     */
    comment?: string;
    /**
     * the last user who changed the object
     * @type {string}
     * @memberof EquipmentLeaseContractWithLease
     */
    lastChangedByUserId?: string;
    /**
     * 
     * @type {string}
     * @memberof EquipmentLeaseContractWithLease
     */
    lastOperation?: EquipmentLeaseContractWithLeaseLastOperationEnum;
    /**
     * 
     * @type {PublicEquipmentLease}
     * @memberof EquipmentLeaseContractWithLease
     */
    equipmentlease?: PublicEquipmentLease;
    /**
     * 
     * @type {EquipmentStatus}
     * @memberof EquipmentLeaseContractWithLease
     */
    equipmentstatus?: EquipmentStatus;
}

/**
* @export
* @enum {string}
*/
export enum EquipmentLeaseContractWithLeaseLastOperationEnum {
    D = 'D',
    C = 'C',
    U = 'U'
}

export function EquipmentLeaseContractWithLeaseFromJSON(json: any): EquipmentLeaseContractWithLease {
    return EquipmentLeaseContractWithLeaseFromJSONTyped(json, false);
}

export function EquipmentLeaseContractWithLeaseFromJSONTyped(json: any, ignoreDiscriminator: boolean): EquipmentLeaseContractWithLease {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'equipmentLeaseContractId': json['equipmentLeaseContractId'],
        'equipmentId': json['equipmentId'],
        'orderId': json['orderId'],
        'createdAt': (new Date(json['createdAt'])),
        'active': json['active'],
        'comment': !exists(json, 'comment') ? undefined : json['comment'],
        'lastChangedByUserId': !exists(json, 'lastChangedByUserId') ? undefined : json['lastChangedByUserId'],
        'lastOperation': !exists(json, 'lastOperation') ? undefined : json['lastOperation'],
        'equipmentlease': !exists(json, 'equipmentlease') ? undefined : PublicEquipmentLeaseFromJSON(json['equipmentlease']),
        'equipmentstatus': !exists(json, 'equipmentstatus') ? undefined : EquipmentStatusFromJSON(json['equipmentstatus']),
    };
}

export function EquipmentLeaseContractWithLeaseToJSON(value?: EquipmentLeaseContractWithLease | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'equipmentLeaseContractId': value.equipmentLeaseContractId,
        'equipmentId': value.equipmentId,
        'orderId': value.orderId,
        'createdAt': (value.createdAt.toISOString()),
        'active': value.active,
        'comment': value.comment,
        'lastChangedByUserId': value.lastChangedByUserId,
        'lastOperation': value.lastOperation,
        'equipmentlease': PublicEquipmentLeaseToJSON(value.equipmentlease),
        'equipmentstatus': EquipmentStatusToJSON(value.equipmentstatus),
    };
}


