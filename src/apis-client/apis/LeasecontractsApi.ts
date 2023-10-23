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
    EquipmentLeaseContractUpdate,
    EquipmentLeaseContractUpdateFromJSON,
    EquipmentLeaseContractUpdateToJSON,
    EquipmentLeaseContractWithLease,
    EquipmentLeaseContractWithLeaseFromJSON,
    EquipmentLeaseContractWithLeaseToJSON,
    Failure,
    FailureFromJSON,
    FailureToJSON,
} from '../models';

export interface PatchLeasecontractsEquipmentleasecontractidRequest {
    equipmentLeaseContractId: string;
    body?: EquipmentLeaseContractUpdate;
}

/**
 * 
 */
export class LeasecontractsApi extends runtime.BaseAPI {

    /**
     * Update equipment lease contract
     */
    async patchLeasecontractsEquipmentleasecontractidRaw(requestParameters: PatchLeasecontractsEquipmentleasecontractidRequest): Promise<runtime.ApiResponse<EquipmentLeaseContractWithLease>> {
        if (requestParameters.equipmentLeaseContractId === null || requestParameters.equipmentLeaseContractId === undefined) {
            throw new runtime.RequiredError('equipmentLeaseContractId','Required parameter requestParameters.equipmentLeaseContractId was null or undefined when calling patchLeasecontractsEquipmentleasecontractid.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = this.configuration.apiKey("Authorization"); // jwt authentication
        }

        const response = await this.request({
            path: `/leasecontracts/{equipmentLeaseContractId}`.replace(`{${"equipmentLeaseContractId"}}`, encodeURIComponent(String(requestParameters.equipmentLeaseContractId))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: EquipmentLeaseContractUpdateToJSON(requestParameters.body),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => EquipmentLeaseContractWithLeaseFromJSON(jsonValue));
    }

    /**
     * Update equipment lease contract
     */
    async patchLeasecontractsEquipmentleasecontractid(requestParameters: PatchLeasecontractsEquipmentleasecontractidRequest): Promise<EquipmentLeaseContractWithLease> {
        const response = await this.patchLeasecontractsEquipmentleasecontractidRaw(requestParameters);
        return await response.value();
    }

}
