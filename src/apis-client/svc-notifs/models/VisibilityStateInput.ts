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
 * @interface VisibilityStateInput
 */
export interface VisibilityStateInput {
    /**
     * the alert
     * @type {string}
     * @memberof VisibilityStateInput
     */
    alertStateId: string;
    /**
     * 
     * @type {Date}
     * @memberof VisibilityStateInput
     */
    readAt?: Date | null;
    /**
     * is it snoozed
     * @type {boolean}
     * @memberof VisibilityStateInput
     */
    isSnoozed?: boolean;
    /**
     * 
     * @type {Date}
     * @memberof VisibilityStateInput
     */
    snoozeUntil?: Date;
}

export function VisibilityStateInputFromJSON(json: any): VisibilityStateInput {
    return VisibilityStateInputFromJSONTyped(json, false);
}

export function VisibilityStateInputFromJSONTyped(json: any, ignoreDiscriminator: boolean): VisibilityStateInput {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'alertStateId': json['alertStateId'],
        'readAt': !exists(json, 'readAt') ? undefined : (json['readAt'] === null ? null : new Date(json['readAt'])),
        'isSnoozed': !exists(json, 'isSnoozed') ? undefined : json['isSnoozed'],
        'snoozeUntil': !exists(json, 'snoozeUntil') ? undefined : (new Date(json['snoozeUntil'])),
    };
}

export function VisibilityStateInputToJSON(value?: VisibilityStateInput | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'alertStateId': value.alertStateId,
        'readAt': value.readAt === undefined ? undefined : (value.readAt === null ? null : value.readAt.toISOString()),
        'isSnoozed': value.isSnoozed,
        'snoozeUntil': value.snoozeUntil === undefined ? undefined : (value.snoozeUntil.toISOString()),
    };
}


