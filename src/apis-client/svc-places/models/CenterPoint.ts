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
 * center point
 * @export
 * @interface CenterPoint
 */
export interface CenterPoint {
    /**
     * 
     * @type {string}
     * @memberof CenterPoint
     */
    type: CenterPointTypeEnum;
    /**
     * 
     * @type {Array<string>}
     * @memberof CenterPoint
     */
    coordinates?: Array<string>;
}

/**
* @export
* @enum {string}
*/
export enum CenterPointTypeEnum {
    Point = 'Point'
}

export function CenterPointFromJSON(json: any): CenterPoint {
    return CenterPointFromJSONTyped(json, false);
}

export function CenterPointFromJSONTyped(json: any, ignoreDiscriminator: boolean): CenterPoint {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'type': json['type'],
        'coordinates': !exists(json, 'coordinates') ? undefined : json['coordinates'],
    };
}

export function CenterPointToJSON(value?: CenterPoint | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'type': value.type,
        'coordinates': value.coordinates,
    };
}


