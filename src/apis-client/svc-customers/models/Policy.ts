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
 * @interface Policy
 */
export interface Policy {
    /**
     * 
     * @type {string}
     * @memberof Policy
     */
    name: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof Policy
     */
    actions: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof Policy
     */
    policyId: string;
}

export function PolicyFromJSON(json: any): Policy {
    return PolicyFromJSONTyped(json, false);
}

export function PolicyFromJSONTyped(json: any, ignoreDiscriminator: boolean): Policy {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'name': json['name'],
        'actions': json['actions'],
        'policyId': json['policyId'],
    };
}

export function PolicyToJSON(value?: Policy | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'name': value.name,
        'actions': value.actions,
        'policyId': value.policyId,
    };
}


