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
import {
    Shock,
    ShockFromJSON,
    ShockFromJSONTyped,
    ShockToJSON,
} from './';

/**
 * 
 * @export
 * @interface NexxiotAlertMeasurementUpdatedAt
 */
export interface NexxiotAlertMeasurementUpdatedAt {
    /**
     * 
     * @type {string}
     * @memberof NexxiotAlertMeasurementUpdatedAt
     */
    alertType?: string;
    /**
     * 
     * @type {string}
     * @memberof NexxiotAlertMeasurementUpdatedAt
     */
    alertLevel?: string;
    /**
     * 
     * @type {string}
     * @memberof NexxiotAlertMeasurementUpdatedAt
     */
    alertMsg?: string;
    /**
     * 
     * @type {Shock}
     * @memberof NexxiotAlertMeasurementUpdatedAt
     */
    shock?: Shock;
    /**
     * 
     * @type {Date}
     * @memberof NexxiotAlertMeasurementUpdatedAt
     */
    updatedAt: Date;
}

export function NexxiotAlertMeasurementUpdatedAtFromJSON(json: any): NexxiotAlertMeasurementUpdatedAt {
    return NexxiotAlertMeasurementUpdatedAtFromJSONTyped(json, false);
}

export function NexxiotAlertMeasurementUpdatedAtFromJSONTyped(json: any, ignoreDiscriminator: boolean): NexxiotAlertMeasurementUpdatedAt {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'alertType': !exists(json, 'alertType') ? undefined : json['alertType'],
        'alertLevel': !exists(json, 'alertLevel') ? undefined : json['alertLevel'],
        'alertMsg': !exists(json, 'alertMsg') ? undefined : json['alertMsg'],
        'shock': !exists(json, 'shock') ? undefined : ShockFromJSON(json['shock']),
        'updatedAt': (new Date(json['updatedAt'])),
    };
}

export function NexxiotAlertMeasurementUpdatedAtToJSON(value?: NexxiotAlertMeasurementUpdatedAt | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'alertType': value.alertType,
        'alertLevel': value.alertLevel,
        'alertMsg': value.alertMsg,
        'shock': ShockToJSON(value.shock),
        'updatedAt': (value.updatedAt.toISOString().substr(0,10)),
    };
}


