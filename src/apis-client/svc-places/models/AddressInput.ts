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
    AddressInputOptional,
    AddressInputOptionalFromJSON,
    AddressInputOptionalFromJSONTyped,
    AddressInputOptionalToJSON,
} from './';

/**
 * 
 * @export
 * @interface AddressInput
 */
export interface AddressInput {
    /**
     * City Id
     * @type {string}
     * @memberof AddressInput
     */
    cityId: string;
    /**
     * Country Id
     * @type {string}
     * @memberof AddressInput
     */
    countryId: string;
    /**
     * all possible region names
     * @type {string}
     * @memberof AddressInput
     */
    region: AddressInputRegionEnum;
    /**
     * 
     * @type {AddressInputOptional}
     * @memberof AddressInput
     */
    optional?: AddressInputOptional;
}

/**
* @export
* @enum {string}
*/
export enum AddressInputRegionEnum {
    Europe = 'Europe',
    Asia = 'Asia',
    SouthAmerica = 'South America',
    NorthAmerica = 'North America',
    Australasia = 'Australasia',
    Antarctica = 'Antarctica'
}

export function AddressInputFromJSON(json: any): AddressInput {
    return AddressInputFromJSONTyped(json, false);
}

export function AddressInputFromJSONTyped(json: any, ignoreDiscriminator: boolean): AddressInput {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'cityId': json['cityId'],
        'countryId': json['countryId'],
        'region': json['region'],
        'optional': !exists(json, 'optional') ? undefined : AddressInputOptionalFromJSON(json['optional']),
    };
}

export function AddressInputToJSON(value?: AddressInput | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'cityId': value.cityId,
        'countryId': value.countryId,
        'region': value.region,
        'optional': AddressInputOptionalToJSON(value.optional),
    };
}


