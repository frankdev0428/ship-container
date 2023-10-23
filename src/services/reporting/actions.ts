import { createActionCreator } from 'deox'
import { format } from 'date-fns'

import { KpiApi } from '../../apis-client'
import { ThunkResult } from '../../frameworks/types'
import { aelerApiFailure } from '../../frameworks/apiUtils'
import { dispatchErrorWithEffect } from '../../store/effects'
import { getConfiguration } from '../auth/keycloak'

// SINGLE CONTAINER REQUEST 

// CONTAINER PERCENTAGE MNR
export const listKpiContainerPctMnr = Object.assign(
  (requestParameters: {equipmentId: string, startDate: string, endDate: string}): ThunkResult<Promise<void | { type: 'GET_CONTAINER_PCT_MNR_SUCCESS'; payload: {pctMnr: number, equipmentId: string, startDate: string, endDate: string} }>> => {
    return async (dispatch) => {
      dispatch(listKpiContainerPctMnr.next())

      return await new KpiApi(getConfiguration())
        .getKpiPctmnr(requestParameters)
        .then((response: any) => dispatch(listKpiContainerPctMnr.complete(response.pctMnr, requestParameters.equipmentId, requestParameters.startDate, requestParameters.endDate)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, listKpiContainerPctMnr.error(error), error)))
    }
  },
  {
    next: createActionCreator('GET_CONTAINER_PCT_MNR_REQUEST'),
    complete: createActionCreator('GET_CONTAINER_PCT_MNR_SUCCESS',
      resolve => (pctMnr: number, equipmentId: string, startDate: string, endDate: string) => resolve({ pctMnr, equipmentId, startDate, endDate }),
    ),
    error: createActionCreator('GET_CONTAINER_PCT_MNR_ERROR',
      resolve => error => resolve(error),
    ),
  })

// PCT IDLE
export const listContainerPctIdle = Object.assign(
  (requestParameters: {equipmentId: string, startDate: string, endDate: string}): ThunkResult<Promise<void | { type: 'GET_CONTAINER_PCT_IDLE_SUCCESS'; payload: {pctIdle: number, equipmentId: string, startDate: string, endDate: string} }>> => {
    return async (dispatch) => {
      dispatch(listContainerPctIdle.next())

      return await new KpiApi(getConfiguration())
        .getKpiPctidle(requestParameters)
        .then((response: any) => dispatch(listContainerPctIdle.complete(response.pctIdle, requestParameters.equipmentId, requestParameters.startDate, requestParameters.endDate)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, listContainerPctIdle.error(error), error)))
    }
  },
  {
    next: createActionCreator('GET_CONTAINER_PCT_IDLE_REQUEST'),
    complete: createActionCreator('GET_CONTAINER_PCT_IDLE_SUCCESS',
      resolve => (pctIdle: number, equipmentId: string, startDate: string, endDate: string) => resolve({ pctIdle, equipmentId, startDate, endDate }),
    ),
    error: createActionCreator('GET_CONTAINER_PCT_IDLE_ERROR',
      resolve => error => resolve(error),
    ),
  })

// SINGLE CONTAINER PCT USAGE
export const listContainerPctUsage = Object.assign(
  (requestParameters: {equipmentId: string, startDate: string, endDate: string}): ThunkResult<Promise<void | { type: 'GET_CONTAINER_PCT_USAGE_SUCCESS'; payload: {pctUtilization: number, equipmentId: string, startDate: string, endDate: string} }>> => {
    return async (dispatch) => {
      dispatch(listContainerPctUsage.next())

      return await new KpiApi(getConfiguration())
        .getKpiPctutilization(requestParameters)
        .then((response: any) => dispatch(listContainerPctUsage.complete(response.pctUtilization, requestParameters.equipmentId, requestParameters.startDate, requestParameters.endDate)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, listContainerPctUsage.error(error), error)))
    }
  },
  {
    next: createActionCreator('GET_CONTAINER_PCT_USAGE_REQUEST'),
    complete: createActionCreator('GET_CONTAINER_PCT_USAGE_SUCCESS',
      resolve => (pctUtilization: number, equipmentId: string, startDate: string, endDate: string) => resolve({ pctUtilization, equipmentId, startDate, endDate }),
    ),
    error: createActionCreator('GET_CONTAINER_PCT_USAGE_ERROR',
      resolve => error => resolve(error),
    ),
  })

