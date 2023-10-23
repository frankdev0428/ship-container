import { Action } from 'deox'
import { ThunkDispatch } from 'redux-thunk'

// import { Failure } from '../apis-client'

import { clearSnackbar, showSuccessSnackbar, showError } from './error/actions'

import { AppState } from '.'

interface Failure {
    /**
     * Error messages
     * @type {Array<string>}
     * @memberof Failure
     */
    errors: Array<string>;
}

export const dispatchWithEffect = (dispatch: ThunkDispatch<AppState, null, Action<string>>, fct: any) => {
  dispatch(fct)
  dispatch(clearSnackbar())
}

export const dispatchSuccessWithEffect = (dispatch: ThunkDispatch<AppState, null, Action<string>>, fct: any, messages?: string[]) => {
  const a = dispatch(fct)
  dispatch(showSuccessSnackbar(messages || ['Success']))
  return a
}

export const dispatchErrorWithEffect = (dispatch: ThunkDispatch<AppState, null, Action<string>>, fct: any, error: Failure) => {
  dispatch(fct)
  dispatch(showError(error.errors))
}
