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
 * @interface PublicUser
 */
export interface PublicUser {
    /**
     * 
     * @type {string}
     * @memberof PublicUser
     */
    username: string;
    /**
     * 
     * @type {string}
     * @memberof PublicUser
     */
    userId: string;
    /**
     * 
     * @type {boolean}
     * @memberof PublicUser
     */
    isArchived: boolean;
    /**
     * 
     * @type {Array<string>}
     * @memberof PublicUser
     */
    roles: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof PublicUser
     */
    groups: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof PublicUser
     */
    createdBy?: string;
}

export function PublicUserFromJSON(json: any): PublicUser {
    return PublicUserFromJSONTyped(json, false);
}

export function PublicUserFromJSONTyped(json: any, ignoreDiscriminator: boolean): PublicUser {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'username': json['username'],
        'userId': json['userId'],
        'isArchived': json['isArchived'],
        'roles': json['roles'],
        'groups': json['groups'],
        'createdBy': !exists(json, 'createdBy') ? undefined : json['createdBy'],
    };
}

export function PublicUserToJSON(value?: PublicUser | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'username': value.username,
        'userId': value.userId,
        'isArchived': value.isArchived,
        'roles': value.roles,
        'groups': value.groups,
        'createdBy': value.createdBy,
    };
}