// ALL CONTAINERS
// CONTAINERS AV PCT IDLE
export const listContainersAvPctIdle = Object.assign(
  (requestParameters: {startDate: string, endDate: string, activeOnly: string}): ThunkResult<Promise<void | { type: 'GET_CONTAINERS_AV_IDLE_SUCCESS'; payload: {avPctIdle: number, startDate: string, endDate: string, activeOnly: string} }>> => {
    return async (dispatch) => {
      dispatch(listContainersAvPctIdle.next())

      return await new KpiApi(getConfiguration())
        .getKpiAvpctidle(requestParameters)
        .then((response: any) => dispatch(listContainersAvPctIdle.complete(response.avPctIdle, requestParameters.startDate, requestParameters.endDate, requestParameters.activeOnly)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, listContainersAvPctIdle.error(error), error)))
    }
  },
  {
    next: createActionCreator('GET_CONTAINERS_AV_IDLE_REQUEST'),
    complete: createActionCreator('GET_CONTAINERS_AV_IDLE_SUCCESS',
      resolve => (avPctIdle: number, startDate: string, endDate: string, activeOnly: string) => resolve({ avPctIdle, startDate, endDate, activeOnly }),
    ),
    error: createActionCreator('GET_CONTAINERS_AV_IDLE_ERROR',
      resolve => error => resolve(error),
    ),
  })

// AV USAGE PERCENTAGE
export const listContainersAvPctUsage = Object.assign(
  (requestParameters: {startDate: Date, endDate: Date, activeOnly: string}): ThunkResult<Promise<void | { type: 'GET_CONTAINERS_AV_PCT_USAGE_SUCCESS'; payload: string[][]}>> => {
    return async (dispatch) => {
      dispatch(listContainersAvPctUsage.next())

      return await new KpiApi(getConfiguration())
        .getKpiAvpctutilization({ startDate: formatDate(requestParameters.startDate), endDate: formatDate(requestParameters.endDate), activeOnly: requestParameters.activeOnly })
        .then((response: string[][]) => dispatch(listContainersAvPctUsage.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, listContainersAvPctUsage.error(error), error)))
    }
  },
  {
    next: createActionCreator('GET_CONTAINERS_AV_PCT_USAGE_REQUEST'),
    complete: createActionCreator('GET_CONTAINERS_AV_PCT_USAGE_SUCCESS',
      resolve => (res: string[][]) => resolve(res),
    ),
    error: createActionCreator('GET_CONTAINERS_AV_PCT_USAGE_ERROR',
      resolve => error => resolve(error),
    ),
  })

// AV ALLOCATION
export const listContainersAvPctMnr = Object.assign(
  (requestParameters: {startDate: string, endDate: string, activeOnly: string}): ThunkResult<Promise<void | { type: 'GET_CONTAINERS_AV_PCT_MNR_SUCCESS'; payload: {avPctMnr: number, startDate: string, endDate: string, activeOnly: string} }>> => {
    return async (dispatch) => {
      dispatch(listContainersAvPctMnr.next())

      return await new KpiApi(getConfiguration())
        .getKpiAvpctmnr(requestParameters)
        .then((response: any) => dispatch(listContainersAvPctMnr.complete(response.avPctMnr, requestParameters.startDate, requestParameters.endDate, requestParameters.activeOnly)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, listContainersAvPctMnr.error(error), error)))
    }
  },
  {
    next: createActionCreator('GET_CONTAINERS_AV_PCT_MNR_REQUEST'),
    complete: createActionCreator('GET_CONTAINERS_AV_PCT_MNR_SUCCESS',
      resolve => (avPctMnr: number, startDate: string, endDate: string, activeOnly: string) => resolve({ avPctMnr, startDate, endDate, activeOnly }),
    ),
    error: createActionCreator('GET_CONTAINERS_AV_PCT_MNR_ERROR',
      resolve => error => resolve(error),
    ),
  })

