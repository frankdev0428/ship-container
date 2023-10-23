import { isEqual } from 'date-fns'
import { createReducer } from 'deox'

import {
  listContainersAvPctIdle,
  listContainersAvPctUsage,
  listContainerPctIdle,
  listContainerPctUsage,
  listKpiContainerPctMnr,
  listContainersAvPctMnr,
  listKpiContainersStatusCounts,
  listKpiIdleCost, listKpiAllocatedDays,
  listKpiOrderStatusCounts,
  listKpiOrderStartsTimeseries,
  listKpiOrderStartsBins,
  listKpiOrderStarts,
  listKpiOrderEndstimeseries,
  listKpiOrderEndsBins,
  listKpiOrderEnds,
  listKpiOrderTotal,
  listKpiOngoingOrders,
  listKpiAcceptedAndReady,
  listKpiOrderByCustomer,
  listKpiOrdersAcceptedNotReady,
  listKpiContainersTotalStatCounts,
  listKpiContainersAvailStatCounts,
  listKpiIdleDays,
} from './actions'
import * as t from './types'

const initialState: t.ReportingReducerState = {
  // single container request
  containerPctIdle: [],
  containerPctUsage: [],
  containerPctMnr: [],
  // CONTAINERS
  containersStatusCounts: [],
  containersTotalStatusCounts: [],
  containersAvailStatusCounts: undefined,
  containersIdleAvPct: [],
  containersUsageAvPct: [],
  containersAvPctMnr: [],
  containersIdleCost: [],
  containersAllocDays: [],
  containersIdleDays: [],
  // ORDERS
  ordersStatusCounts: [],
  orderStartsTimeseries: [],
  orderStartsBins: [],
  orderStarts: [],
  orderEndsTimeseries: [],
  orderEndsBins: [],
  orderEnds: [],
  loadingStatus: false,
  ordersTotalBins: [],
  ordersOngoing: undefined,
  ordersAcceptedAndReady: undefined,
  ordersByCustomers: [],
  ordersAcceptedNotReady: [],
}

