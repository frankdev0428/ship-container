import { createActionCreator } from 'deox'

import { ThunkResult } from '../../frameworks/types'
import { aelerApiFailure } from '../../frameworks/apiUtils'
import { getConfiguration } from '../auth/keycloak'
import { dispatchErrorWithEffect } from '../../store/effects'
import { FinancialsApi, GetFinancialsLeaseRequest, GetFinancialsMoveRequest, GetFinancialsStorageRequest, MoveCostInput, StorageRateInput, LeaseRateInput, StatusCostInput } from '../../apis-client'

import { StatusCost, StorageRate, MoveCost, LeaseRate, CurrencyEnum } from './types'

export const getLeaseRates = Object.assign(
  (params: GetFinancialsLeaseRequest): ThunkResult<Promise<void | { type: 'LIST_LEASE_RATES_SUCCESS'; payload: LeaseRate[] }>> => {
    return async (dispatch) => {
      dispatch(getLeaseRates.next())

      return new FinancialsApi(getConfiguration())
        .getFinancialsLease(params)
        .then((response) => dispatch(getLeaseRates.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, getLeaseRates.error(error), error)))
    }
  },
  {
    next: createActionCreator('LIST_LEASE_RATES_REQUEST'),
    complete: createActionCreator('LIST_LEASE_RATES_SUCCESS',
      resolve => (obj: LeaseRate[]) => resolve(obj),
    ),
    error: createActionCreator('LIST_LEASE_RATES_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const getMoveCosts = Object.assign(
  (params: GetFinancialsMoveRequest): ThunkResult<Promise<void | { type: 'LIST_MOVE_COSTS_SUCCESS'; payload: MoveCost[] }>> => {
    return async (dispatch) => {
      dispatch(getMoveCosts.next())

      return new FinancialsApi(getConfiguration())
        .getFinancialsMove(params)
        .then((response) => dispatch(getMoveCosts.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, getMoveCosts.error(error), error)))
    }
  },
  {
    next: createActionCreator('LIST_MOVE_COSTS_REQUEST'),
    complete: createActionCreator('LIST_MOVE_COSTS_SUCCESS',
      resolve => (obj: MoveCost[]) => resolve(obj),
    ),
    error: createActionCreator('LIST_MOVE_COSTS_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const getStorageRates = Object.assign(
  (params: GetFinancialsStorageRequest): ThunkResult<Promise<void | { type: 'LIST_STORAGE_RATES_SUCCESS'; payload: StorageRate[] }>> => {
    return async (dispatch) => {
      dispatch(getStorageRates.next())

      return new FinancialsApi(getConfiguration())
        .getFinancialsStorage(params)
        .then((response) => dispatch(getStorageRates.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, getStorageRates.error(error), error)))
    }
  },
  {
    next: createActionCreator('LIST_STORAGE_RATES_REQUEST'),
    complete: createActionCreator('LIST_STORAGE_RATES_SUCCESS',
      resolve => (obj: StorageRate[]) => resolve(obj),
    ),
    error: createActionCreator('LIST_STORAGE_RATES_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const addMoveCost = Object.assign(
  (params: MoveCostInput): ThunkResult<Promise<void | { type: 'ADD_MOVE_COST_SUCCESS'; payload: MoveCost }>> => {
    return async (dispatch) => {
      dispatch(addMoveCost.next())

      return new FinancialsApi(getConfiguration())
        .postFinancialsMove({ body: params })
        .then((response) => dispatch(addMoveCost.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, addMoveCost.error(error), error)))
    }
  },
  {
    next: createActionCreator('ADD_MOVE_COST_REQUEST'),
    complete: createActionCreator('ADD_MOVE_COST_SUCCESS',
      resolve => (obj: MoveCost) => resolve(obj),
    ),
    error: createActionCreator('ADD_MOVE_COST_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const addStorageRate = Object.assign(
  (params: StorageRateInput): ThunkResult<Promise<void | { type: 'ADD_STORAGE_RATE_SUCCESS'; payload: StorageRate }>> => {
    return async (dispatch) => {
      dispatch(addStorageRate.next())

      return new FinancialsApi(getConfiguration())
        .postFinancialsStorage({ body: params })
        .then((response) => dispatch(addStorageRate.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, addStorageRate.error(error), error)))
    }
  },
  {
    next: createActionCreator('ADD_STORAGE_RATE_REQUEST'),
    complete: createActionCreator('ADD_STORAGE_RATE_SUCCESS',
      resolve => (obj: StorageRate) => resolve(obj),
    ),
    error: createActionCreator('ADD_STORAGE_RATE_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const addLeaseRate = Object.assign(
  (params: LeaseRateInput): ThunkResult<Promise<void | { type: 'ADD_LEASE_RATE_SUCCESS'; payload: LeaseRate }>> => {
    return async (dispatch) => {
      dispatch(addLeaseRate.next())

      return new FinancialsApi(getConfiguration())
        .postFinancialsLease({ body: params })
        .then((response) => dispatch(addLeaseRate.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, addLeaseRate.error(error), error)))
    }
  },
  {
    next: createActionCreator('ADD_LEASE_RATE_REQUEST'),
    complete: createActionCreator('ADD_LEASE_RATE_SUCCESS',
      resolve => (obj: LeaseRate) => resolve(obj),
    ),
    error: createActionCreator('ADD_LEASE_RATE_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const addCost = Object.assign(
  (params: Omit<StatusCostInput, 'currency'> & {currency: CurrencyEnum}): ThunkResult<Promise<void | { type: 'ADD_COST_SUCCESS'; payload: StatusCost }>> => {
    return async (dispatch) => {
      dispatch(addCost.next())

      return new FinancialsApi(getConfiguration())
        .postFinancialsCosts({ body: params as any })
        .then((response) => dispatch(addCost.complete(response as any)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, addCost.error(error), error)))
    }
  },
  {
    next: createActionCreator('ADD_COST_REQUEST'),
    complete: createActionCreator('ADD_COST_SUCCESS',
      resolve => (obj: StatusCost) => resolve(obj),
    ),
    error: createActionCreator('ADD_COST_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const updateCost = Object.assign(
  (costId: string, params: Omit<StatusCostInput, 'currency'> & {currency: CurrencyEnum}): ThunkResult<Promise<void | { type: 'UPDATE_COST_SUCCESS'; payload: StatusCost }>> => {
    return async (dispatch) => {
      dispatch(updateCost.next())

      return new FinancialsApi(getConfiguration())
        .patchFinancialsCostsCostid({ costId, body: params as any })
        .then((response) => dispatch(updateCost.complete(response as any)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, updateCost.error(error), error)))
    }
  },
  {
    next: createActionCreator('UPDATE_COST_REQUEST'),
    complete: createActionCreator('UPDATE_COST_SUCCESS',
      resolve => (obj: StatusCost) => resolve(obj),
    ),
    error: createActionCreator('UPDATE_COST_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const getCosts = Object.assign(
  (statusId: string): ThunkResult<Promise<void | { type: 'GET_COSTS_SUCCESS'; payload: StatusCost[] }>> => {
    return async (dispatch) => {
      dispatch(getCosts.next())

      return new FinancialsApi(getConfiguration())
        .getFinancialsCosts({ statusId })
        .then((response) => dispatch(getCosts.complete(response as any)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, getCosts.error(error), error)))
    }
  },
  {
    next: createActionCreator('GET_COSTS_REQUEST'),
    complete: createActionCreator('GET_COSTS_SUCCESS',
      resolve => (obj: StatusCost[]) => resolve(obj),
    ),
    error: createActionCreator('GET_COSTS_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const removeCost = Object.assign(
  (costId: string): ThunkResult<Promise<void | { type: 'REMOVE_COST_SUCCESS'; payload: {costId: string} }>> => {
    return async (dispatch) => {
      dispatch(removeCost.next())

      return new FinancialsApi(getConfiguration())
        .deleteFinancialsCostsCostid({ costId })
        .then((response) => dispatch(removeCost.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, removeCost.error(error), error)))
    }
  },
  {
    next: createActionCreator('REMOVE_COST_REQUEST'),
    complete: createActionCreator('REMOVE_COST_SUCCESS',
      resolve => (obj: {costId: string}) => resolve(obj),
    ),
    error: createActionCreator('REMOVE_COST_ERROR',
      resolve => error => resolve(error),
    ),
  })
