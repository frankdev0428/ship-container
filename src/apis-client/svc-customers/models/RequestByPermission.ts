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
 * @interface RequestByPermission
 */
export interface RequestByPermission {
    /**
     * 
     * @type {string}
     * @memberof RequestByPermission
     */
    permissionId: string;
}

export function RequestByPermissionFromJSON(json: any): RequestByPermission {
    return RequestByPermissionFromJSONTyped(json, false);
}

export function RequestByPermissionFromJSONTyped(json: any, ignoreDiscriminator: boolean): RequestByPermission {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'permissionId': json['permissionId'],
    };
}

export function RequestByPermissionToJSON(value?: RequestByPermission | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'permissionId': value.permissionId,
    };
}


