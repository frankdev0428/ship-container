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
    DepotContactInput,
    DepotContactInputFromJSON,
    DepotContactInputToJSON,
    DepotContainer,
    DepotContainerFromJSON,
    DepotContainerToJSON,
    DepotStats,
    DepotStatsFromJSON,
    DepotStatsToJSON,
    Failure,
    FailureFromJSON,
    FailureToJSON,
    Model47,
    Model47FromJSON,
    Model47ToJSON,
    PatchDepotContactInput,
    PatchDepotContactInputFromJSON,
    PatchDepotContactInputToJSON,
    PublicDepotContact,
    PublicDepotContactFromJSON,
    PublicDepotContactToJSON,
} from '../models';

export interface DeleteDepotsDepotidContactsContactidRequest {
    depotId: string;
    contactId: string;
}

export interface GetDepotsRequest {
    startswith: string;
}

export interface GetDepotsContactsRequest {
    depotId?: string;
}

export interface GetDepotsInventoryRequest {
    depotId: string;
}

export interface GetDepotsStatsRequest {
    depotId: string;
}

export interface PatchDepotsDepotidContactsContactidRequest {
    depotId: string;
    contactId: string;
    body?: PatchDepotContactInput;
}

export interface PostDepotsContactsRequest {
    body?: DepotContactInput;
}

/**
 * 
 */
export class DepotsApi extends runtime.BaseAPI {

