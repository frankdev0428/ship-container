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
    Contact,
    ContactFromJSON,
    ContactFromJSONTyped,
    ContactToJSON,
} from './';

/**
 * 
 * @export
 * @interface DepotContactInput
 */
export interface DepotContactInput {
    /**
     * 
     * @type {string}
     * @memberof DepotContactInput
     */
    depotId: string;
    /**
     * 
     * @type {Contact}
     * @memberof DepotContactInput
     */
    contact: Contact;
    /**
     * 
     * @type {string}
     * @memberof DepotContactInput
     */
    role?: string;
    /**
     * 
     * @type {boolean}
     * @memberof DepotContactInput
     */
    isRemoveFromBookingConfirmation?: boolean;
}

export function DepotContactInputFromJSON(json: any): DepotContactInput {
    return DepotContactInputFromJSONTyped(json, false);
}

export function DepotContactInputFromJSONTyped(json: any, ignoreDiscriminator: boolean): DepotContactInput {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'depotId': json['depotId'],
        'contact': ContactFromJSON(json['contact']),
        'role': !exists(json, 'role') ? undefined : json['role'],
        'isRemoveFromBookingConfirmation': !exists(json, 'isRemoveFromBookingConfirmation') ? undefined : json['isRemoveFromBookingConfirmation'],
    };
}

export function DepotContactInputToJSON(value?: DepotContactInput | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'depotId': value.depotId,
        'contact': ContactToJSON(value.contact),
        'role': value.role,
        'isRemoveFromBookingConfirmation': value.isRemoveFromBookingConfirmation,
    };
}


