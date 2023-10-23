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
 * @interface GpsMeasurementUpdatedAt
 */
export interface GpsMeasurementUpdatedAt {
    /**
     * A tuple containing the longitude and the latitude
     * @type {Array<number>}
     * @memberof GpsMeasurementUpdatedAt
     */
    geometry: Array<number>;
    /**
     * accuracy of position
     * @type {number}
     * @memberof GpsMeasurementUpdatedAt
     */
    radius?: number;
    /**
     * 
     * @type {Date}
     * @memberof GpsMeasurementUpdatedAt
     */
    updatedAt: Date;
}

export function GpsMeasurementUpdatedAtFromJSON(json: any): GpsMeasurementUpdatedAt {
    return GpsMeasurementUpdatedAtFromJSONTyped(json, false);
}

export function GpsMeasurementUpdatedAtFromJSONTyped(json: any, ignoreDiscriminator: boolean): GpsMeasurementUpdatedAt {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'geometry': json['geometry'],
        'radius': !exists(json, 'radius') ? undefined : json['radius'],
        'updatedAt': (new Date(json['updatedAt'])),
    };
}

export function GpsMeasurementUpdatedAtToJSON(value?: GpsMeasurementUpdatedAt | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'geometry': value.geometry,
        'radius': value.radius,
        'updatedAt': (value.updatedAt.toISOString().substr(0,10)),
    };
}


