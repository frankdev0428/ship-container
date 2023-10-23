import { createReducer } from 'deox'

import { listAlerts, createAlertStatus, updateAlertStatus } from './actions'
import * as t from './types'

const initialState: t.AlertsReducerState = {
  alerts: [],
  statuses: [],
  loadingStatus: false,
  loadingAlertStatus: false,
}

export const alertsReducers = createReducer(initialState, handleAction => [
  handleAction(listAlerts.next, (state) => ({
    ...state,
    loadingStatus: true,
  })),
  handleAction(listAlerts.complete, (state: t.AlertsReducerState, { payload }) => {
    return ({
      ...state,
      alerts: payload,
      loadingStatus: false,
    })
  }),
  handleAction(listAlerts.error, (state) => ({
    ...state,
    loadingStatus: false,
  })),
  /** List */
  // handleAction(listAlertsStatuses.next, (state) => ({
  //   ...state,
  //   loadingAlertStatus: true,
  // })),
  /* handleAction(listAlertsStatuses.complete, (state: t.AlertsReducerState, { payload }) => {
    return ({
      ...state,
      // TODO: maybe we want to update the alerts readAt when refreshing from here?
      loadingStatus: false,
    })
  }),
  handleAction(listAlertsStatuses.error, (state) => ({
    ...state,
    loadingStatus: false,
  })), */
  /** Create */
  handleAction(createAlertStatus.next, (state) => ({
    ...state,
    loadingAlertStatus: true,
  })),
  handleAction(createAlertStatus.complete, (state: t.AlertsReducerState, { payload }) => {
    return ({
      ...state,
      alerts: state.alerts.map(a => a.alertStateId === payload.alertStateId ? { ...a, readAt: payload.readAt as any } : a),
      loadingAlertStatus: false,
    })
  }),
  handleAction(createAlertStatus.error, (state) => ({
    ...state,
    loadingAlertStatus: false,
  })),
  /** Update */
  handleAction(updateAlertStatus.next, (state) => ({
    ...state,
    loadingAlertStatus: true,
  })),
  handleAction(updateAlertStatus.complete, (state: t.AlertsReducerState, { payload }) => {
    return ({
      ...state,
      alerts: state.alerts.map(a => a.alertStateId === payload.alertStateId ? { ...a, readAt: payload.readAt as any } : a),
      loadingAlertStatus: false,
    })
  }),
  handleAction(updateAlertStatus.error, (state) => ({
    ...state,
    loadingAlertStatus: false,
  })),
])
