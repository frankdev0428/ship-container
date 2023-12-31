/* tslint:disable */
/* eslint-disable */
/**
 * Nexxiot Boards
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
 * An error due to a wrong request or an internal error when processing the request
 * @export
 * @interface Failure
 */
export interface Failure {
    /**
     * Error messages
     * @type {Array<string>}
     * @memberof Failure
     */
    errors: Array<string>;
}

export function FailureFromJSON(json: any): Failure {
    return FailureFromJSONTyped(json, false);
}

export function FailureFromJSONTyped(json: any, ignoreDiscriminator: boolean): Failure {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'errors': json['errors'],
    };
}

export function FailureToJSON(value?: Failure | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'errors': value.errors,
    };
}


