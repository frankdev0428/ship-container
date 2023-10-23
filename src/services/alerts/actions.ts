import { createActionCreator } from 'deox'

import { AlertsApi, PublicAlertState } from '../../apis-client'
import { aelerApiFailure } from '../../frameworks/apiUtils'
import { ThunkResult } from '../../frameworks/types'
import { dispatchErrorWithEffect } from '../../store/effects'
import { getConfiguration, getConfigurationNotifs } from '../auth/keycloak'
import { AlertsApi as AlertsVisApi, VisibilityStateInput } from '../../apis-client/svc-notifs'

import { PublicVisibilityState } from './types'

export const listAlerts = Object.assign(
  (requestParameters?: {
    includeResolved?: number,
    criterionId?: string,
    orderId?: string,
    equipmentId?: string,
    equipmentLeaseContractId?: string,
    shouldIncludeVisibilityState?: number;
}): ThunkResult<Promise<void | { type: 'GET_ALERTS_SUCCESS'; payload: PublicAlertState[] }>> => {
    return async (dispatch) => {
      dispatch(listAlerts.next())

      return await new AlertsApi(getConfiguration())
        .getAlerts({ shouldIncludeVisibilityState: 1, ...requestParameters })
        .then((response: PublicAlertState[]) => dispatch(listAlerts.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, listAlerts.error(error), error)))
    }
  },
  {
    next: createActionCreator('GET_ALERTS_REQUEST'),
    complete: createActionCreator('GET_ALERTS_SUCCESS',
      resolve => (payload: PublicAlertState[]) => resolve(payload),
    ),
    error: createActionCreator('GET_ALERTS_ERROR',
      resolve => error => resolve(error),
    ),
  })

// No need to list them normally, they will come for free if setting shouldIncludeVisibilityState to true when listing alerts states
export const listAlertsStatuses = Object.assign(
  (): ThunkResult<Promise<void | { type: 'GET_ALERTS_STATUSES_SUCCESS'; payload: PublicVisibilityState[] }>> => {
    return async (dispatch) => {
      dispatch(listAlertsStatuses.next())

      return await new AlertsVisApi(getConfigurationNotifs())
        .getAlertsStatusesMine({})
        .then((response: PublicVisibilityState[]) => dispatch(listAlertsStatuses.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, listAlertsStatuses.error(error), error)))
    }
  },
  {
    next: createActionCreator('GET_ALERTS_STATUSES_REQUEST'),
    complete: createActionCreator('GET_ALERTS_STATUSES_SUCCESS',
      resolve => (payload: PublicVisibilityState[]) => resolve(payload),
    ),
    error: createActionCreator('GET_ALERTS_STATUSES_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const createAlertStatus = Object.assign(
  (payload: VisibilityStateInput): ThunkResult<Promise<void | { type: 'POST_ALERTS_STATUSES_SUCCESS'; payload: PublicVisibilityState }>> => {
    return async (dispatch) => {
      dispatch(createAlertStatus.next())

      return await new AlertsVisApi(getConfigurationNotifs())
        .postAlertsStatuses({ body: payload })
        .then((response: PublicVisibilityState) => dispatch(createAlertStatus.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, createAlertStatus.error(error), error)))
    }
  },
  {
    next: createActionCreator('POST_ALERTS_STATUSES_REQUEST'),
    complete: createActionCreator('POST_ALERTS_STATUSES_SUCCESS',
      resolve => (payload: PublicVisibilityState) => resolve(payload),
    ),
    error: createActionCreator('POST_ALERTS_STATUSES_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const updateAlertStatus = Object.assign(
  (payload: VisibilityStateInput): ThunkResult<Promise<void | { type: 'PUT_ALERTS_STATUSES_SUCCESS'; payload: PublicVisibilityState }>> => {
    return async (dispatch) => {
      dispatch(updateAlertStatus.next())

      return await new AlertsVisApi(getConfigurationNotifs())
        .putAlertsStatuses({ body: payload })
        .then((response: PublicVisibilityState) => dispatch(updateAlertStatus.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, updateAlertStatus.error(error), error)))
    }
  },
  {
    next: createActionCreator('PUT_ALERTS_STATUSES_REQUEST'),
    complete: createActionCreator('PUT_ALERTS_STATUSES_SUCCESS',
      resolve => (payload: PublicVisibilityState) => resolve(payload),
    ),
    error: createActionCreator('PUT_ALERTS_STATUSES_ERROR',
      resolve => error => resolve(error),
    ),
  })
