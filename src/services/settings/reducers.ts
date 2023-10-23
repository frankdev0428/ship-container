import { createReducer } from 'deox'

import { setShouldUseBackend } from './actions'
import * as t from './types'

const initialState: t.SettingsReducerState = {
  shouldUseBackend: false,
}

export const settingsReducers = createReducer(initialState, handleAction => [
  // Toggle BE computations
  handleAction(setShouldUseBackend.next, (state) => ({
    ...state,
  })),
  handleAction(setShouldUseBackend.complete, (state: t.SettingsReducerState, { payload }) => ({
    ...state,
    shouldUseBackend: payload,
  })),
  handleAction(setShouldUseBackend.error, (state) => ({
    ...state,
  })),
])
