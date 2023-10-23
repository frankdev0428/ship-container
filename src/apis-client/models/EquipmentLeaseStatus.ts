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
 * @interface EquipmentLeaseStatus
 */
export interface EquipmentLeaseStatus {
    /**
     * 
     * @type {string}
     * @memberof EquipmentLeaseStatus
     */
    orderId: string;
    /**
     * When the order status was submitted
     * @type {Date}
     * @memberof EquipmentLeaseStatus
     */
    createdAt: Date;
    /**
     * orderStatus
     * @type {string}
     * @memberof EquipmentLeaseStatus
     */
    orderStatus: EquipmentLeaseStatusOrderStatusEnum;
    /**
     * contractStatus
     * @type {string}
     * @memberof EquipmentLeaseStatus
     */
    contractStatus: EquipmentLeaseStatusContractStatusEnum;
    /**
     * is it current
     * @type {boolean}
     * @memberof EquipmentLeaseStatus
     */
    isCurrent: boolean;
    /**
     * the last user who changed the object
     * @type {string}
     * @memberof EquipmentLeaseStatus
     */
    lastChangedByUserId?: string;
    /**
     * 
     * @type {string}
     * @memberof EquipmentLeaseStatus
     */
    lastOperation?: EquipmentLeaseStatusLastOperationEnum;
}

/**
* @export
* @enum {string}
*/
export enum EquipmentLeaseStatusOrderStatusEnum {
    Created = 'CREATED',
    Accepted = 'ACCEPTED',
    AelerCanceled = 'AELER-CANCELED',
    CustomerCanceled = 'CUSTOMER-CANCELED',
    CompletedFulfilled = 'COMPLETED-FULFILLED',
    CompletedFailed = 'COMPLETED-FAILED'
}/**
* @export
* @enum {string}
*/
export enum EquipmentLeaseStatusContractStatusEnum {
    Stl = 'STL',
    Ltl = 'LTL',
    Ael = 'AEL',
    Owl = 'OWL',
    Sal = 'SAL'
}/**
* @export
* @enum {string}
*/
export enum EquipmentLeaseStatusLastOperationEnum {
    D = 'D',
    C = 'C',
    U = 'U'
}

export function EquipmentLeaseStatusFromJSON(json: any): EquipmentLeaseStatus {
    return EquipmentLeaseStatusFromJSONTyped(json, false);
}

export function EquipmentLeaseStatusFromJSONTyped(json: any, ignoreDiscriminator: boolean): EquipmentLeaseStatus {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'orderId': json['orderId'],
        'createdAt': (new Date(json['createdAt'])),
        'orderStatus': json['orderStatus'],
        'contractStatus': json['contractStatus'],
        'isCurrent': json['isCurrent'],
        'lastChangedByUserId': !exists(json, 'lastChangedByUserId') ? undefined : json['lastChangedByUserId'],
        'lastOperation': !exists(json, 'lastOperation') ? undefined : json['lastOperation'],
    };
}

export function EquipmentLeaseStatusToJSON(value?: EquipmentLeaseStatus | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'orderId': value.orderId,
        'createdAt': (value.createdAt.toISOString()),
        'orderStatus': value.orderStatus,
        'contractStatus': value.contractStatus,
        'isCurrent': value.isCurrent,
        'lastChangedByUserId': value.lastChangedByUserId,
        'lastOperation': value.lastOperation,
    };
}