// STATUS COUNTS
export const listKpiContainersStatusCounts = Object.assign(
  (requestParameters: {startDate: Date, endDate: Date}): ThunkResult<Promise<void | { type: 'GET_KPI_STATUS_COUNT_SUCCESS'; payload: {statusCounts: any} }>> => {
    return async (dispatch) => {
      dispatch(listKpiContainersStatusCounts.next())

      return await new KpiApi(getConfiguration())
        .getKpiStatuscounts({ startDate: formatDate(requestParameters.startDate), endDate: formatDate(requestParameters.endDate) })
        .then((response: any) => dispatch(listKpiContainersStatusCounts.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, listKpiContainersStatusCounts.error(error), error)))
    }
  },
  {
    next: createActionCreator('GET_KPI_STATUS_COUNT_REQUEST'),
    complete: createActionCreator('GET_KPI_STATUS_COUNT_SUCCESS',
      resolve => (statusCounts: any) => resolve({ statusCounts }),
    ),
    error: createActionCreator('GET_KPI_STATUS_COUNT_ERROR',
      resolve => error => resolve(error),
    ),
  })

// TOTAL FOR CONTAINER STATUS COUNTS
export const listKpiContainersTotalStatCounts = Object.assign(
  (requestParameters: {startDate: Date, endDate: Date}): ThunkResult<Promise<void | { type: 'GET_KPI_TOTAL_STATUS_COUNT_SUCCESS'; payload: {totalAv: any} }>> => {
    return async (dispatch) => {
      dispatch(listKpiContainersTotalStatCounts.next())

      return await new KpiApi(getConfiguration())
        .getKpiTotalav({ startDate: formatDate(requestParameters.startDate), endDate: formatDate(requestParameters.endDate) })
        .then((response: any) => dispatch(listKpiContainersTotalStatCounts.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, listKpiContainersTotalStatCounts.error(error), error)))
    }
  },
  {
    next: createActionCreator('GET_KPI_TOTAL_STATUS_COUNT_REQUEST'),
    complete: createActionCreator('GET_KPI_TOTAL_STATUS_COUNT_SUCCESS',
      resolve => (totalAv: any) => resolve({ totalAv }),
    ),
    error: createActionCreator('GET_KPI_TOTAL_STATUS_COUNT_ERROR',
      resolve => error => resolve(error),
    ),
  })

// AVAILABLE FOR CONTAINER STATUS COUNTS
export const listKpiContainersAvailStatCounts = Object.assign(
  (requestParameters: {startDate: Date, endDate: Date, nBefore?: number, nAfter?: number}): ThunkResult<Promise<void | { type: 'GET_KPI_AV_STATUS_COUNT_SUCCESS'; payload: string[][] }>> => {
    return async (dispatch) => {
      dispatch(listKpiContainersAvailStatCounts.next())

      return await new KpiApi(getConfiguration())
        .getKpiAvailablebins({ startDate: formatDate(requestParameters.startDate), endDate: formatDate(requestParameters.endDate), nBefore: 0, nAfter: 0 })
        .then((response: string[][]) => dispatch(listKpiContainersAvailStatCounts.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, listKpiContainersAvailStatCounts.error(error), error)))
    }
  },
  {
    next: createActionCreator('GET_KPI_AV_STATUS_COUNT_REQUEST'),
    complete: createActionCreator('GET_KPI_AV_STATUS_COUNT_SUCCESS',
      resolve => (avail: string[][]) => resolve(avail),
    ),
    error: createActionCreator('GET_KPI_AV_STATUS_COUNT_ERROR',
      resolve => error => resolve(error),
    ),
  })

// IDLE COST
export const listKpiIdleCost = Object.assign(
  (requestParameters: {startDate: string, endDate: string}): ThunkResult<Promise<void | { type: 'GET_KPI_IDLE_COST_SUCCESS'; payload: {idleCost: string[][], startDate: string, endDate: string} }>> => {
    return async (dispatch) => {
      dispatch(listKpiIdleCost.next())

      // return await new KpiApi(getConfiguration())
      //   .getKpiGetidlecost(requestParameters)
      //   .then((response: string[][]) => dispatch(listKpiIdleCost.complete(response, requestParameters.startDate, requestParameters.endDate)))
      //   .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, listKpiIdleCost.error(error), error)))
    }
  },
  {
    next: createActionCreator('GET_KPI_IDLE_COST_REQUEST'),
    complete: createActionCreator('GET_KPI_IDLE_COST_SUCCESS',
      resolve => (idleCost: string[][], startDate: string, endDate: string) => resolve({ idleCost, startDate, endDate }),
    ),
    error: createActionCreator('GET_KPI_IDLE_COST_ERROR',
      resolve => error => resolve(error),
    ),
  })

