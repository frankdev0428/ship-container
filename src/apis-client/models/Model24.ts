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
 * @interface Model24
 */
export interface Model24 {
    /**
     * 
     * @type {string}
     * @memberof Model24
     */
    customerId: string;
    /**
     * 
     * @type {number}
     * @memberof Model24
     */
    ordersTotal: number;
}

export function Model24FromJSON(json: any): Model24 {
    return Model24FromJSONTyped(json, false);
}

export function Model24FromJSONTyped(json: any, ignoreDiscriminator: boolean): Model24 {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'customerId': json['customerId'],
        'ordersTotal': json['ordersTotal'],
    };
}

export function Model24ToJSON(value?: Model24 | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'customerId': value.customerId,
        'ordersTotal': value.ordersTotal,
    };
}

