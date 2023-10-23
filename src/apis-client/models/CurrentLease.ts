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
 * @interface CurrentLease
 */
export interface CurrentLease {
    /**
     * 66ba6899-11b9-44cb-bd11-afbaeab9bf8c
     * @type {string}
     * @memberof CurrentLease
     */
    contractId: string;
    /**
     * ord_01
     * @type {string}
     * @memberof CurrentLease
     */
    orderId: string;
    /**
     * b89519d7-14a7-46f7-a333-40d83618ae0d
     * @type {string}
     * @memberof CurrentLease
     */
    customerId: string;
    /**
     * 2021-10-10T12:00:00.000Z
     * @type {Date}
     * @memberof CurrentLease
     */
    timePlaced: Date;
    /**
     * ici
     * @type {string}
     * @memberof CurrentLease
     */
    pickupLocation: string;
    /**
     * la
     * @type {string}
     * @memberof CurrentLease
     */
    dropoffLocation: string;
    /**
     * 2021-10-10T10:00:00.000Z
     * @type {Date}
     * @memberof CurrentLease
     */
    returnDate: Date;
    /**
     * 2021-10-10T10:00:00.000Z
     * @type {Date}
     * @memberof CurrentLease
     */
    executionDate: Date;
    /**
     * 1
     * @type {number}
     * @memberof CurrentLease
     */
    units: number;
    /**
     * orderStatus
     * @type {string}
     * @memberof CurrentLease
     */
    orderStatus: CurrentLeaseOrderStatusEnum;
    /**
     * contractStatus
     * @type {string}
     * @memberof CurrentLease
     */
    contractStatus: CurrentLeaseContractStatusEnum;
}

/**
* @export
* @enum {string}
*/
export enum CurrentLeaseOrderStatusEnum {
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
export enum CurrentLeaseContractStatusEnum {
    Stl = 'STL',
    Ltl = 'LTL',
    Ael = 'AEL',
    Owl = 'OWL',
    Sal = 'SAL'
}

export function CurrentLeaseFromJSON(json: any): CurrentLease {
    return CurrentLeaseFromJSONTyped(json, false);
}

export function CurrentLeaseFromJSONTyped(json: any, ignoreDiscriminator: boolean): CurrentLease {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'contractId': json['contractId'],
        'orderId': json['orderId'],
        'customerId': json['customerId'],
        'timePlaced': (new Date(json['timePlaced'])),
        'pickupLocation': json['pickupLocation'],
        'dropoffLocation': json['dropoffLocation'],
        'returnDate': (new Date(json['returnDate'])),
        'executionDate': (new Date(json['executionDate'])),
        'units': json['units'],
        'orderStatus': json['orderStatus'],
        'contractStatus': json['contractStatus'],
    };
}

export function CurrentLeaseToJSON(value?: CurrentLease | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'contractId': value.contractId,
        'orderId': value.orderId,
        'customerId': value.customerId,
        'timePlaced': (value.timePlaced.toISOString()),
        'pickupLocation': value.pickupLocation,
        'dropoffLocation': value.dropoffLocation,
        'returnDate': (value.returnDate.toISOString()),
        'executionDate': (value.executionDate.toISOString()),
        'units': value.units,
        'orderStatus': value.orderStatus,
        'contractStatus': value.contractStatus,
    };
}


