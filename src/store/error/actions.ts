import { createActionCreator } from 'deox'

import { MessageSeverity } from './types'

export const showSuccessSnackbar = (errors: string[]) => {
  return (dispatch: any) => {
    dispatch({ type: 'SNACKBAR_SUCCESS', errors })
  }
}

export const clearSnackbar = () => {
  return (dispatch: any) => {
    dispatch({ type: 'SNACKBAR_CLEAR' })
  }
}

export const showError = (errors: string[]) => {
  return (dispatch: any) => {
    dispatch({ type: 'SNACKBAR_ERROR', errors })
  }
}

export const showWarning = (errors: string[]) => {
  return (dispatch: any) => {
    dispatch({ type: 'SNACKBAR_WARNING', errors })
  }
}
