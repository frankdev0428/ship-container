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
 * @interface Status
 */
export interface Status {
    /**
     * contractStatus
     * @type {string}
     * @memberof Status
     */
    contractStatus: StatusContractStatusEnum;
}

/**
* @export
* @enum {string}
*/
export enum StatusContractStatusEnum {
    Stl = 'STL',
    Ltl = 'LTL',
    Ael = 'AEL',
    Owl = 'OWL',
    Sal = 'SAL'
}

export function StatusFromJSON(json: any): Status {
    return StatusFromJSONTyped(json, false);
}

export function StatusFromJSONTyped(json: any, ignoreDiscriminator: boolean): Status {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'contractStatus': json['contractStatus'],
    };
}

export function StatusToJSON(value?: Status | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'contractStatus': value.contractStatus,
    };
}


