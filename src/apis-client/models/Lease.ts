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
 * @interface Lease
 */
export interface Lease {
    /**
     * 
     * @type {string}
     * @memberof Lease
     */
    orderId: string;
    /**
     * 
     * @type {string}
     * @memberof Lease
     */
    customerId: string;
    /**
     * Time/Date Order was placed in reality
     * @type {Date}
     * @memberof Lease
     */
    timePlaced: Date;
    /**
     * 
     * @type {string}
     * @memberof Lease
     */
    pickupLocation: string;
    /**
     * 
     * @type {string}
     * @memberof Lease
     */
    dropoffLocation: string;
    /**
     * Time/Date pre-agreed return date
     * @type {Date}
     * @memberof Lease
     */
    returnDate: Date;
    /**
     * Time/Date the order begins
     * @type {Date}
     * @memberof Lease
     */
    executionDate: Date;
    /**
     * Number of units requested
     * @type {number}
     * @memberof Lease
     */
    units: number;
    /**
     * Customers own booking number
     * @type {string}
     * @memberof Lease
     */
    customersBookingNumber?: string;
}

export function LeaseFromJSON(json: any): Lease {
    return LeaseFromJSONTyped(json, false);
}

export function LeaseFromJSONTyped(json: any, ignoreDiscriminator: boolean): Lease {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'orderId': json['orderId'],
        'customerId': json['customerId'],
        'timePlaced': (new Date(json['timePlaced'])),
        'pickupLocation': json['pickupLocation'],
        'dropoffLocation': json['dropoffLocation'],
        'returnDate': (new Date(json['returnDate'])),
        'executionDate': (new Date(json['executionDate'])),
        'units': json['units'],
        'customersBookingNumber': !exists(json, 'customersBookingNumber') ? undefined : json['customersBookingNumber'],
    };
}

export function LeaseToJSON(value?: Lease | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'orderId': value.orderId,
        'customerId': value.customerId,
        'timePlaced': (value.timePlaced.toISOString()),
        'pickupLocation': value.pickupLocation,
        'dropoffLocation': value.dropoffLocation,
        'returnDate': (value.returnDate.toISOString()),
        'executionDate': (value.executionDate.toISOString()),
        'units': value.units,
        'customersBookingNumber': value.customersBookingNumber,
    };
}


