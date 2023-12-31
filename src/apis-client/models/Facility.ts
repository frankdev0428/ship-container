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
 * Facility
 * @export
 * @interface Facility
 */
export interface Facility {
    /**
     * CC-CCC-DDDD-NNN
     * @type {string}
     * @memberof Facility
     */
    facilityId: string;
    /**
     * Facility name
     * @type {string}
     * @memberof Facility
     */
    name: string;
    /**
     * Facility code
     * @type {string}
     * @memberof Facility
     */
    code: string;
    /**
     * types of facilities
     * @type {string}
     * @memberof Facility
     */
    type: FacilityTypeEnum;
    /**
     * address Id
     * @type {string}
     * @memberof Facility
     */
    addressId: string;
    /**
     * latest status
     * @type {string}
     * @memberof Facility
     */
    latestStatusId?: string;
    /**
     * identifiers_bicId
     * @type {string}
     * @memberof Facility
     */
    identifiers_bicId?: string;
    /**
     * identifiers_smdgId
     * @type {string}
     * @memberof Facility
     */
    identifiers_smdgId?: string;
    /**
     * identifiers_imoId
     * @type {string}
     * @memberof Facility
     */
    identifiers_imoId?: string;
    /**
     * Operator Name
     * @type {string}
     * @memberof Facility
     */
    operatorName?: string;
    /**
     * Operator ID
     * @type {string}
     * @memberof Facility
     */
    operatorID?: string;
    /**
     * area in squared meters
     * @type {number}
     * @memberof Facility
     */
    charateristics_area?: number;
    /**
     * location Id
     * @type {string}
     * @memberof Facility
     */
    locationId?: string;
    /**
     * partnership types
     * @type {Array<string>}
     * @memberof Facility
     */
    partnershipTypes?: Array<FacilityPartnershipTypesEnum>;
}

/**
* @export
* @enum {string}
*/
export enum FacilityTypeEnum {
    Bocr = 'BOCR',
    Culo = 'CULO',
    Cofs = 'COFS',
    Coya = 'COYA',
    Depo = 'DEPO',
    Inte = 'INTE',
    Pote = 'POTE',
    Pbst = 'PBST'
}/**
* @export
* @enum {string}
*/
export enum FacilityPartnershipTypesEnum {
    Storage = 'Storage',
    MnR = 'MnR',
    Haulage = 'Haulage'
}

export function FacilityFromJSON(json: any): Facility {
    return FacilityFromJSONTyped(json, false);
}

export function FacilityFromJSONTyped(json: any, ignoreDiscriminator: boolean): Facility {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'facilityId': json['facilityId'],
        'name': json['name'],
        'code': json['code'],
        'type': json['type'],
        'addressId': json['addressId'],
        'latestStatusId': !exists(json, 'latestStatusId') ? undefined : json['latestStatusId'],
        'identifiers_bicId': !exists(json, 'identifiers_bicId') ? undefined : json['identifiers_bicId'],
        'identifiers_smdgId': !exists(json, 'identifiers_smdgId') ? undefined : json['identifiers_smdgId'],
        'identifiers_imoId': !exists(json, 'identifiers_imoId') ? undefined : json['identifiers_imoId'],
        'operatorName': !exists(json, 'operatorName') ? undefined : json['operatorName'],
        'operatorID': !exists(json, 'operatorID') ? undefined : json['operatorID'],
        'charateristics_area': !exists(json, 'charateristics_area') ? undefined : json['charateristics_area'],
        'locationId': !exists(json, 'locationId') ? undefined : json['locationId'],
        'partnershipTypes': !exists(json, 'partnershipTypes') ? undefined : json['partnershipTypes'],
    };
}

export function FacilityToJSON(value?: Facility | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'facilityId': value.facilityId,
        'name': value.name,
        'code': value.code,
        'type': value.type,
        'addressId': value.addressId,
        'latestStatusId': value.latestStatusId,
        'identifiers_bicId': value.identifiers_bicId,
        'identifiers_smdgId': value.identifiers_smdgId,
        'identifiers_imoId': value.identifiers_imoId,
        'operatorName': value.operatorName,
        'operatorID': value.operatorID,
        'charateristics_area': value.charateristics_area,
        'locationId': value.locationId,
        'partnershipTypes': value.partnershipTypes,
    };
}


