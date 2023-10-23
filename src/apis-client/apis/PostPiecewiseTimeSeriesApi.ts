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
    Model35,
    Model35FromJSON,
    Model35ToJSON,
    Model36,
    Model36FromJSON,
    Model36ToJSON,
} from '../models';

export interface PostPostpiecewisetimeseriesRequest {
    body?: Model35;
}

/**
 * 
 */
export class PostPiecewiseTimeSeriesApi extends runtime.BaseAPI {

    /**
     * postPiecewiseTimeSeries
     */
    async postPostpiecewisetimeseriesRaw(requestParameters: PostPostpiecewisetimeseriesRequest): Promise<runtime.ApiResponse<Model36>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = this.configuration.apiKey("Authorization"); // jwt authentication
        }

        const response = await this.request({
            path: `/postPiecewiseTimeSeries`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: Model35ToJSON(requestParameters.body),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => Model36FromJSON(jsonValue));
    }

    /**
     * postPiecewiseTimeSeries
     */
    async postPostpiecewisetimeseries(requestParameters: PostPostpiecewisetimeseriesRequest): Promise<Model36> {
        const response = await this.postPostpiecewisetimeseriesRaw(requestParameters);
        return await response.value();
    }

}