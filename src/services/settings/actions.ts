import { createActionCreator } from 'deox'

import { ThunkResult } from '../../frameworks/types'

export const setShouldUseBackend = Object.assign(
  (value: boolean): ThunkResult<Promise<void | { type: 'SET_SHOULD_USE_BACKEND_SUCCESS', payload: boolean }>> => {
    return async (dispatch) => {
      dispatch(setShouldUseBackend.next())

      return dispatch(setShouldUseBackend.complete(value))
    }
  },
  {
    next: createActionCreator('SET_SHOULD_USE_BACKEND_REQUEST'),
    complete: createActionCreator('SET_SHOULD_USE_BACKEND_SUCCESS',
      resolve => (value: boolean) => resolve(value),
    ),
    error: createActionCreator('SET_SHOULD_USE_BACKEND_ERROR',
      resolve => error => resolve(error),
    ),
  })
