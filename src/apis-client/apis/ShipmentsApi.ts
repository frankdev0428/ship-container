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
    Shipment,
    ShipmentFromJSON,
    ShipmentToJSON,
    ShipmentInput,
    ShipmentInputFromJSON,
    ShipmentInputToJSON,
    ShipmentStatus,
    ShipmentStatusFromJSON,
    ShipmentStatusToJSON,
    ShipmentStatusInput,
    ShipmentStatusInputFromJSON,
    ShipmentStatusInputToJSON,
    ShipmentTransport,
    ShipmentTransportFromJSON,
    ShipmentTransportToJSON,
    ShipmentTransportInput,
    ShipmentTransportInputFromJSON,
    ShipmentTransportInputToJSON,
} from '../models';

export interface GetShipmentsRequest {
    status?: string;
}

export interface GetShipmentsShipmentidRequest {
    shipmentId: string;
}

export interface PostShipmentsRequest {
    body?: ShipmentInput;
}

export interface PostShipmentsShipmentidStatusRequest {
    shipmentId: string;
    body?: ShipmentStatusInput;
}

export interface PostShipmentsShipmentidTransportRequest {
    shipmentId: string;
    body?: ShipmentTransportInput;
}

/**
 * 
 */
export class ShipmentsApi extends runtime.BaseAPI {

    /**
     * get shipments
     */
    async getShipmentsRaw(requestParameters: GetShipmentsRequest): Promise<runtime.ApiResponse<Array<Shipment>>> {
        const queryParameters: any = {};

        if (requestParameters.status !== undefined) {
            queryParameters['status'] = requestParameters.status;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = this.configuration.apiKey("Authorization"); // jwt authentication
        }

        const response = await this.request({
            path: `/shipments`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(ShipmentFromJSON));
    }

    /**
     * get shipments
     */
    async getShipments(requestParameters: GetShipmentsRequest): Promise<Array<Shipment>> {
        const response = await this.getShipmentsRaw(requestParameters);
        return await response.value();
    }

    /**
     * get shipment
     */
    async getShipmentsShipmentidRaw(requestParameters: GetShipmentsShipmentidRequest): Promise<runtime.ApiResponse<Shipment>> {
        if (requestParameters.shipmentId === null || requestParameters.shipmentId === undefined) {
            throw new runtime.RequiredError('shipmentId','Required parameter requestParameters.shipmentId was null or undefined when calling getShipmentsShipmentid.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = this.configuration.apiKey("Authorization"); // jwt authentication
        }

        const response = await this.request({
            path: `/shipments/{shipmentId}`.replace(`{${"shipmentId"}}`, encodeURIComponent(String(requestParameters.shipmentId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => ShipmentFromJSON(jsonValue));
    }

    /**
     * get shipment
     */
    async getShipmentsShipmentid(requestParameters: GetShipmentsShipmentidRequest): Promise<Shipment> {
        const response = await this.getShipmentsShipmentidRaw(requestParameters);
        return await response.value();
    }

    /**
     * create shipment
     */
    async postShipmentsRaw(requestParameters: PostShipmentsRequest): Promise<runtime.ApiResponse<Shipment>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = this.configuration.apiKey("Authorization"); // jwt authentication
        }

        const response = await this.request({
            path: `/shipments`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ShipmentInputToJSON(requestParameters.body),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => ShipmentFromJSON(jsonValue));
    }

    /**
     * create shipment
     */
    async postShipments(requestParameters: PostShipmentsRequest): Promise<Shipment> {
        const response = await this.postShipmentsRaw(requestParameters);
        return await response.value();
    }

    /**
     * create shipment status
     */
    async postShipmentsShipmentidStatusRaw(requestParameters: PostShipmentsShipmentidStatusRequest): Promise<runtime.ApiResponse<ShipmentStatus>> {
        if (requestParameters.shipmentId === null || requestParameters.shipmentId === undefined) {
            throw new runtime.RequiredError('shipmentId','Required parameter requestParameters.shipmentId was null or undefined when calling postShipmentsShipmentidStatus.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = this.configuration.apiKey("Authorization"); // jwt authentication
        }

        const response = await this.request({
            path: `/shipments/{shipmentId}/status`.replace(`{${"shipmentId"}}`, encodeURIComponent(String(requestParameters.shipmentId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ShipmentStatusInputToJSON(requestParameters.body),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => ShipmentStatusFromJSON(jsonValue));
    }

    /**
     * create shipment status
     */
    async postShipmentsShipmentidStatus(requestParameters: PostShipmentsShipmentidStatusRequest): Promise<ShipmentStatus> {
        const response = await this.postShipmentsShipmentidStatusRaw(requestParameters);
        return await response.value();
    }

    /**
     * create shipment transport
     */
    async postShipmentsShipmentidTransportRaw(requestParameters: PostShipmentsShipmentidTransportRequest): Promise<runtime.ApiResponse<ShipmentTransport>> {
        if (requestParameters.shipmentId === null || requestParameters.shipmentId === undefined) {
            throw new runtime.RequiredError('shipmentId','Required parameter requestParameters.shipmentId was null or undefined when calling postShipmentsShipmentidTransport.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = this.configuration.apiKey("Authorization"); // jwt authentication
        }

        const response = await this.request({
            path: `/shipments/{shipmentId}/transport`.replace(`{${"shipmentId"}}`, encodeURIComponent(String(requestParameters.shipmentId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ShipmentTransportInputToJSON(requestParameters.body),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => ShipmentTransportFromJSON(jsonValue));
    }

    /**
     * create shipment transport
     */
    async postShipmentsShipmentidTransport(requestParameters: PostShipmentsShipmentidTransportRequest): Promise<ShipmentTransport> {
        const response = await this.postShipmentsShipmentidTransportRaw(requestParameters);
        return await response.value();
    }

}
