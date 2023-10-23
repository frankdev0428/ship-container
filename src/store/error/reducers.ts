import * as t from './types'

const initialState: t.ErrorsReducerState = {
  errorMessages: undefined,
  severity: 'error',
}

const errorReducer = (state = initialState, action: {type: string; errors: string[]}) => {
  switch (action.type) {
    case 'SNACKBAR_SUCCESS':
      return {
        ...state,
        errorMessages: action.errors,
        severity: 'success',
      }
    case 'SNACKBAR_ERROR':
      return {
        ...state,
        errorMessages: action.errors,
        severity: 'error',
      }
    case 'SNACKBAR_WARNING':
      return {
        ...state,
        errorMessages: action.errors,
        severity: 'warning',
      }
    case 'SNACKBAR_CLEAR':
      return {
        ...state,
        errorMessages: [],
      }
    default:
      return state
  }
}

export default errorReducer
