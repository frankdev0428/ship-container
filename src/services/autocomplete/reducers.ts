import { createReducer } from 'deox'

import { getAutocompleteCustomers, getAutocompleteDepots } from './actions'
import * as t from './types'

const initialState: t.AutocompleteReducerState = {
  customers: [],
  contractStatus: [],
  orderStatus: [],
  depots: [],
  loading: false,
}

export const autocompleteReducer = createReducer(initialState, handleAction => [
  // Autocomplete for Customers
  handleAction(getAutocompleteCustomers.next, (state) => ({
    ...state,
    loading: true,
  })),
  handleAction(getAutocompleteCustomers.complete, (state: t.AutocompleteReducerState, { payload }) => ({
    ...state,
    loading: false,
    customers: payload,
  })),
  handleAction(getAutocompleteCustomers.error, (state) => ({
    ...state,
    loading: false,
  })),
  // Autocomplete for Depots
  handleAction(getAutocompleteDepots.next, (state) => ({
    ...state,
    loading: true,
  })),
  handleAction(getAutocompleteDepots.complete, (state: t.AutocompleteReducerState, { payload }) => ({
    ...state,
    loading: false,
    depots: payload,
  })),
  handleAction(getAutocompleteDepots.error, (state) => ({
    ...state,
    loading: false,
  })),
])