export const reportingReducers = createReducer(initialState, handleAction => [
  // SINGLE CONTAINER
  // List Container Idle
  handleAction(listContainerPctIdle.next, (state) => ({
    ...state,
    loadingStatus: true,
  })),
  handleAction(listContainerPctIdle.complete, (state: t.ReportingReducerState, { payload }) => {
    const { equipmentId, pctIdle, startDate, endDate } = payload
    return ({
      ...state,
      containerPctIdle: state.containerPctIdle.find((c) => c.equipmentId === payload.equipmentId && isEqual(new Date(payload.startDate), new Date(payload.endDate))) ? state.containerPctIdle : state.containerPctIdle.concat([{ equipmentId: equipmentId, pctIdle: pctIdle, startDate: startDate, endDate: endDate }]),
      loadingStatus: false,
    })
  }),
  handleAction(listContainerPctIdle.error, (state) => ({
    ...state,
    loadingStatus: false,
  })),
  // List Container usage pct
  handleAction(listContainerPctUsage.next, (state) => ({
    ...state,
    loadingStatus: true,
  })),
  handleAction(listContainerPctUsage.complete, (state: t.ReportingReducerState, { payload }) => {
    const { equipmentId, pctUtilization, startDate, endDate } = payload
    return ({
      ...state,
      containerPctUsage: state.containerPctUsage.find((c) => c.equipmentId === payload.equipmentId && isEqual(new Date(payload.startDate), new Date(payload.endDate))) ? state.containerPctUsage : state.containerPctUsage.concat([{ equipmentId: equipmentId, pctUtilization: pctUtilization, startDate: startDate, endDate: endDate }]),
      loadingStatus: false,
    })
  }),
  handleAction(listContainerPctUsage.error, (state) => ({
    ...state,
    loadingStatus: false,
  })),
  // List Container pct mrn
  handleAction(listKpiContainerPctMnr.next, (state) => ({
    ...state,
    loadingStatus: true,
  })),
  handleAction(listKpiContainerPctMnr.complete, (state: t.ReportingReducerState, { payload }) => {
    const { equipmentId, pctMnr, startDate, endDate } = payload
    return ({
      ...state,
      containerPctMnr: state.containerPctMnr.find((c) => c.equipmentId === payload.equipmentId && isEqual(new Date(payload.startDate), new Date(payload.endDate))) ? state.containerPctMnr : state.containerPctMnr.concat([{ equipmentId: equipmentId, pctMnr: pctMnr, startDate: startDate, endDate: endDate }]),
      loadingStatus: false,
    })
  }),
  handleAction(listKpiContainerPctMnr.error, (state) => ({
    ...state,
    loadingStatus: false,
  })),

  // CONTAINERS
  // Containers usage pct av
  handleAction(listContainersAvPctUsage.next, (state) => ({
    ...state,
    loadingStatus: true,
  })),
  handleAction(listContainersAvPctUsage.complete, (state: t.ReportingReducerState, { payload }) => {
    return ({
      ...state,
      containersUsageAvPct: payload,
      loadingStatus: false,
    })
  }),
  handleAction(listContainersAvPctUsage.error, (state) => ({
    ...state,
    loadingStatus: false,
  })),
  // Containers idle pct av
  handleAction(listContainersAvPctIdle.next, (state) => ({
    ...state,
    loadingStatus: true,
  })),
  handleAction(listContainersAvPctIdle.complete, (state: t.ReportingReducerState, { payload }) => {
    return ({
      ...state,
      containersIdleAvPct: [{ avPctIdle: payload.avPctIdle, startDate: payload.startDate, endDate: payload.endDate }],
      loadingStatus: false,
    })
  }),
  handleAction(listContainersAvPctIdle.error, (state) => ({
    ...state,
    loadingStatus: false,
  })),
  // Containers av pct mrn
  handleAction(listContainersAvPctMnr.next, (state) => ({
    ...state,
    loadingStatus: true,
  })),
  handleAction(listContainersAvPctMnr.complete, (state: t.ReportingReducerState, { payload }) => {
    return ({
      ...state,
      containersAvPctMnr: [{ avPctMnr: payload.avPctMnr, startDate: payload.startDate, endDate: payload.endDate, activeOnly: payload.activeOnly }],
      loadingStatus: false,
    })
  }),
  handleAction(listContainersAvPctMnr.error, (state) => ({
    ...state,
    loadingStatus: false,
  })),
  // Containers status count
  handleAction(listKpiContainersStatusCounts.next, (state) => ({
    ...state,
    loadingStatus: true,
  })),
  handleAction(listKpiContainersStatusCounts.complete, (state: t.ReportingReducerState, { payload }) => {
    return ({
      ...state,
      containersStatusCounts: [payload.statusCounts],
      loadingStatus: false,
    })
  }),
  handleAction(listKpiContainersStatusCounts.error, (state) => ({
    ...state,
    loadingStatus: false,
  })),
  // Containers total status count
  handleAction(listKpiContainersTotalStatCounts.next, (state) => ({
    ...state,
    loadingStatus: true,
  })),
  handleAction(listKpiContainersTotalStatCounts.complete, (state: t.ReportingReducerState, { payload }) => {
    return ({
      ...state,
      containersTotalStatusCounts: [payload.totalAv],
      loadingStatus: false,
    })
  }),
  handleAction(listKpiContainersTotalStatCounts.error, (state) => ({
    ...state,
    loadingStatus: false,
  })),
  // Containers total status count
  handleAction(listKpiContainersAvailStatCounts.next, (state) => ({
    ...state,
    loadingStatus: true,
  })),
  handleAction(listKpiContainersAvailStatCounts.complete, (state: t.ReportingReducerState, { payload }) => {
    return ({
      ...state,
      containersAvailStatusCounts: payload[0][1],
      loadingStatus: false,
    })
  }),
  handleAction(listKpiContainersAvailStatCounts.error, (state) => ({
    ...state,
    loadingStatus: false,
  })),
  // Idle cost
  handleAction(listKpiIdleCost.next, (state) => ({
    ...state,
    loadingStatus: true,
  })),
  handleAction(listKpiIdleCost.complete, (state: t.ReportingReducerState, { payload }) => {
    return ({
      ...state,
      containersIdleCost: [{ idleCost: payload.idleCost, startDate: payload.startDate, endDate: payload.endDate }],
      loadingStatus: false,
    })
  }),
  handleAction(listKpiIdleCost.error, (state) => ({
    ...state,
    loadingStatus: false,
  })),
  // Containers allocated days
  handleAction(listKpiAllocatedDays.next, (state) => ({
    ...state,
    loadingStatus: true,
  })),
  handleAction(listKpiAllocatedDays.complete, (state: t.ReportingReducerState, { payload }) => {
    return ({
      ...state,
      containersAllocDays: payload,
      loadingStatus: false,
    })
  }),
  handleAction(listKpiAllocatedDays.error, (state) => ({
    ...state,
    loadingStatus: false,
  })),
  // Containers idle days
  handleAction(listKpiIdleDays.next, (state) => ({
    ...state,
    loadingStatus: true,
  })),
  handleAction(listKpiIdleDays.complete, (state: t.ReportingReducerState, { payload }) => {
    return ({
      ...state,
      containersIdleDays: payload,
      loadingStatus: false,
    })
  }),
  handleAction(listKpiIdleDays.error, (state) => ({
    ...state,
    loadingStatus: false,
  })),

  // ORDERS
  // Orders status counts
  handleAction(listKpiOrderStatusCounts.next, (state) => ({
    ...state,
    loadingStatus: true,
  })),
  handleAction(listKpiOrderStatusCounts.complete, (state: t.ReportingReducerState, { payload }) => {
    return ({
      ...state,
      ordersStatusCounts: payload.statusCounts,
      loadingStatus: false,
    })
  }),
  handleAction(listKpiOrderStatusCounts.error, (state) => ({
    ...state,
    loadingStatus: false,
  })),
  // Orders starts timeseries
  handleAction(listKpiOrderStartsTimeseries.next, (state) => ({
    ...state,
    loadingStatus: true,
  })),
  handleAction(listKpiOrderStartsTimeseries.complete, (state: t.ReportingReducerState, { payload }) => {
    return ({
      ...state,
      orderStartsTimeseries: [{ orderStartsTimeseries: payload.orderStartsTimeseries, startDate: payload.startDate, endDate: payload.endDate }],
      loadingStatus: false,
    })
  }),
  handleAction(listKpiOrderStartsTimeseries.error, (state) => ({
    ...state,
    loadingStatus: false,
  })),
  // Orders starts bins
  handleAction(listKpiOrderStartsBins.next, (state) => ({
    ...state,
    loadingStatus: true,
  })),
  handleAction(listKpiOrderStartsBins.complete, (state: t.ReportingReducerState, { payload }) => {
    return ({
      ...state,
      orderStartsBins: payload,
      loadingStatus: false,
    })
  }),
  handleAction(listKpiOrderStartsBins.error, (state) => ({
    ...state,
    loadingStatus: false,
  })),
  // Orders starts 
  handleAction(listKpiOrderStarts.next, (state) => ({
    ...state,
    loadingStatus: true,
  })),
  handleAction(listKpiOrderStarts.complete, (state: t.ReportingReducerState, { payload }) => ({
    ...state,
    orderStarts: [{ orderStarts: payload.orderStarts, startDate: payload.startDate, endDate: payload.endDate }],
    loadingStatus: false,
  })),
  handleAction(listKpiOrderStarts.error, (state) => ({
    ...state,
    loadingStatus: false,
  })),
  // Order ends timeseries
  handleAction(listKpiOrderEndstimeseries.next, (state) => ({
    ...state,
    loadingStatus: true,
  })),
  handleAction(listKpiOrderEndstimeseries.complete, (state: t.ReportingReducerState, { payload }) => ({
    ...state,
    orderEndsTimeseries: [{ orderEndsTimeseries: payload.orderEndsTimeseries, startDate: payload.startDate, endDate: payload.endDate }],
    loadingStatus: true,
  })),
  handleAction(listKpiOrderEndstimeseries.error, (state) => ({
    ...state,
    loadingStatus: false,
  })),
  // Order ends bins
  handleAction(listKpiOrderEndsBins.next, (state) => ({
    ...state,
    loadingStatus: true,
  })),
  handleAction(listKpiOrderEndsBins.complete, (state: t.ReportingReducerState, { payload }) => {
    return ({
      ...state,
      orderEndsBins: payload,
      loadingStatus: false,
    })
  }),
  handleAction(listKpiOrderEndsBins.error, (state) => ({
    ...state,
    loadingStatus: false,
  })),
  // Order ends 
  handleAction(listKpiOrderEnds.next, (state) => ({
    ...state,
    loadingStatus: true,
  })),
  handleAction(listKpiOrderEnds.complete, (state: t.ReportingReducerState, { payload }) => {
    return ({
      ...state,
      orderEnds: [{ orderEnds: payload.orderEnds, startDate: payload.startDate, endDate: payload.endDate }],
      loadingStatus: false,
    })
  }),
  handleAction(listKpiOrderEnds.error, (state) => ({
    ...state,
    loadingStatus: false,
  })),
  // listKpiOrderTotal
  handleAction(listKpiOrderTotal.next, (state) => ({
    ...state,
    loadingStatus: true,
  })),
  handleAction(listKpiOrderTotal.complete, (state: t.ReportingReducerState, { payload }) => {
    return ({
      ...state,
      ordersTotalBins: payload as unknown as any[],
      loadingStatus: false,
    })
  }),
  handleAction(listKpiOrderTotal.error, (state) => ({
    ...state,
    loadingStatus: false,
  })),
  // ongoing orders -- order status counts
  handleAction(listKpiOngoingOrders.next, (state) => ({
    ...state,
    loadingStatus: true,
  })),
  handleAction(listKpiOngoingOrders.complete, (state: t.ReportingReducerState, { payload }) => {
    const { res } = payload
    return ({
      ...state,
      ordersOngoing: res as any,
      loadingStatus: false,
    })
  }),
  handleAction(listKpiOngoingOrders.error, (state) => ({
    ...state,
    loadingStatus: false,
  })),
  // Accepted and ready orders -- order status counts
  handleAction(listKpiAcceptedAndReady.next, (state) => ({
    ...state,
    loadingStatus: true,
  })),
  handleAction(listKpiAcceptedAndReady.complete, (state: t.ReportingReducerState, { payload }) => {
    const { res } = payload
    return ({
      ...state,
      ordersAcceptedAndReady: res as any,
      loadingStatus: false,
    })
  }),
  handleAction(listKpiAcceptedAndReady.error, (state) => ({
    ...state,
    loadingStatus: false,
  })),
  // Order by customer
  handleAction(listKpiOrderByCustomer.next, (state) => ({
    ...state,
    loadingStatus: true,
  })),
  handleAction(listKpiOrderByCustomer.complete, (state: t.ReportingReducerState, { payload }) => {
    return ({
      ...state,
      ordersByCustomers: payload as unknown as any[],
      loadingStatus: false,
    })
  }),
  handleAction(listKpiOrderByCustomer.error, (state) => ({
    ...state,
    loadingStatus: false,
  })),
  // Accepted not ready (orders)
  handleAction(listKpiOrdersAcceptedNotReady.next, (state) => ({
    ...state,
    loadingStatus: true,
  })),
  handleAction(listKpiOrdersAcceptedNotReady.complete, (state: t.ReportingReducerState, { payload }) => {
    return ({
      ...state,
      ordersAcceptedNotReady: payload,
      loadingStatus: false,
    })
  }),
  handleAction(listKpiOrdersAcceptedNotReady.error, (state) => ({
    ...state,
    loadingStatus: false,
  })),
])
