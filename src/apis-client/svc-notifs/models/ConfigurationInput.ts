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
 * @interface ConfigurationInput
 */
export interface ConfigurationInput {
    /**
     * 
     * @type {boolean}
     * @memberof ConfigurationInput
     */
    muteAll: boolean;
}

export function ConfigurationInputFromJSON(json: any): ConfigurationInput {
    return ConfigurationInputFromJSONTyped(json, false);
}

export function ConfigurationInputFromJSONTyped(json: any, ignoreDiscriminator: boolean): ConfigurationInput {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'muteAll': json['muteAll'],
    };
}

export function ConfigurationInputToJSON(value?: ConfigurationInput | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'muteAll': value.muteAll,
    };
}


