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
 * @interface PublicPendingNotification
 */
export interface PublicPendingNotification {
    /**
     * 
     * @type {string}
     * @memberof PublicPendingNotification
     */
    recipient: string;
    /**
     * 
     * @type {string}
     * @memberof PublicPendingNotification
     */
    title: string;
    /**
     * 
     * @type {string}
     * @memberof PublicPendingNotification
     */
    body: string;
    /**
     * we also store the user ID for convenience (check the config)
     * @type {string}
     * @memberof PublicPendingNotification
     */
    recipientId?: string;
    /**
     * 
     * @type {Date}
     * @memberof PublicPendingNotification
     */
    createdAt: Date;
    /**
     * 
     * @type {string}
     * @memberof PublicPendingNotification
     */
    id: string;
    /**
     * 
     * @type {boolean}
     * @memberof PublicPendingNotification
     */
    isPending: boolean;
}

export function PublicPendingNotificationFromJSON(json: any): PublicPendingNotification {
    return PublicPendingNotificationFromJSONTyped(json, false);
}

export function PublicPendingNotificationFromJSONTyped(json: any, ignoreDiscriminator: boolean): PublicPendingNotification {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'recipient': json['recipient'],
        'title': json['title'],
        'body': json['body'],
        'recipientId': !exists(json, 'recipientId') ? undefined : json['recipientId'],
        'createdAt': (new Date(json['createdAt'])),
        'id': json['id'],
        'isPending': json['isPending'],
    };
}

export function PublicPendingNotificationToJSON(value?: PublicPendingNotification | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'recipient': value.recipient,
        'title': value.title,
        'body': value.body,
        'recipientId': value.recipientId,
        'createdAt': (value.createdAt.toISOString()),
        'id': value.id,
        'isPending': value.isPending,
    };
}


