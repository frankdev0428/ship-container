/* tslint:disable */
/* eslint-disable */
/**
 * Nexxiot Boards
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
 * @interface NexxiotBoard
 */
export interface NexxiotBoard {
    /**
     * 
     * @type {string}
     * @memberof NexxiotBoard
     */
    boardId: string;
    /**
     * Container name associated to Nexxiot device
     * @type {string}
     * @memberof NexxiotBoard
     */
    containerId?: string;
    /**
     * Board build date
     * @type {Date}
     * @memberof NexxiotBoard
     */
    buildDate?: Date;
    /**
     * Board hardware version
     * @type {string}
     * @memberof NexxiotBoard
     */
    hwVersion?: string;
    /**
     * Board firmware version
     * @type {string}
     * @memberof NexxiotBoard
     */
    fwVersion?: string;
    /**
     * Board hardware minor revision
     * @type {string}
     * @memberof NexxiotBoard
     */
    hwMinorRevision?: string;
    /**
     * Board firmware minor revision
     * @type {string}
     * @memberof NexxiotBoard
     */
    fwMinorRevision?: string;
    /**
     * hasGps
     * @type {boolean}
     * @memberof NexxiotBoard
     */
    hasGps?: boolean;
    /**
     * hasShock
     * @type {boolean}
     * @memberof NexxiotBoard
     */
    hasShock?: boolean;
    /**
     * hasTempExt
     * @type {boolean}
     * @memberof NexxiotBoard
     */
    hasTempExt?: boolean;
    /**
     * hasTempInt
     * @type {boolean}
     * @memberof NexxiotBoard
     */
    hasTempInt?: boolean;
    /**
     * hasPressureExt
     * @type {boolean}
     * @memberof NexxiotBoard
     */
    hasPressureExt?: boolean;
    /**
     * hasPressureInt
     * @type {boolean}
     * @memberof NexxiotBoard
     */
    hasPressureInt?: boolean;
    /**
     * hasGases
     * @type {boolean}
     * @memberof NexxiotBoard
     */
    hasGases?: boolean;
    /**
     * hasLightInt
     * @type {boolean}
     * @memberof NexxiotBoard
     */
    hasLightInt?: boolean;
    /**
     * hasLightExt
     * @type {boolean}
     * @memberof NexxiotBoard
     */
    hasLightExt?: boolean;
    /**
     * hasDoor
     * @type {boolean}
     * @memberof NexxiotBoard
     */
    hasDoor?: boolean;
    /**
     * hasRFID
     * @type {boolean}
     * @memberof NexxiotBoard
     */
    hasRFID?: boolean;
}

export function NexxiotBoardFromJSON(json: any): NexxiotBoard {
    return NexxiotBoardFromJSONTyped(json, false);
}

export function NexxiotBoardFromJSONTyped(json: any, ignoreDiscriminator: boolean): NexxiotBoard {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'boardId': json['boardId'],
        'containerId': !exists(json, 'containerId') ? undefined : json['containerId'],
        'buildDate': !exists(json, 'buildDate') ? undefined : (new Date(json['buildDate'])),
        'hwVersion': !exists(json, 'hwVersion') ? undefined : json['hwVersion'],
        'fwVersion': !exists(json, 'fwVersion') ? undefined : json['fwVersion'],
        'hwMinorRevision': !exists(json, 'hwMinorRevision') ? undefined : json['hwMinorRevision'],
        'fwMinorRevision': !exists(json, 'fwMinorRevision') ? undefined : json['fwMinorRevision'],
        'hasGps': !exists(json, 'hasGps') ? undefined : json['hasGps'],
        'hasShock': !exists(json, 'hasShock') ? undefined : json['hasShock'],
        'hasTempExt': !exists(json, 'hasTempExt') ? undefined : json['hasTempExt'],
        'hasTempInt': !exists(json, 'hasTempInt') ? undefined : json['hasTempInt'],
        'hasPressureExt': !exists(json, 'hasPressureExt') ? undefined : json['hasPressureExt'],
        'hasPressureInt': !exists(json, 'hasPressureInt') ? undefined : json['hasPressureInt'],
        'hasGases': !exists(json, 'hasGases') ? undefined : json['hasGases'],
        'hasLightInt': !exists(json, 'hasLightInt') ? undefined : json['hasLightInt'],
        'hasLightExt': !exists(json, 'hasLightExt') ? undefined : json['hasLightExt'],
        'hasDoor': !exists(json, 'hasDoor') ? undefined : json['hasDoor'],
        'hasRFID': !exists(json, 'hasRFID') ? undefined : json['hasRFID'],
    };
}

export function NexxiotBoardToJSON(value?: NexxiotBoard | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'boardId': value.boardId,
        'containerId': value.containerId,
        'buildDate': value.buildDate === undefined ? undefined : (value.buildDate.toISOString().substr(0,10)),
        'hwVersion': value.hwVersion,
        'fwVersion': value.fwVersion,
        'hwMinorRevision': value.hwMinorRevision,
        'fwMinorRevision': value.fwMinorRevision,
        'hasGps': value.hasGps,
        'hasShock': value.hasShock,
        'hasTempExt': value.hasTempExt,
        'hasTempInt': value.hasTempInt,
        'hasPressureExt': value.hasPressureExt,
        'hasPressureInt': value.hasPressureInt,
        'hasGases': value.hasGases,
        'hasLightInt': value.hasLightInt,
        'hasLightExt': value.hasLightExt,
        'hasDoor': value.hasDoor,
        'hasRFID': value.hasRFID,
    };
}


