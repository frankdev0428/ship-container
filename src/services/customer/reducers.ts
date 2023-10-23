import { createReducer } from 'deox'

import Config from '../../config.json'
import { PublicCompanyFromJSON } from '../../apis-client/svc-customers'

import { listCompanies } from './actions'
import * as t from './types'
import mockCompanies from './mock-companies.json'

const initialState: t.CompanyReducerState = {
  companies: Config.FF_ENABLE_MOCK !== undefined && Config.FF_ENABLE_MOCK === 'true' ? mockCompanies.map(PublicCompanyFromJSON) : [],
  loadingStatus: false,
}

export const companyReducers = createReducer(initialState, handleAction => [
  // List
  handleAction(listCompanies.next, (state) => ({
    ...state,
    loadingStatus: true,
  })),
  handleAction(listCompanies.complete, (state: t.CompanyReducerState, { payload }) => ({
    ...state,
    companies: payload,
    loadingStatus: false,
  })),
  handleAction(listCompanies.error, (state) => ({
    ...state,
    loadingStatus: false,
  })),
])
