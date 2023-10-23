import { createActionCreator } from 'deox'

import {
  CompaniesApi, GetCompaniesRequest,
} from '../../apis-client/svc-customers'
import { ThunkResult } from '../../frameworks/types'
import { aelerApiFailure } from '../../frameworks/apiUtils'
import { getConfiguration2 } from '../auth/keycloak'
import { dispatchErrorWithEffect } from '../../store/effects'

import { Company } from './types'

export const listCompanies = Object.assign(
  (params: GetCompaniesRequest): ThunkResult<Promise<void | { type: 'LIST_COMPANIES_SUCCESS'; payload: Company[] }>> => {
    return async (dispatch) => {
      dispatch(listCompanies.next())

      return new CompaniesApi(getConfiguration2() as any)
        .getCompanies(params)
        .then((response) => dispatch(listCompanies.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, listCompanies.error(error), error)))
    }
  },
  {
    next: createActionCreator('LIST_COMPANIES_REQUEST'),
    complete: createActionCreator('LIST_COMPANIES_SUCCESS',
      resolve => (leases: Company[]) => resolve(leases),
    ),
    error: createActionCreator('LIST_COMPANIES_ERROR',
      resolve => error => resolve(error),
    ),
  })
