import { createActionCreator } from 'deox'

import {
  EquipmentsApi,
  EquipmentMoveInput,
} from '../../apis-client'
import { ThunkResult } from '../../frameworks/types'
import { aelerApiFailure } from '../../frameworks/apiUtils'
import { getConfiguration } from '../auth/keycloak'
import { dispatchErrorWithEffect, dispatchSuccessWithEffect } from '../../store/effects'

import { Move } from './types'

export const createMove = Object.assign(
  (equipmentId: string, params: EquipmentMoveInput): ThunkResult<Promise<void | { type: 'CREATE_EQUIPMENT_MOVE_SUCCESS'; payload: {equipmentId: string, move: Move} }>> => {
    return async (dispatch) => {
      dispatch(createMove.next())

      await new EquipmentsApi(getConfiguration())
        .postEquipmentsEquipmentidMove({ equipmentId, body: params })
        .then((response) => dispatch(createMove.complete(equipmentId, response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, createMove.error(error), error)))
    }
  },
  {
    next: createActionCreator('CREATE_EQUIPMENT_MOVE_REQUEST'),
    complete: createActionCreator('CREATE_EQUIPMENT_MOVE_SUCCESS',
      resolve => (equipmentId: string, move: Move) => resolve({ equipmentId, move }),
    ),
    error: createActionCreator('CREATE_EQUIPMENT_MOVE_ERROR',
      resolve => error => resolve(error),
    ),
  })

// export const createLeaseStatus = Object.assign(
//   (orderId: string, params: EquipmentLeaseStatusInput): ThunkResult<Promise<void | { type: 'POST_LEASE_STATUS_SUCCESS'; payload: LeaseStatus }>> => {
//     return async (dispatch) => {
//       dispatch(createLeaseStatus.next())

//       return new LeasesApi(getConfiguration())
//         .postLeasesOrderidStatus({
//           orderId, body: params,
//         })
//         .then((response) => dispatch(createLeaseStatus.complete(response)))
//         .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, createLeaseStatus.error(error), error)))
//     }
//   },
//   {
//     next: createActionCreator('POST_LEASE_STATUS_REQUEST'),
//     complete: createActionCreator('POST_LEASE_STATUS_SUCCESS',
//       resolve => (status: LeaseStatus) => resolve(status),
//     ),
//     error: createActionCreator('POST_LEASE_STATUS_ERROR',
//       resolve => error => resolve(error),
//     ),
//   })

export const listMoves = Object.assign(
  (equipmentId: string): ThunkResult<Promise<void | { type: 'GET_EQUIPMENT_MOVES_SUCCESS'; payload: {equipmentId: string, moves: Move[]} }>> => {
    return async (dispatch) => {
      dispatch(listMoves.next())

      return new EquipmentsApi(getConfiguration())
        .getEquipmentsEquipmentidMoves({ equipmentId })
        .then((response) => dispatch(listMoves.complete(equipmentId, response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, listMoves.error(error), error)))
    }
  },
  {
    next: createActionCreator('GET_EQUIPMENT_MOVES_REQUEST'),
    complete: createActionCreator('GET_EQUIPMENT_MOVES_SUCCESS',
      resolve => (equipmentId: string, moves: Move[]) => resolve({ equipmentId, moves }),
    ),
    error: createActionCreator('GET_EQUIPMENT_MOVES_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const updateMove = Object.assign(
  (moveId: string, equipmentId: string, params: EquipmentMoveInput): ThunkResult<Promise<void | { type: 'UPDATE_EQUIPMENT_MOVE_SUCCESS'; payload: {equipmentId: string, moveId: string, move: Move} }>> => {
    return async (dispatch) => {
      dispatch(updateMove.next())

      await new EquipmentsApi(getConfiguration())
        .patchEquipmentsEquipmentidMoveMoveid({ moveId, equipmentId, body: params })
        .then((response) => dispatchSuccessWithEffect(dispatch, dispatch(updateMove.complete(equipmentId, moveId, response)), ['Move updated successfully']))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, updateMove.error(error), error)))
    }
  },
  {
    next: createActionCreator('UPDATE_EQUIPMENT_MOVE_REQUEST'),
    complete: createActionCreator('UPDATE_EQUIPMENT_MOVE_SUCCESS',
      resolve => (equipmentId: string, moveId: string, move: Move) => resolve({ equipmentId, moveId, move }),
    ),
    error: createActionCreator('UPDATE_EQUIPMENT_MOVE_ERROR',
      resolve => error => resolve(error),
    ),
  })