// ALLOCATED DAYS
export const listKpiAllocatedDays = Object.assign(
  (requestParameters: {startDate: Date, endDate: Date, nBefore?: number, nAfter?: number}): ThunkResult<Promise<void | { type: 'GET_KPI_ALLOC_DAYS_SUCCESS'; payload: string[][] }>> => {
    return async (dispatch) => {
      dispatch(listKpiAllocatedDays.next())

      return await new KpiApi(getConfiguration())
        .getKpiGetallocateddays({ startDate: formatDate(requestParameters.startDate), endDate: formatDate(requestParameters.endDate), nBefore: requestParameters.nBefore, nAfter: requestParameters.nAfter })
        .then((response: string[][]) => dispatch(listKpiAllocatedDays.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, listKpiAllocatedDays.error(error), error)))
    }
  },
  {
    next: createActionCreator('GET_KPI_ALLOC_DAYS_REQUEST'),
    complete: createActionCreator('GET_KPI_ALLOC_DAYS_SUCCESS',
      resolve => (allocDays: string[][]) => resolve(allocDays),
    ),
    error: createActionCreator('GET_KPI_ALLOC_DAYS_ERROR',
      resolve => error => resolve(error),
    ),
  })

// IDLE DAYS
export const listKpiIdleDays = Object.assign(
  (requestParameters: {startDate: Date, endDate: Date, nBefore?: number, nAfter?: number}): ThunkResult<Promise<void | { type: 'GET_KPI_IDLE_DAYS_SUCCESS'; payload: string[][] }>> => {
    return async (dispatch) => {
      dispatch(listKpiIdleDays.next())

      return await new KpiApi(getConfiguration())
        .getKpiGetidledays({ startDate: formatDate(requestParameters.startDate), endDate: formatDate(requestParameters.endDate) })
        .then((response: string[][]) => dispatch(listKpiIdleDays.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, listKpiIdleDays.error(error), error)))
    }
  },
  {
    next: createActionCreator('GET_KPI_IDLE_DAYS_REQUEST'),
    complete: createActionCreator('GET_KPI_IDLE_DAYS_SUCCESS',
      resolve => (idleDays: string[][]) => resolve(idleDays),
    ),
    error: createActionCreator('GET_KPI_IDLE_DAYS_ERROR',
      resolve => error => resolve(error),
    ),
  })

// ORDERS
// ORDER STATUS COUNTS
export const listKpiOrderStatusCounts = Object.assign(
  (requestParameters: {startDate: Date, endDate: Date}): ThunkResult<Promise<void | { type: 'GET_KPI_ORDER_STATUS_COUNT_SUCCESS'; payload: {statusCounts: any} }>> => {
    return async (dispatch) => {
      dispatch(listKpiOrderStatusCounts.next())

      return await new KpiApi(getConfiguration())
        .getKpiOrderstatuscounts({ startDate: formatDate(requestParameters.startDate), endDate: formatDate(requestParameters.endDate) })
        .then((response: any) => dispatch(listKpiOrderStatusCounts.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, listKpiOrderStatusCounts.error(error), error)))
    }
  },
  {
    next: createActionCreator('GET_KPI_ORDER_STATUS_COUNT_REQUEST'),
    complete: createActionCreator('GET_KPI_ORDER_STATUS_COUNT_SUCCESS',
      resolve => (statusCounts: any) => resolve({ statusCounts }),
    ),
    error: createActionCreator('GET_KPI_ORDER_STATUS_COUNT_ERROR',
      resolve => error => resolve(error),
    ),
  })

