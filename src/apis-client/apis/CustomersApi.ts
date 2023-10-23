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
    Failure,
    FailureFromJSON,
    FailureToJSON,
} from '../models';

export interface GetCustomersRequest {
    startswith: string;
}

/**
 * 
 */
export class CustomersApi extends runtime.BaseAPI {

    /**
     * Autocomplete customer names
     */
    async getCustomersRaw(requestParameters: GetCustomersRequest): Promise<runtime.ApiResponse<Array<string>>> {
        if (requestParameters.startswith === null || requestParameters.startswith === undefined) {
            throw new runtime.RequiredError('startswith','Required parameter requestParameters.startswith was null or undefined when calling getCustomers.');
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
            path: `/customers`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse<any>(response);
    }

    /**
     * Autocomplete customer names
     */
    async getCustomers(requestParameters: GetCustomersRequest): Promise<Array<string>> {
        const response = await this.getCustomersRaw(requestParameters);
        return await response.value();
    }

}