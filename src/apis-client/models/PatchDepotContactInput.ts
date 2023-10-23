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
 * @interface PatchDepotContactInput
 */
export interface PatchDepotContactInput {
    /**
     * 
     * @type {Contact}
     * @memberof PatchDepotContactInput
     */
    contact: Contact;
    /**
     * 
     * @type {string}
     * @memberof PatchDepotContactInput
     */
    role?: string;
    /**
     * 
     * @type {boolean}
     * @memberof PatchDepotContactInput
     */
    isRemoveFromBookingConfirmation?: boolean;
}

export function PatchDepotContactInputFromJSON(json: any): PatchDepotContactInput {
    return PatchDepotContactInputFromJSONTyped(json, false);
}

export function PatchDepotContactInputFromJSONTyped(json: any, ignoreDiscriminator: boolean): PatchDepotContactInput {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'contact': ContactFromJSON(json['contact']),
        'role': !exists(json, 'role') ? undefined : json['role'],
        'isRemoveFromBookingConfirmation': !exists(json, 'isRemoveFromBookingConfirmation') ? undefined : json['isRemoveFromBookingConfirmation'],
    };
}

export function PatchDepotContactInputToJSON(value?: PatchDepotContactInput | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'contact': ContactToJSON(value.contact),
        'role': value.role,
        'isRemoveFromBookingConfirmation': value.isRemoveFromBookingConfirmation,
    };
}


