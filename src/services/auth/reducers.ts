import { createReducer } from 'deox'

import { logout, login } from './actions'
import * as t from './types'

const initialState: t.AuthReducerState = {
  user: {
    authenticated: false,
  },
}

export const authReducers = createReducer(initialState, handleAction => [
  handleAction(logout.next, (state) => ({
    ...state,
  })),
  handleAction(logout.complete, (state: t.AuthReducerState) => ({
    ...state,
    user: {
      authenticated: false,
    },
  })),
  handleAction(logout.error, (state) => ({
    ...state,
  })),
  handleAction(login.next, (state) => ({
    ...state,
  })),
  handleAction(login.complete, (state: t.AuthReducerState, { payload }) => ({
    ...state,
    user: {
      ...payload,
      authenticated: true,
    },
  })),
  handleAction(login.error, (state) => ({
    ...state,
  })),
])
