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
 * @interface AlertInfo
 */
export interface AlertInfo {
    /**
     * 
     * @type {string}
     * @memberof AlertInfo
     */
    orderId?: string;
    /**
     * 
     * @type {string}
     * @memberof AlertInfo
     */
    containerId?: string;
    /**
     * 
     * @type {string}
     * @memberof AlertInfo
     */
    customerId?: string;
    /**
     * 
     * @type {string}
     * @memberof AlertInfo
     */
    depotId?: string;
}

export function AlertInfoFromJSON(json: any): AlertInfo {
    return AlertInfoFromJSONTyped(json, false);
}

export function AlertInfoFromJSONTyped(json: any, ignoreDiscriminator: boolean): AlertInfo {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'orderId': !exists(json, 'orderId') ? undefined : json['orderId'],
        'containerId': !exists(json, 'containerId') ? undefined : json['containerId'],
        'customerId': !exists(json, 'customerId') ? undefined : json['customerId'],
        'depotId': !exists(json, 'depotId') ? undefined : json['depotId'],
    };
}

export function AlertInfoToJSON(value?: AlertInfo | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'orderId': value.orderId,
        'containerId': value.containerId,
        'customerId': value.customerId,
        'depotId': value.depotId,
    };
}


