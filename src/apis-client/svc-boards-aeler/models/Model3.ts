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
    TimedSample,
    TimedSampleFromJSON,
    TimedSampleFromJSONTyped,
    TimedSampleToJSON,
} from './';

/**
 * 
 * @export
 * @interface Model3
 */
export interface Model3 {
    /**
     * 
     * @type {string}
     * @memberof Model3
     */
    type: string;
    /**
     * 
     * @type {Array<TimedSample>}
     * @memberof Model3
     */
    samples: Array<TimedSample>;
}

export function Model3FromJSON(json: any): Model3 {
    return Model3FromJSONTyped(json, false);
}

export function Model3FromJSONTyped(json: any, ignoreDiscriminator: boolean): Model3 {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'type': json['type'],
        'samples': ((json['samples'] as Array<any>).map(TimedSampleFromJSON)),
    };
}

export function Model3ToJSON(value?: Model3 | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'type': value.type,
        'samples': ((value.samples as Array<any>).map(TimedSampleToJSON)),
    };
}

