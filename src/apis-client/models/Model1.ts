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
 * @interface Model1
 */
export interface Model1 {
    /**
     * 
     * @type {string}
     * @memberof Model1
     */
    alertStateId: string;
    /**
     * criterion linked
     * @type {string}
     * @memberof Model1
     */
    criterionId: string;
    /**
     * 
     * @type {Date}
     * @memberof Model1
     */
    createdAt: Date;
    /**
     * 
     * @type {Date}
     * @memberof Model1
     */
    updatedAt: Date;
    /**
     * 
     * @type {Date}
     * @memberof Model1
     */
    resolvedAt?: Date;
    /**
     * 
     * @type {string}
     * @memberof Model1
     */
    entityId?: string;
    /**
     * 
     * @type {string}
     * @memberof Model1
     */
    entityType?: Model1EntityTypeEnum;
    /**
     * 
     * @type {string}
     * @memberof Model1
     */
    message?: string;
}

/**
* @export
* @enum {string}
*/
export enum Model1EntityTypeEnum {
    Order = 'order',
    Allocation = 'allocation',
    Container = 'container',
    Facility = 'facility'
}

export function Model1FromJSON(json: any): Model1 {
    return Model1FromJSONTyped(json, false);
}

export function Model1FromJSONTyped(json: any, ignoreDiscriminator: boolean): Model1 {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'alertStateId': json['alertStateId'],
        'criterionId': json['criterionId'],
        'createdAt': (new Date(json['createdAt'])),
        'updatedAt': (new Date(json['updatedAt'])),
        'resolvedAt': !exists(json, 'resolvedAt') ? undefined : (new Date(json['resolvedAt'])),
        'entityId': !exists(json, 'entityId') ? undefined : json['entityId'],
        'entityType': !exists(json, 'entityType') ? undefined : json['entityType'],
        'message': !exists(json, 'message') ? undefined : json['message'],
    };
}

export function Model1ToJSON(value?: Model1 | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'alertStateId': value.alertStateId,
        'criterionId': value.criterionId,
        'createdAt': (value.createdAt.toISOString()),
        'updatedAt': (value.updatedAt.toISOString()),
        'resolvedAt': value.resolvedAt === undefined ? undefined : (value.resolvedAt.toISOString()),
        'entityId': value.entityId,
        'entityType': value.entityType,
        'message': value.message,
    };
}


