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
import {
    PublicTimeseries,
    PublicTimeseriesFromJSON,
    PublicTimeseriesFromJSONTyped,
    PublicTimeseriesToJSON,
} from './';

/**
 * 
 * @export
 * @interface Model40
 */
export interface Model40 {
    /**
     * 
     * @type {string}
     * @memberof Model40
     */
    containerId: string;
    /**
     * 
     * @type {string}
     * @memberof Model40
     */
    equipmentLeaseContractId: string;
    /**
     * 
     * @type {Date}
     * @memberof Model40
     */
    startDate: Date;
    /**
     * 
     * @type {Date}
     * @memberof Model40
     */
    stopDate: Date;
    /**
     * 
     * @type {Array<PublicTimeseries>}
     * @memberof Model40
     */
    timeseries: Array<PublicTimeseries>;
}

export function Model40FromJSON(json: any): Model40 {
    return Model40FromJSONTyped(json, false);
}

export function Model40FromJSONTyped(json: any, ignoreDiscriminator: boolean): Model40 {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'containerId': json['containerId'],
        'equipmentLeaseContractId': json['equipmentLeaseContractId'],
        'startDate': (new Date(json['startDate'])),
        'stopDate': (new Date(json['stopDate'])),
        'timeseries': ((json['timeseries'] as Array<any>).map(PublicTimeseriesFromJSON)),
    };
}

export function Model40ToJSON(value?: Model40 | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'containerId': value.containerId,
        'equipmentLeaseContractId': value.equipmentLeaseContractId,
        'startDate': (value.startDate.toISOString()),
        'stopDate': (value.stopDate.toISOString()),
        'timeseries': ((value.timeseries as Array<any>).map(PublicTimeseriesToJSON)),
    };
}


