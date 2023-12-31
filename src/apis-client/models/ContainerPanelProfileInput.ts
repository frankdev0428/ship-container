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
 * 
 * @export
 * @interface ContainerPanelProfileInput
 */
export interface ContainerPanelProfileInput {
    /**
     * 
     * @type {string}
     * @memberof ContainerPanelProfileInput
     */
    leftPanel?: string;
    /**
     * 
     * @type {string}
     * @memberof ContainerPanelProfileInput
     */
    rightPanel?: string;
    /**
     * 
     * @type {string}
     * @memberof ContainerPanelProfileInput
     */
    roofPanel?: string;
    /**
     * 
     * @type {string}
     * @memberof ContainerPanelProfileInput
     */
    endPanel?: string;
}

export function ContainerPanelProfileInputFromJSON(json: any): ContainerPanelProfileInput {
    return ContainerPanelProfileInputFromJSONTyped(json, false);
}

export function ContainerPanelProfileInputFromJSONTyped(json: any, ignoreDiscriminator: boolean): ContainerPanelProfileInput {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'leftPanel': !exists(json, 'leftPanel') ? undefined : json['leftPanel'],
        'rightPanel': !exists(json, 'rightPanel') ? undefined : json['rightPanel'],
        'roofPanel': !exists(json, 'roofPanel') ? undefined : json['roofPanel'],
        'endPanel': !exists(json, 'endPanel') ? undefined : json['endPanel'],
    };
}

export function ContainerPanelProfileInputToJSON(value?: ContainerPanelProfileInput | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'leftPanel': value.leftPanel,
        'rightPanel': value.rightPanel,
        'roofPanel': value.roofPanel,
        'endPanel': value.endPanel,
    };
}


