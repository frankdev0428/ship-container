import { createReducer } from 'deox'

import { addMoveCost, addStorageRate, getLeaseRates, getMoveCosts, getStorageRates, addLeaseRate, addCost, getCosts, updateCost, removeCost } from './actions'
import * as t from './types'

const initialState: t.FinancialsReducerState = {
  storage: [],
  move: [],
  lease: [],
  loadingStatus: false,
  costs: [],
}

export const financialsReducers = createReducer(initialState, handleAction => [
  // List
  handleAction(getLeaseRates.next, (state) => ({
    ...state,
    loadingStatus: true,
  })),
  handleAction(getLeaseRates.complete, (state: t.FinancialsReducerState, { payload }) => ({
    ...state,
    lease: payload,
    loadingStatus: false,
  })),
  handleAction(getLeaseRates.error, (state) => ({
    ...state,
    loadingStatus: false,
  })),
  // List
  handleAction(getStorageRates.next, (state) => ({
    ...state,
    loadingStatus: true,
  })),
  handleAction(getStorageRates.complete, (state: t.FinancialsReducerState, { payload }) => ({
    ...state,
    storage: payload,
    loadingStatus: false,
  })),
  handleAction(getStorageRates.error, (state) => ({
    ...state,
    loadingStatus: false,
  })),
  // List
  handleAction(getMoveCosts.next, (state) => ({
    ...state,
    loadingStatus: true,
  })),
  handleAction(getMoveCosts.complete, (state: t.FinancialsReducerState, { payload }) => ({
    ...state,
    move: payload,
    loadingStatus: false,
  })),
  handleAction(getMoveCosts.error, (state) => ({
    ...state,
    loadingStatus: false,
  })),
  // add move cost
  handleAction(addMoveCost.next, (state) => ({
    ...state,
  })),
  handleAction(addMoveCost.complete, (state: t.FinancialsReducerState, { payload }) => ({
    ...state,
    move: [...state.move, payload],
  })),
  handleAction(addMoveCost.error, (state) => ({
    ...state,
  })),
  // add storage rate
  handleAction(addStorageRate.next, (state) => ({
    ...state,
  })),
  handleAction(addStorageRate.complete, (state: t.FinancialsReducerState, { payload }) => ({
    ...state,
    storage: [...state.storage, payload],
  })),
  handleAction(addStorageRate.error, (state) => ({
    ...state,
  })),
  // addLeaseRate
  handleAction(addLeaseRate.next, (state) => ({
    ...state,
  })),
  handleAction(addLeaseRate.complete, (state: t.FinancialsReducerState, { payload }) => ({
    ...state,
    lease: [...state.lease, payload],
  })),
  handleAction(addLeaseRate.error, (state) => ({
    ...state,
  })),
  /** */
  // add
  handleAction(addCost.next, (state) => ({
    ...state,
  })),
  handleAction(addCost.complete, (state: t.FinancialsReducerState, { payload }) => ({
    ...state,
    costs: [...state.costs, payload],
  })),
  handleAction(addCost.error, (state) => ({
    ...state,
  })),
  // get
  handleAction(getCosts.next, (state) => ({
    ...state,
  })),
  handleAction(getCosts.complete, (state: t.FinancialsReducerState, { payload }) => ({
    ...state,
    costs: payload,
  })),
  handleAction(getCosts.error, (state) => ({
    ...state,
  })),
  // update
  handleAction(updateCost.next, (state) => ({
    ...state,
  })),
  handleAction(updateCost.complete, (state: t.FinancialsReducerState, { payload }) => ({
    ...state,
    costs: state.costs.map(e => e.costId === payload.costId ? payload : e),
  })),
  handleAction(updateCost.error, (state) => ({
    ...state,
  })),
  // remove
  handleAction(removeCost.next, (state) => ({
    ...state,
  })),
  handleAction(removeCost.complete, (state: t.FinancialsReducerState, { payload }) => ({
    ...state,
    costs: state.costs.filter(e => e.costId !== payload.costId),
  })),
  handleAction(removeCost.error, (state) => ({
    ...state,
  })),
])
