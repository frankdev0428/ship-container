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
 * CountryInputOptional
 * @export
 * @interface CountryInputOptional
 */
export interface CountryInputOptional {
    /**
     * boundaries_north
     * @type {number}
     * @memberof CountryInputOptional
     */
    boundaries_north?: number;
    /**
     * boundaries_east
     * @type {number}
     * @memberof CountryInputOptional
     */
    boundaries_east?: number;
    /**
     * boundaries_south
     * @type {number}
     * @memberof CountryInputOptional
     */
    boundaries_south?: number;
    /**
     * boundaries_west
     * @type {number}
     * @memberof CountryInputOptional
     */
    boundaries_west?: number;
    /**
     * identifiers_iso_alpha2
     * @type {string}
     * @memberof CountryInputOptional
     */
    identifiers_iso_alpha2?: string;
    /**
     * identifiers_iso_alpha3
     * @type {string}
     * @memberof CountryInputOptional
     */
    identifiers_iso_alpha3?: string;
    /**
     * identifiers_iso_numeric
     * @type {number}
     * @memberof CountryInputOptional
     */
    identifiers_iso_numeric?: number;
    /**
     * identifiers_fips_alpha
     * @type {string}
     * @memberof CountryInputOptional
     */
    identifiers_fips_alpha?: string;
    /**
     * identifiers_geonames_id
     * @type {number}
     * @memberof CountryInputOptional
     */
    identifiers_geonames_id?: number;
    /**
     * economy_capital
     * @type {string}
     * @memberof CountryInputOptional
     */
    economy_capital?: string;
    /**
     * economy_languages
     * @type {string}
     * @memberof CountryInputOptional
     */
    economy_languages?: string;
    /**
     * economy_population
     * @type {number}
     * @memberof CountryInputOptional
     */
    economy_population?: number;
    /**
     * economy_area
     * @type {number}
     * @memberof CountryInputOptional
     */
    economy_area?: number;
    /**
     * economy_currencyCode
     * @type {string}
     * @memberof CountryInputOptional
     */
    economy_currencycode?: string;
    /**
     * location_continent_name
     * @type {string}
     * @memberof CountryInputOptional
     */
    location_continent_name?: string;
    /**
     * location_continent_code
     * @type {string}
     * @memberof CountryInputOptional
     */
    location_continent_code?: string;
}

export function CountryInputOptionalFromJSON(json: any): CountryInputOptional {
    return CountryInputOptionalFromJSONTyped(json, false);
}

export function CountryInputOptionalFromJSONTyped(json: any, ignoreDiscriminator: boolean): CountryInputOptional {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'boundaries_north': !exists(json, 'boundaries_north') ? undefined : json['boundaries_north'],
        'boundaries_east': !exists(json, 'boundaries_east') ? undefined : json['boundaries_east'],
        'boundaries_south': !exists(json, 'boundaries_south') ? undefined : json['boundaries_south'],
        'boundaries_west': !exists(json, 'boundaries_west') ? undefined : json['boundaries_west'],
        'identifiers_iso_alpha2': !exists(json, 'identifiers_iso_alpha2') ? undefined : json['identifiers_iso_alpha2'],
        'identifiers_iso_alpha3': !exists(json, 'identifiers_iso_alpha3') ? undefined : json['identifiers_iso_alpha3'],
        'identifiers_iso_numeric': !exists(json, 'identifiers_iso_numeric') ? undefined : json['identifiers_iso_numeric'],
        'identifiers_fips_alpha': !exists(json, 'identifiers_fips_alpha') ? undefined : json['identifiers_fips_alpha'],
        'identifiers_geonames_id': !exists(json, 'identifiers_geonames_id') ? undefined : json['identifiers_geonames_id'],
        'economy_capital': !exists(json, 'economy_capital') ? undefined : json['economy_capital'],
        'economy_languages': !exists(json, 'economy_languages') ? undefined : json['economy_languages'],
        'economy_population': !exists(json, 'economy_population') ? undefined : json['economy_population'],
        'economy_area': !exists(json, 'economy_area') ? undefined : json['economy_area'],
        'economy_currencycode': !exists(json, 'economy_currencycode') ? undefined : json['economy_currencycode'],
        'location_continent_name': !exists(json, 'location_continent_name') ? undefined : json['location_continent_name'],
        'location_continent_code': !exists(json, 'location_continent_code') ? undefined : json['location_continent_code'],
    };
}

export function CountryInputOptionalToJSON(value?: CountryInputOptional | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'boundaries_north': value.boundaries_north,
        'boundaries_east': value.boundaries_east,
        'boundaries_south': value.boundaries_south,
        'boundaries_west': value.boundaries_west,
        'identifiers_iso_alpha2': value.identifiers_iso_alpha2,
        'identifiers_iso_alpha3': value.identifiers_iso_alpha3,
        'identifiers_iso_numeric': value.identifiers_iso_numeric,
        'identifiers_fips_alpha': value.identifiers_fips_alpha,
        'identifiers_geonames_id': value.identifiers_geonames_id,
        'economy_capital': value.economy_capital,
        'economy_languages': value.economy_languages,
        'economy_population': value.economy_population,
        'economy_area': value.economy_area,
        'economy_currencycode': value.economy_currencycode,
        'location_continent_name': value.location_continent_name,
        'location_continent_code': value.location_continent_code,
    };
}


