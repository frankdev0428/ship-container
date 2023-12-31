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
 * @interface PublicFilter
 */
export interface PublicFilter {
    /**
     * the user
     * @type {string}
     * @memberof PublicFilter
     */
    userId: string;
    /**
     * 
     * @type {boolean}
     * @memberof PublicFilter
     */
    muteAll: boolean;
    /**
     * 
     * @type {string}
     * @memberof PublicFilter
     */
    filterType: PublicFilterFilterTypeEnum;
    /**
     * the criterion
     * @type {string}
     * @memberof PublicFilter
     */
    criterionId?: string;
    /**
     * entity type
     * @type {string}
     * @memberof PublicFilter
     */
    entityType?: string;
    /**
     * the entity
     * @type {string}
     * @memberof PublicFilter
     */
    entityId?: string;
    /**
     * 
     * @type {string}
     * @memberof PublicFilter
     */
    subCase?: string;
    /**
     * 
     * @type {string}
     * @memberof PublicFilter
     */
    delivery?: PublicFilterDeliveryEnum;
}

/**
* @export
* @enum {string}
*/
export enum PublicFilterFilterTypeEnum {
    Cri = 'CRI',
    Ent = 'ENT',
    Crient = 'CRIENT'
}/**
* @export
* @enum {string}
*/
export enum PublicFilterDeliveryEnum {
    Platform = 'platform',
    Email = 'email'
}

export function PublicFilterFromJSON(json: any): PublicFilter {
    return PublicFilterFromJSONTyped(json, false);
}

export function PublicFilterFromJSONTyped(json: any, ignoreDiscriminator: boolean): PublicFilter {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'userId': json['userId'],
        'muteAll': json['muteAll'],
        'filterType': json['filterType'],
        'criterionId': !exists(json, 'criterionId') ? undefined : json['criterionId'],
        'entityType': !exists(json, 'entityType') ? undefined : json['entityType'],
        'entityId': !exists(json, 'entityId') ? undefined : json['entityId'],
        'subCase': !exists(json, 'subCase') ? undefined : json['subCase'],
        'delivery': !exists(json, 'delivery') ? undefined : json['delivery'],
    };
}

export function PublicFilterToJSON(value?: PublicFilter | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'userId': value.userId,
        'muteAll': value.muteAll,
        'filterType': value.filterType,
        'criterionId': value.criterionId,
        'entityType': value.entityType,
        'entityId': value.entityId,
        'subCase': value.subCase,
        'delivery': value.delivery,
    };
}


