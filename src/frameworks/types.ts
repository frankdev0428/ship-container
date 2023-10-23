import { ThunkAction } from 'redux-thunk'
import { Action } from 'redux'

import { AppState } from '../store/index'

export type Coordinates = [number, number]

export type JSONObjectBool = {
  readonly [key: string]: boolean;
}

export type ThunkResult<R> = ThunkAction<R, AppState, null, Action<string>>