// NUM OF ORDERS PER DAY
export const listKpiOrderStartsTimeseries = Object.assign(
  (requestParameters: {startDate: string, endDate: string}): ThunkResult<Promise<void | { type: 'GET_KPI_ORDER_STARTS_TIMESERIES_SUCCESS'; payload: {orderStartsTimeseries: string[][], startDate: string, endDate: string} }>> => {
    return async (dispatch) => {
      dispatch(listKpiOrderStartsTimeseries.next())

      return await new KpiApi(getConfiguration())
        .getKpiOrderstartstimeseries(requestParameters)
        .then((response: string[][]) => dispatch(listKpiOrderStartsTimeseries.complete(response, requestParameters.startDate, requestParameters.endDate)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, listKpiOrderStartsTimeseries.error(error), error)))
    }
  },
  {
    next: createActionCreator('GET_KPI_ORDER_STARTS_TIMESERIES_REQUEST'),
    complete: createActionCreator('GET_KPI_ORDER_STARTS_TIMESERIES_SUCCESS',
      resolve => (orderStartsTimeseries: string[][], startDate: string, endDate: string) => resolve({ orderStartsTimeseries, startDate, endDate }),
    ),
    error: createActionCreator('GET_KPI_ORDER_STARTS_TIMESERIES_ERROR',
      resolve => error => resolve(error),
    ),
  })

// ORDER STARTS PER BINS
export const listKpiOrderStartsBins = Object.assign(
  (requestParameters: {startDate: Date, endDate: Date}): ThunkResult<Promise<void | { type: 'GET_KPI_ORDER_STARTS_BIN_SUCCESS'; payload: string[][] }>> => {
    return async (dispatch) => {
      dispatch(listKpiOrderStartsBins.next())

      return await new KpiApi(getConfiguration())
        .getKpiOrderstartsbins({ startDate: formatDate(requestParameters.startDate), endDate: formatDate(requestParameters.endDate) })
        .then((response: string[][]) => dispatch(listKpiOrderStartsBins.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, listKpiOrderStartsBins.error(error), error)))
    }
  },
  {
    next: createActionCreator('GET_KPI_ORDER_STARTS_BIN_REQUEST'),
    complete: createActionCreator('GET_KPI_ORDER_STARTS_BIN_SUCCESS',
      resolve => (orderStartsBins: string[][]) => resolve(orderStartsBins),
    ),
    error: createActionCreator('GET_KPI_ORDER_STARTS_BIN_ERROR',
      resolve => error => resolve(error),
    ),
  })

// ORDER STARTS 
export const listKpiOrderStarts = Object.assign(
  (requestParameters: {startDate: string, endDate: string}): ThunkResult<Promise<void | { type: 'GET_KPI_ORDER_STARTS_SUCCESS'; payload: {orderStarts: number, startDate: string, endDate: string} }>> => {
    return async (dispatch) => {
      dispatch(listKpiOrderStarts.next())

      return await new KpiApi(getConfiguration())
        .getKpiOrderstarts(requestParameters)
        .then((response: any) => {
          dispatch(listKpiOrderStarts.complete(response.orderStarts, requestParameters.startDate, requestParameters.endDate))
        })
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, listKpiOrderStarts.error(error), error)))
    }
  },
  {
    next: createActionCreator('GET_KPI_ORDER_STARTS_REQUEST'),
    complete: createActionCreator('GET_KPI_ORDER_STARTS_SUCCESS',
      resolve => (orderStarts: number, startDate: string, endDate: string) => resolve({ orderStarts, startDate, endDate }),
    ),
    error: createActionCreator('GET_KPI_ORDER_STARTS_ERROR',
      resolve => error => resolve(error),
    ),
  })

// ORDER ENDS TIMESERIES
export const listKpiOrderEndstimeseries = Object.assign(
  (requestParameters: {startDate: string, endDate: string}): ThunkResult<Promise<void | { type: 'GET_KPI_ORDER_ENDS_TIMESERIES_SUCCESS'; payload: {orderEndsTimeseries: string[][], startDate: string, endDate: string} }>> => {
    return async (dispatch) => {
      dispatch(listKpiOrderEndstimeseries.next())

      return await new KpiApi(getConfiguration())
        .getKpiOrderendstimeseries(requestParameters)
        .then((response: string[][]) => dispatch(listKpiOrderEndstimeseries.complete(response, requestParameters.startDate, requestParameters.endDate)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, listKpiOrderEndstimeseries.error(error), error)))
    }
  },
  {
    next: createActionCreator('GET_KPI_ORDER_ENDS_TIMESERIES_REQUEST'),
    complete: createActionCreator('GET_KPI_ORDER_ENDS_TIMESERIES_SUCCESS',
      resolve => (orderEndsTimeseries: string[][], startDate: string, endDate: string) => resolve({ orderEndsTimeseries, startDate, endDate }),
    ),
    error: createActionCreator('GET_KPI_ORDER_ENDS_TIMESERIES_ERROR',
      resolve => error => resolve(error),
    ),
  })

