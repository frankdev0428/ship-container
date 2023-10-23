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
    CompanyInput,
    CompanyInputFromJSON,
    CompanyInputToJSON,
    Failure,
    FailureFromJSON,
    FailureToJSON,
    Model4,
    Model4FromJSON,
    Model4ToJSON,
    PublicCompany,
    PublicCompanyFromJSON,
    PublicCompanyToJSON,
} from '../models';

export interface DeleteCompaniesCompanyidRequest {
    companyId: string;
}

export interface GetCompaniesRequest {
    name?: string;
}

export interface GetCompaniesCompanyidRequest {
    companyId: string;
}

export interface PostCompaniesRequest {
    body?: CompanyInput;
}

export interface PostCompaniesCompanyidGroupRequest {
    companyId: string;
    body?: CompanyInput;
}

/**
 * 
 */
export class CompaniesApi extends runtime.BaseAPI {

    /**
     * FIXME
     */
    async deleteCompaniesCompanyidRaw(requestParameters: DeleteCompaniesCompanyidRequest): Promise<runtime.ApiResponse<Model4>> {
        if (requestParameters.companyId === null || requestParameters.companyId === undefined) {
            throw new runtime.RequiredError('companyId','Required parameter requestParameters.companyId was null or undefined when calling deleteCompaniesCompanyid.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = this.configuration.apiKey("Authorization"); // jwt authentication
        }

        const response = await this.request({
            path: `/companies/{companyId}`.replace(`{${"companyId"}}`, encodeURIComponent(String(requestParameters.companyId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => Model4FromJSON(jsonValue));
    }

    /**
     * FIXME
     */
    async deleteCompaniesCompanyid(requestParameters: DeleteCompaniesCompanyidRequest): Promise<Model4> {
        const response = await this.deleteCompaniesCompanyidRaw(requestParameters);
        return await response.value();
    }

    /**
     * FIXME
     */
    async getCompaniesRaw(requestParameters: GetCompaniesRequest): Promise<runtime.ApiResponse<Array<PublicCompany>>> {
        const queryParameters: any = {};

        if (requestParameters.name !== undefined) {
            queryParameters['name'] = requestParameters.name;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = this.configuration.apiKey("Authorization"); // jwt authentication
        }

        const response = await this.request({
            path: `/companies`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(PublicCompanyFromJSON));
    }

    /**
     * FIXME
     */
    async getCompanies(requestParameters: GetCompaniesRequest): Promise<Array<PublicCompany>> {
        const response = await this.getCompaniesRaw(requestParameters);
        return await response.value();
    }

    /**
     * filter companies
     */
    async getCompaniesCompanyidRaw(requestParameters: GetCompaniesCompanyidRequest): Promise<runtime.ApiResponse<PublicCompany>> {
        if (requestParameters.companyId === null || requestParameters.companyId === undefined) {
            throw new runtime.RequiredError('companyId','Required parameter requestParameters.companyId was null or undefined when calling getCompaniesCompanyid.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = this.configuration.apiKey("Authorization"); // jwt authentication
        }

        const response = await this.request({
            path: `/companies/{companyId}`.replace(`{${"companyId"}}`, encodeURIComponent(String(requestParameters.companyId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => PublicCompanyFromJSON(jsonValue));
    }

    /**
     * filter companies
     */
    async getCompaniesCompanyid(requestParameters: GetCompaniesCompanyidRequest): Promise<PublicCompany> {
        const response = await this.getCompaniesCompanyidRaw(requestParameters);
        return await response.value();
    }

    /**
     * FIXME
     */
    async postCompaniesRaw(requestParameters: PostCompaniesRequest): Promise<runtime.ApiResponse<PublicCompany>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = this.configuration.apiKey("Authorization"); // jwt authentication
        }

        const response = await this.request({
            path: `/companies`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CompanyInputToJSON(requestParameters.body),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => PublicCompanyFromJSON(jsonValue));
    }

    /**
     * FIXME
     */
    async postCompanies(requestParameters: PostCompaniesRequest): Promise<PublicCompany> {
        const response = await this.postCompaniesRaw(requestParameters);
        return await response.value();
    }

    /**
     * FIXME
     */
    async postCompaniesCompanyidGroupRaw(requestParameters: PostCompaniesCompanyidGroupRequest): Promise<runtime.ApiResponse<PublicCompany>> {
        if (requestParameters.companyId === null || requestParameters.companyId === undefined) {
            throw new runtime.RequiredError('companyId','Required parameter requestParameters.companyId was null or undefined when calling postCompaniesCompanyidGroup.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = this.configuration.apiKey("Authorization"); // jwt authentication
        }

        const response = await this.request({
            path: `/companies/{companyId}/group`.replace(`{${"companyId"}}`, encodeURIComponent(String(requestParameters.companyId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CompanyInputToJSON(requestParameters.body),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => PublicCompanyFromJSON(jsonValue));
    }

    /**
     * FIXME
     */
    async postCompaniesCompanyidGroup(requestParameters: PostCompaniesCompanyidGroupRequest): Promise<PublicCompany> {
        const response = await this.postCompaniesCompanyidGroupRaw(requestParameters);
        return await response.value();
    }

}