    /**
     * Remove depot contact
     */
    async deleteDepotsDepotidContactsContactidRaw(requestParameters: DeleteDepotsDepotidContactsContactidRequest): Promise<runtime.ApiResponse<Model47>> {
        if (requestParameters.depotId === null || requestParameters.depotId === undefined) {
            throw new runtime.RequiredError('depotId','Required parameter requestParameters.depotId was null or undefined when calling deleteDepotsDepotidContactsContactid.');
        }

        if (requestParameters.contactId === null || requestParameters.contactId === undefined) {
            throw new runtime.RequiredError('contactId','Required parameter requestParameters.contactId was null or undefined when calling deleteDepotsDepotidContactsContactid.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = this.configuration.apiKey("Authorization"); // jwt authentication
        }

        const response = await this.request({
            path: `/depots/{depotId}/contacts/{contactId}`.replace(`{${"depotId"}}`, encodeURIComponent(String(requestParameters.depotId))).replace(`{${"contactId"}}`, encodeURIComponent(String(requestParameters.contactId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => Model47FromJSON(jsonValue));
    }

    /**
     * Remove depot contact
     */
    async deleteDepotsDepotidContactsContactid(requestParameters: DeleteDepotsDepotidContactsContactidRequest): Promise<Model47> {
        const response = await this.deleteDepotsDepotidContactsContactidRaw(requestParameters);
        return await response.value();
    }

    /**
     * Autocomplete depots codes
     */
    async getDepotsRaw(requestParameters: GetDepotsRequest): Promise<runtime.ApiResponse<Array<string>>> {
        if (requestParameters.startswith === null || requestParameters.startswith === undefined) {
            throw new runtime.RequiredError('startswith','Required parameter requestParameters.startswith was null or undefined when calling getDepots.');
        }

        const queryParameters: any = {};

        if (requestParameters.startswith !== undefined) {
            queryParameters['startswith'] = requestParameters.startswith;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = this.configuration.apiKey("Authorization"); // jwt authentication
        }

        const response = await this.request({
            path: `/depots`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse<any>(response);
    }

    /**
     * Autocomplete depots codes
     */
    async getDepots(requestParameters: GetDepotsRequest): Promise<Array<string>> {
        const response = await this.getDepotsRaw(requestParameters);
        return await response.value();
    }

    /**
     * Get depot contacts
     */
    async getDepotsContactsRaw(requestParameters: GetDepotsContactsRequest): Promise<runtime.ApiResponse<Array<PublicDepotContact>>> {
        const queryParameters: any = {};

        if (requestParameters.depotId !== undefined) {
            queryParameters['depotId'] = requestParameters.depotId;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = this.configuration.apiKey("Authorization"); // jwt authentication
        }

        const response = await this.request({
            path: `/depots/contacts`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(PublicDepotContactFromJSON));
    }

    /**
     * Get depot contacts
     */
    async getDepotsContacts(requestParameters: GetDepotsContactsRequest): Promise<Array<PublicDepotContact>> {
        const response = await this.getDepotsContactsRaw(requestParameters);
        return await response.value();
    }

    /**
     * get containers in a depot
     */
    async getDepotsInventoryRaw(requestParameters: GetDepotsInventoryRequest): Promise<runtime.ApiResponse<Array<DepotContainer>>> {
        if (requestParameters.depotId === null || requestParameters.depotId === undefined) {
            throw new runtime.RequiredError('depotId','Required parameter requestParameters.depotId was null or undefined when calling getDepotsInventory.');
        }

        const queryParameters: any = {};

        if (requestParameters.depotId !== undefined) {
            queryParameters['depotId'] = requestParameters.depotId;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = this.configuration.apiKey("Authorization"); // jwt authentication
        }

        const response = await this.request({
            path: `/depots/inventory`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(DepotContainerFromJSON));
    }

    /**
     * get containers in a depot
     */
    async getDepotsInventory(requestParameters: GetDepotsInventoryRequest): Promise<Array<DepotContainer>> {
        const response = await this.getDepotsInventoryRaw(requestParameters);
        return await response.value();
    }

    /**
     * Autocomplete depots codes
     */
    async getDepotsStatsRaw(requestParameters: GetDepotsStatsRequest): Promise<runtime.ApiResponse<Array<DepotStats>>> {
        if (requestParameters.depotId === null || requestParameters.depotId === undefined) {
            throw new runtime.RequiredError('depotId','Required parameter requestParameters.depotId was null or undefined when calling getDepotsStats.');
        }

        const queryParameters: any = {};

        if (requestParameters.depotId !== undefined) {
            queryParameters['depotId'] = requestParameters.depotId;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = this.configuration.apiKey("Authorization"); // jwt authentication
        }

        const response = await this.request({
            path: `/depots/stats`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(DepotStatsFromJSON));
    }

    /**
     * Autocomplete depots codes
     */
    async getDepotsStats(requestParameters: GetDepotsStatsRequest): Promise<Array<DepotStats>> {
        const response = await this.getDepotsStatsRaw(requestParameters);
        return await response.value();
    }

    /**
     * Update depot contact
     */
    async patchDepotsDepotidContactsContactidRaw(requestParameters: PatchDepotsDepotidContactsContactidRequest): Promise<runtime.ApiResponse<PublicDepotContact>> {
        if (requestParameters.depotId === null || requestParameters.depotId === undefined) {
            throw new runtime.RequiredError('depotId','Required parameter requestParameters.depotId was null or undefined when calling patchDepotsDepotidContactsContactid.');
        }

        if (requestParameters.contactId === null || requestParameters.contactId === undefined) {
            throw new runtime.RequiredError('contactId','Required parameter requestParameters.contactId was null or undefined when calling patchDepotsDepotidContactsContactid.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = this.configuration.apiKey("Authorization"); // jwt authentication
        }

        const response = await this.request({
            path: `/depots/{depotId}/contacts/{contactId}`.replace(`{${"depotId"}}`, encodeURIComponent(String(requestParameters.depotId))).replace(`{${"contactId"}}`, encodeURIComponent(String(requestParameters.contactId))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: PatchDepotContactInputToJSON(requestParameters.body),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => PublicDepotContactFromJSON(jsonValue));
    }

    /**
     * Update depot contact
     */
    async patchDepotsDepotidContactsContactid(requestParameters: PatchDepotsDepotidContactsContactidRequest): Promise<PublicDepotContact> {
        const response = await this.patchDepotsDepotidContactsContactidRaw(requestParameters);
        return await response.value();
    }

    /**
     * Add depot contact
     */
    async postDepotsContactsRaw(requestParameters: PostDepotsContactsRequest): Promise<runtime.ApiResponse<PublicDepotContact>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = this.configuration.apiKey("Authorization"); // jwt authentication
        }

        const response = await this.request({
            path: `/depots/contacts`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: DepotContactInputToJSON(requestParameters.body),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => PublicDepotContactFromJSON(jsonValue));
    }

    /**
     * Add depot contact
     */
    async postDepotsContacts(requestParameters: PostDepotsContactsRequest): Promise<PublicDepotContact> {
        const response = await this.postDepotsContactsRaw(requestParameters);
        return await response.value();
    }

}
