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
    PublicEquipmentLeaseCT,
    PublicEquipmentLeaseCTFromJSON,
    PublicEquipmentLeaseCTToJSON,
} from '../models';

/**
 * 
 */
export class LeasesByCustomerApi extends runtime.BaseAPI {

    /**
     * get all equipment leases permitted for customer plus locations
     */
    async getLeasesbycustomerRaw(): Promise<runtime.ApiResponse<Array<PublicEquipmentLeaseCT>>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = this.configuration.apiKey("Authorization"); // jwt authentication
        }

        const response = await this.request({
            path: `/leasesByCustomer`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(PublicEquipmentLeaseCTFromJSON));
    }

    /**
     * get all equipment leases permitted for customer plus locations
     */
    async getLeasesbycustomer(): Promise<Array<PublicEquipmentLeaseCT>> {
        const response = await this.getLeasesbycustomerRaw();
        return await response.value();
    }

}
