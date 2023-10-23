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
 * @interface MostEventUpdatedAt
 */
export interface MostEventUpdatedAt {
    /**
     * 
     * @type {string}
     * @memberof MostEventUpdatedAt
     */
    type: MostEventUpdatedAtTypeEnum;
    /**
     * 
     * @type {number}
     * @memberof MostEventUpdatedAt
     */
    shock?: number;
    /**
     * 
     * @type {number}
     * @memberof MostEventUpdatedAt
     */
    light?: number;
    /**
     * 
     * @type {Date}
     * @memberof MostEventUpdatedAt
     */
    updatedAt: Date;
}

/**
* @export
* @enum {string}
*/
export enum MostEventUpdatedAtTypeEnum {
    Shock = 'shock',
    Light = 'light'
}

export function MostEventUpdatedAtFromJSON(json: any): MostEventUpdatedAt {
    return MostEventUpdatedAtFromJSONTyped(json, false);
}

export function MostEventUpdatedAtFromJSONTyped(json: any, ignoreDiscriminator: boolean): MostEventUpdatedAt {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'type': json['type'],
        'shock': !exists(json, 'shock') ? undefined : json['shock'],
        'light': !exists(json, 'light') ? undefined : json['light'],
        'updatedAt': (new Date(json['updatedAt'])),
    };
}

export function MostEventUpdatedAtToJSON(value?: MostEventUpdatedAt | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'type': value.type,
        'shock': value.shock,
        'light': value.light,
        'updatedAt': (value.updatedAt.toISOString().substr(0,10)),
    };
}