// ORDER ENDS PER BIN
export const listKpiOrderEndsBins = Object.assign(
  (requestParameters: {startDate: Date, endDate: Date}): ThunkResult<Promise<void | { type: 'GET_KPI_ORDER_ENDS_BINS_SUCCESS'; payload:string[][] }>> => {
    return async (dispatch) => {
      dispatch(listKpiOrderEndsBins.next())

      return await new KpiApi(getConfiguration())
        .getKpiOrderendsbins({ startDate: formatDate(requestParameters.startDate), endDate: formatDate(requestParameters.endDate) })
        .then((response: string[][]) => dispatch(listKpiOrderEndsBins.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, listKpiOrderEndsBins.error(error), error)))
    }
  },
  {
    next: createActionCreator('GET_KPI_ORDER_ENDS_BINS_REQUEST'),
    complete: createActionCreator('GET_KPI_ORDER_ENDS_BINS_SUCCESS',
      resolve => (orderEndsBins: string[][]) => resolve(orderEndsBins),
    ),
    error: createActionCreator('GET_KPI_ORDER_ENDS_BINS_ERROR',
      resolve => error => resolve(error),
    ),
  })

// ORDER ENDS
export const listKpiOrderEnds = Object.assign(
  (requestParameters: {startDate: string, endDate: string}): ThunkResult<Promise<void | { type: 'GET_KPI_ORDER_ENDS_SUCCESS'; payload: {orderEnds: number, startDate: string, endDate: string} }>> => {
    return async (dispatch) => {
      dispatch(listKpiOrderEnds.next())

      return await new KpiApi(getConfiguration())
        .getKpiOrderends(requestParameters)
        .then((response: any) => dispatch(listKpiOrderEnds.complete(response.orderEnds, requestParameters.startDate, requestParameters.endDate)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, listKpiOrderEnds.error(error), error)))
    }
  },
  {
    next: createActionCreator('GET_KPI_ORDER_ENDS_REQUEST'),
    complete: createActionCreator('GET_KPI_ORDER_ENDS_SUCCESS',
      resolve => (orderEnds: number, startDate: string, endDate: string) => resolve({ orderEnds, startDate, endDate }),
    ),
    error: createActionCreator('GET_KPI_ORDER_ENDS_ERROR',
      resolve => error => resolve(error),
    ),
  })

const formatDate = (val: Date) => format(val, 'yyyy-MM-dd')

// Total orders
export const listKpiOrderTotal = Object.assign(
  (requestParameters: {startDate: Date, endDate: Date}): ThunkResult<Promise<void | { type: 'GET_KPI_ORDER_TOTAL_SUCCESS'; payload: any[] }>> => {
    return async (dispatch) => {
      dispatch(listKpiOrderTotal.next())

      return await new KpiApi(getConfiguration())
        .getKpiTotalorderbins({ startDate: formatDate(requestParameters.startDate), endDate: formatDate(requestParameters.endDate) })
        .then((response: any) => dispatch(listKpiOrderTotal.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, listKpiOrderTotal.error(error), error)))
    }
  },
  {
    next: createActionCreator('GET_KPI_ORDER_TOTAL_REQUEST'),
    complete: createActionCreator('GET_KPI_ORDER_TOTAL_SUCCESS',
      resolve => (res: any[]) => resolve(res),
    ),
    error: createActionCreator('GET_KPI_ORDER_TOTAL_ERROR',
      resolve => error => resolve(error),
    ),
  })

