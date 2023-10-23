import { createActionCreator } from 'deox'

import {
  CustomersApi,
  DepotsApi,
  GetCustomersRequest,
  GetDepotsRequest,
} from '../../apis-client'
import { ThunkResult } from '../../frameworks/types'
import { aelerApiFailure } from '../../frameworks/apiUtils'
import { getConfiguration } from '../auth/keycloak'
import { dispatchErrorWithEffect } from '../../store/effects'

import { FakeCustomer } from './types'

// FIXME: REPLACE ContainerStatus WITH ContainerStatus[]
export const getAutocompleteCustomers = Object.assign(
  (params: GetCustomersRequest): ThunkResult<Promise<void | { type: 'POST_AUTOCOMPLETE_CUSTOMER_SUCCESS'; payload: FakeCustomer[] }>> => {
    return async (dispatch) => {
      dispatch(getAutocompleteCustomers.next())

      return new CustomersApi(getConfiguration())
        .getCustomers(params)
        .then((response) => dispatch(getAutocompleteCustomers.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, getAutocompleteCustomers.error(error), error)))
    }
  },
  {
    next: createActionCreator('POST_AUTOCOMPLETE_CUSTOMER_REQUEST'),
    complete: createActionCreator('POST_AUTOCOMPLETE_CUSTOMER_SUCCESS',
      resolve => (containers: FakeCustomer[]) => resolve(containers),
    ),
    error: createActionCreator('POST_AUTOCOMPLETE_CUSTOMER_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const getAutocompleteDepots = Object.assign(
  (params: GetDepotsRequest): ThunkResult<Promise<void | { type: 'POST_AUTOCOMPLETE_DEPOT_SUCCESS'; payload: string[] }>> => {
    return async (dispatch) => {
      dispatch(getAutocompleteDepots.next())

      return new DepotsApi(getConfiguration())
        .getDepots(params)
        .then((response) => dispatch(getAutocompleteDepots.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, getAutocompleteDepots.error(error), error)))
    }
  },
  {
    next: createActionCreator('POST_AUTOCOMPLETE_DEPOT_REQUEST'),
    complete: createActionCreator('POST_AUTOCOMPLETE_DEPOT_SUCCESS',
      resolve => (containers: string[]) => resolve(containers),
    ),
    error: createActionCreator('POST_AUTOCOMPLETE_DEPOT_ERROR',
      resolve => error => resolve(error),
    ),
  })
