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


import * as runtime from '../runtime';
import {
    Facility,
    FacilityFromJSON,
    FacilityToJSON,
    FacilityInput,
    FacilityInputFromJSON,
    FacilityInputToJSON,
    FacilityWithLoc,
    FacilityWithLocFromJSON,
    FacilityWithLocToJSON,
    Failure,
    FailureFromJSON,
    FailureToJSON,
    Model12,
    Model12FromJSON,
    Model12ToJSON,
    PatchFacilityInput,
    PatchFacilityInputFromJSON,
    PatchFacilityInputToJSON,
} from '../models';

export interface DeleteFacilitiesFacilityidRequest {
    facilityId: string;
}

export interface GetFacilitiesRequest {
    cityId?: string;
    countryId?: string;
    nameStartsWith?: string;
}

export interface GetFacilitiesFacilityidRequest {
    facilityId: string;
}

export interface GetFacilitiesInradiusRequest {
    lat: number;
    lon: number;
    radius: number;
}

export interface PatchFacilitiesFacilityidRequest {
    facilityId: string;
    body?: PatchFacilityInput;
}

export interface PostFacilitiesRequest {
    body?: FacilityInput;
}

/**
 * 
 */
export class FacilitiesApi extends runtime.BaseAPI {

    /**
     * archive facility
     */
    async deleteFacilitiesFacilityidRaw(requestParameters: DeleteFacilitiesFacilityidRequest): Promise<runtime.ApiResponse<Model12>> {
        if (requestParameters.facilityId === null || requestParameters.facilityId === undefined) {
            throw new runtime.RequiredError('facilityId','Required parameter requestParameters.facilityId was null or undefined when calling deleteFacilitiesFacilityid.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = this.configuration.apiKey("Authorization"); // jwt authentication
        }

        const response = await this.request({
            path: `/facilities/{facilityId}`.replace(`{${"facilityId"}}`, encodeURIComponent(String(requestParameters.facilityId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => Model12FromJSON(jsonValue));
    }

    /**
     * archive facility
     */
    async deleteFacilitiesFacilityid(requestParameters: DeleteFacilitiesFacilityidRequest): Promise<Model12> {
        const response = await this.deleteFacilitiesFacilityidRaw(requestParameters);
        return await response.value();
    }

    /**
     * filter Facilitys
     */
    async getFacilitiesRaw(requestParameters: GetFacilitiesRequest): Promise<runtime.ApiResponse<Array<FacilityWithLoc>>> {
        const queryParameters: any = {};

        if (requestParameters.cityId !== undefined) {
            queryParameters['cityId'] = requestParameters.cityId;
        }

        if (requestParameters.countryId !== undefined) {
            queryParameters['countryId'] = requestParameters.countryId;
        }

        if (requestParameters.nameStartsWith !== undefined) {
            queryParameters['nameStartsWith'] = requestParameters.nameStartsWith;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = this.configuration.apiKey("Authorization"); // jwt authentication
        }

        const response = await this.request({
            path: `/facilities`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(FacilityWithLocFromJSON));
    }

    /**
     * filter Facilitys
     */
    async getFacilities(requestParameters: GetFacilitiesRequest): Promise<Array<FacilityWithLoc>> {
        const response = await this.getFacilitiesRaw(requestParameters);
        return await response.value();
    }

    /**
     * filter Facilitys
     */
    async getFacilitiesFacilityidRaw(requestParameters: GetFacilitiesFacilityidRequest): Promise<runtime.ApiResponse<FacilityWithLoc>> {
        if (requestParameters.facilityId === null || requestParameters.facilityId === undefined) {
            throw new runtime.RequiredError('facilityId','Required parameter requestParameters.facilityId was null or undefined when calling getFacilitiesFacilityid.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = this.configuration.apiKey("Authorization"); // jwt authentication
        }

        const response = await this.request({
            path: `/facilities/{facilityId}`.replace(`{${"facilityId"}}`, encodeURIComponent(String(requestParameters.facilityId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => FacilityWithLocFromJSON(jsonValue));
    }

    /**
     * filter Facilitys
     */
    async getFacilitiesFacilityid(requestParameters: GetFacilitiesFacilityidRequest): Promise<FacilityWithLoc> {
        const response = await this.getFacilitiesFacilityidRaw(requestParameters);
        return await response.value();
    }

    /**
     * filter facilities by radius
     */
    async getFacilitiesInradiusRaw(requestParameters: GetFacilitiesInradiusRequest): Promise<runtime.ApiResponse<Array<Facility>>> {
        if (requestParameters.lat === null || requestParameters.lat === undefined) {
            throw new runtime.RequiredError('lat','Required parameter requestParameters.lat was null or undefined when calling getFacilitiesInradius.');
        }

        if (requestParameters.lon === null || requestParameters.lon === undefined) {
            throw new runtime.RequiredError('lon','Required parameter requestParameters.lon was null or undefined when calling getFacilitiesInradius.');
        }

        if (requestParameters.radius === null || requestParameters.radius === undefined) {
            throw new runtime.RequiredError('radius','Required parameter requestParameters.radius was null or undefined when calling getFacilitiesInradius.');
        }

        const queryParameters: any = {};

        if (requestParameters.lat !== undefined) {
            queryParameters['lat'] = requestParameters.lat;
        }

        if (requestParameters.lon !== undefined) {
            queryParameters['lon'] = requestParameters.lon;
        }

        if (requestParameters.radius !== undefined) {
            queryParameters['radius'] = requestParameters.radius;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = this.configuration.apiKey("Authorization"); // jwt authentication
        }

        const response = await this.request({
            path: `/facilities/in-radius`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(FacilityFromJSON));
    }

    /**
     * filter facilities by radius
     */
    async getFacilitiesInradius(requestParameters: GetFacilitiesInradiusRequest): Promise<Array<Facility>> {
        const response = await this.getFacilitiesInradiusRaw(requestParameters);
        return await response.value();
    }

    /**
     * patch facility
     */
    async patchFacilitiesFacilityidRaw(requestParameters: PatchFacilitiesFacilityidRequest): Promise<runtime.ApiResponse<FacilityWithLoc>> {
        if (requestParameters.facilityId === null || requestParameters.facilityId === undefined) {
            throw new runtime.RequiredError('facilityId','Required parameter requestParameters.facilityId was null or undefined when calling patchFacilitiesFacilityid.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = this.configuration.apiKey("Authorization"); // jwt authentication
        }

        const response = await this.request({
            path: `/facilities/{facilityId}`.replace(`{${"facilityId"}}`, encodeURIComponent(String(requestParameters.facilityId))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: PatchFacilityInputToJSON(requestParameters.body),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => FacilityWithLocFromJSON(jsonValue));
    }

    /**
     * patch facility
     */
    async patchFacilitiesFacilityid(requestParameters: PatchFacilitiesFacilityidRequest): Promise<FacilityWithLoc> {
        const response = await this.patchFacilitiesFacilityidRaw(requestParameters);
        return await response.value();
    }

    /**
     * create a facility
     */
    async postFacilitiesRaw(requestParameters: PostFacilitiesRequest): Promise<runtime.ApiResponse<FacilityWithLoc>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = this.configuration.apiKey("Authorization"); // jwt authentication
        }

        const response = await this.request({
            path: `/facilities`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: FacilityInputToJSON(requestParameters.body),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => FacilityWithLocFromJSON(jsonValue));
    }

    /**
     * create a facility
     */
    async postFacilities(requestParameters: PostFacilitiesRequest): Promise<FacilityWithLoc> {
        const response = await this.postFacilitiesRaw(requestParameters);
        return await response.value();
    }

}
