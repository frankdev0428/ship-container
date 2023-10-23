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
 * @interface NotificationConfiguration
 */
export interface NotificationConfiguration {
    /**
     * 
     * @type {string}
     * @memberof NotificationConfiguration
     */
    userId?: string;
    /**
     * 
     * @type {boolean}
     * @memberof NotificationConfiguration
     */
    muteAll?: boolean;
}

export function NotificationConfigurationFromJSON(json: any): NotificationConfiguration {
    return NotificationConfigurationFromJSONTyped(json, false);
}

export function NotificationConfigurationFromJSONTyped(json: any, ignoreDiscriminator: boolean): NotificationConfiguration {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'userId': !exists(json, 'userId') ? undefined : json['userId'],
        'muteAll': !exists(json, 'muteAll') ? undefined : json['muteAll'],
    };
}

export function NotificationConfigurationToJSON(value?: NotificationConfiguration | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'userId': value.userId,
        'muteAll': value.muteAll,
    };
}