// Ongoing orders -- order status counts
export const listKpiOngoingOrders = Object.assign(
  (requestParameters: {startDate: Date, endDate: Date}): ThunkResult<Promise<void | { type: 'GET_KPI_ONGOING_ORDERS_SUCCESS'; payload: any }>> => {
    return async (dispatch) => {
      dispatch(listKpiOngoingOrders.next())

      return await new KpiApi(getConfiguration())
        .getKpiGettotalordersbin({ startDate: formatDate(requestParameters.startDate), endDate: formatDate(requestParameters.endDate) })
        .then((response: any) => dispatch(listKpiOngoingOrders.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, listKpiOngoingOrders.error(error), error)))
    }
  },
  {
    next: createActionCreator('GET_KPI_ONGOING_ORDERS_REQUEST'),
    complete: createActionCreator('GET_KPI_ONGOING_ORDERS_SUCCESS',
      resolve => (res: any) => resolve({ res }),
    ),
    error: createActionCreator('GET_KPI_ONGOING_ORDERS_ERROR',
      resolve => error => resolve(error),
    ),
  })

// orders by customers
export const listKpiOrderByCustomer = Object.assign(
  (requestParameters: {startDate: Date, endDate: Date}): ThunkResult<Promise<void | { type: 'GET_KPI_ORDER_COSTUMER_SUCCESS'; payload: any[] }>> => {
    return async (dispatch) => {
      dispatch(listKpiOrderByCustomer.next())
      return await new KpiApi(getConfiguration())
        .getKpiOrdersbycustomer({ startDate: formatDate(requestParameters.startDate), endDate: formatDate(requestParameters.endDate) })
        .then((response: any) => dispatch(listKpiOrderByCustomer.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, listKpiOrderByCustomer.error(error), error)))
    }
  },
  {
    next: createActionCreator('GET_KPI_ORDER_COSTUMER_REQUEST'),
    complete: createActionCreator('GET_KPI_ORDER_COSTUMER_SUCCESS',
      resolve => (res: any[]) => resolve(res),
    ),
    error: createActionCreator('GET_KPI_ORDER_COSTUMER_ERROR',
      resolve => error => resolve(error),
    ),
  })

// Accepted and ready orders -- order status counts
export const listKpiAcceptedAndReady = Object.assign(
  (requestParameters: {startDate: Date, endDate: Date}): ThunkResult<Promise<void | { type: 'GET_KPI_ACCEPTED_ORDERS_SUCCESS'; payload: any }>> => {
    return async (dispatch) => {
      dispatch(listKpiAcceptedAndReady.next())

      return await new KpiApi(getConfiguration())
        .getKpiGettotalordersbin({ startDate: formatDate(requestParameters.startDate), endDate: formatDate(requestParameters.endDate) })
        .then((response: any) => dispatch(listKpiAcceptedAndReady.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, listKpiAcceptedAndReady.error(error), error)))
    }
  },
  {
    next: createActionCreator('GET_KPI_ACCEPTED_ORDERS_REQUEST'),
    complete: createActionCreator('GET_KPI_ACCEPTED_ORDERS_SUCCESS',
      resolve => (res: any) => resolve({ res }),
    ),
    error: createActionCreator('GET_KPI_ACCEPTED_ORDERS_ERROR',
      resolve => error => resolve(error),
    ),
  })

// ACCEPTED NOT READY ORDERS
export const listKpiOrdersAcceptedNotReady = Object.assign(
  (requestParameters: {startDate: Date, endDate: Date}): ThunkResult<Promise<void | { type: 'GET_KPI_ORDER_ACCEPTED_SUCCESS'; payload: string[][] }>> => {
    return async (dispatch) => {
      dispatch(listKpiOrdersAcceptedNotReady.next())

      return await new KpiApi(getConfiguration())
        .getKpiOrderacceptednotreadydailybins({ startDate: formatDate(requestParameters.startDate), endDate: formatDate(requestParameters.endDate) })
        .then((response: string[][]) => dispatch(listKpiOrdersAcceptedNotReady.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, listKpiOrdersAcceptedNotReady.error(error), error)))
    }
  },
  {
    next: createActionCreator('GET_KPI_ORDER_ACCEPTED_REQUEST'),
    complete: createActionCreator('GET_KPI_ORDER_ACCEPTED_SUCCESS',
      resolve => (res: string[][]) => resolve(res),
    ),
    error: createActionCreator('GET_KPI_ORDER_ACCEPTED_ERROR',
      resolve => error => resolve(error),
    ),
  })
