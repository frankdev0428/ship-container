import { createActionCreator } from 'deox'

import { ThunkResult } from '../../frameworks/types'
import { BoardsApi } from '../../apis-client/svc-boards-aeler'
import { BoardsApi as BoardsApiNexxiot } from '../../apis-client/svc-boards-nexxiot'
import { BoardsApi as BoardsApiKizy } from '../../apis-client/svc-boards-kizy'
import { BoardsApi as BoardsApiMost, GetBoardsRequest } from '../../apis-client/svc-boards-most'
import { getConfiguration, getConfiguration4, getConfiguration5, getConfigurationKizy, getConfigurationMost } from '../auth/keycloak'
import { dispatchErrorWithEffect, dispatchSuccessWithEffect } from '../../store/effects'
import { aelerApiFailure } from '../../frameworks/apiUtils'
import { DevicesApi, DeviceToContainerPairing } from '../../apis-client'

import { KizyBoard, AelerBoard, NexxiotBoard, Board, MostBoard } from './types'

export const listBoardsByEquipment = Object.assign(
  (equipmentId: string): ThunkResult<Promise<void | { type: 'GET_BOARD_BY_EQUIPMENT_SUCCESS'; payload: any }>> => {
    return async (dispatch) => {
      dispatch(listBoardsByEquipment.next())

      // return new BoardsApi(getConfiguration())
      //   .getEquipmentsEquipmentid({ equipmentId })
      //   .then((response) => dispatch(listBoardsByEquipment.complete(response)))
      //   .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, listBoardsByEquipment.error(error), error)))
    }
  },
  {
    next: createActionCreator('GET_BOARD_BY_EQUIPMENT_REQUEST'),
    complete: createActionCreator('GET_BOARD_BY_EQUIPMENT_SUCCESS',
      resolve => (Equipments: any) => resolve(Equipments),
    ),
    error: createActionCreator('GET_BOARD_BY_EQUIPMENT_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const createAelerBoard = Object.assign(
  (params: AelerBoard): ThunkResult<Promise<void | { type: 'ADD_AELER_BOARD_SUCCESS'; payload: AelerBoard }>> => {
    return async (dispatch) => {
      dispatch(createAelerBoard.next())

      return new BoardsApi(getConfiguration4())
        .postBoards({ body: params })
        .then((response) => dispatch(createAelerBoard.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, createAelerBoard.error(error), error)))
    }
  },
  {
    next: createActionCreator('ADD_AELER_BOARD_REQUEST'),
    complete: createActionCreator('ADD_AELER_BOARD_SUCCESS',
      resolve => (obj: AelerBoard) => resolve(obj),
    ),
    error: createActionCreator('ADD_AELER_BOARD_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const listAelerBoards = Object.assign(
  (): ThunkResult<Promise<void | { type: 'LIST_AELER_BOARDS_SUCCESS'; payload: AelerBoard[] }>> => {
    return async (dispatch) => {
      dispatch(listAelerBoards.next())

      return new BoardsApi(getConfiguration4())
        .getBoards()
        .then((response) => dispatch(listAelerBoards.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, listAelerBoards.error(error), error)))
    }
  },
  {
    next: createActionCreator('LIST_AELER_BOARDS_REQUEST'),
    complete: createActionCreator('LIST_AELER_BOARDS_SUCCESS',
      resolve => (obj: AelerBoard[]) => resolve(obj),
    ),
    error: createActionCreator('LIST_AELER_BOARDS_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const listMostBoards = Object.assign(
  (requestParameters: GetBoardsRequest): ThunkResult<Promise<void | { type: 'LIST_MOST_BOARDS_SUCCESS'; payload: MostBoard[] }>> => {
    return async (dispatch) => {
      dispatch(listMostBoards.next())

      return await new BoardsApiMost(getConfigurationMost())
        .getBoards(requestParameters)
        .then((response) => dispatch(listMostBoards.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, listMostBoards.error(error), error)))
    }
  },
  {
    next: createActionCreator('LIST_MOST_BOARDS_REQUEST'),
    complete: createActionCreator('LIST_MOST_BOARDS_SUCCESS',
      resolve => (obj: MostBoard[]) => resolve(obj),
    ),
    error: createActionCreator('LIST_MOST_BOARDS_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const listNexxiotBoards = Object.assign(
  (): ThunkResult<Promise<void | { type: 'LIST_NEXXIOT_BOARDS_SUCCESS'; payload: NexxiotBoard[] }>> => {
    return async (dispatch) => {
      dispatch(listNexxiotBoards.next())

      return new BoardsApiNexxiot(getConfiguration5())
        .getBoards({})
        .then((response) => dispatch(listNexxiotBoards.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, listNexxiotBoards.error(error), error)))
    }
  },
  {
    next: createActionCreator('LIST_NEXXIOT_BOARDS_REQUEST'),
    complete: createActionCreator('LIST_NEXXIOT_BOARDS_SUCCESS',
      resolve => (obj: NexxiotBoard[]) => resolve(obj),
    ),
    error: createActionCreator('LIST_NEXXIOT_BOARDS_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const listKizyBoards = Object.assign(
  (): ThunkResult<Promise<void | { type: 'LIST_KIZY_BOARDS_SUCCESS'; payload: KizyBoard[] }>> => {
    return async (dispatch) => {
      dispatch(listKizyBoards.next())

      return await new BoardsApiKizy(getConfigurationKizy())
        .getBoards({})
        .then((response) => dispatch(listKizyBoards.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, listKizyBoards.error(error), error)))
    }
  },
  {
    next: createActionCreator('LIST_KIZY_BOARDS_REQUEST'),
    complete: createActionCreator('LIST_KIZY_BOARDS_SUCCESS',
      resolve => (obj: KizyBoard[]) => resolve(obj),
    ),
    error: createActionCreator('LIST_KIZY_BOARDS_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const createKizyBoard = Object.assign(
  (params: KizyBoard): ThunkResult<Promise<void | { type: 'CREATE_KIZY_BOARD_SUCCESS'; payload: KizyBoard }>> => {
    return async (dispatch) => {
      dispatch(createKizyBoard.next()) // passing params for console logging purposes only
      // return new BoardsApiKizy(getConfigurationKizy())
      //   .postBoards({ body: params })
      //   .then((response) => dispatch(createKizyBoard.complete(response)))
      //   .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, createKizyBoard.error(error), error)))
    }
  },
  {
    next: createActionCreator('CREATE_KIZY_BOARD_REQUEST'),
    complete: createActionCreator('CREATE_KIZY_BOARD_SUCCESS',
      resolve => (obj: KizyBoard) => resolve(obj),
    ),
    error: createActionCreator('CREATE_KIZY_BOARD_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const getBoardContainerId = Object.assign(
  (boardIds: string[], source: 'aeler' | 'nexxiot' | 'kizy' | 'most'): ThunkResult<Promise<void | { type: 'GET_BOARDS_CONTAINER_IDS_SUCCESS'; payload: { pairings: DeviceToContainerPairing[], source: string }}>> => {
    return async (dispatch) => {
      dispatch(getBoardContainerId.next())
      return new DevicesApi(getConfiguration())
        .getDevicesContainers({ deviceIds: boardIds, type: source })
        .then((response) => dispatch(getBoardContainerId.complete({ pairings: response, source })))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, getBoardContainerId.error(error), error)))
    }
  },
  {
    next: createActionCreator('GET_BOARDS_CONTAINER_IDS_REQUEST'),
    complete: createActionCreator('GET_BOARDS_CONTAINER_IDS_SUCCESS',
      resolve => (pairings: { pairings: DeviceToContainerPairing[], source: string }) => resolve(pairings),
    ),
    error: createActionCreator('GET_BOARDS_CONTAINER_IDS_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const modifyAelerBoard = Object.assign(
  (boardId: string, payload: Board): ThunkResult<Promise<void | { type: 'PATCH_AELER_BOARD_SUCCESS'; payload: Board }>> => {
    return async (dispatch) => {
      dispatch(modifyAelerBoard.next())

      // return new BoardsApi(getConfiguration4())
      //   .patchFacilitiesFacilityid({ boardId, body: payload })
      return mockFunc(boardId, payload)
        .then((response) => dispatchSuccessWithEffect(dispatch, modifyAelerBoard.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, modifyAelerBoard.error(error), error)))
    }
  },
  {
    next: createActionCreator('PATCH_AELER_BOARD_REQUEST'),
    complete: createActionCreator('PATCH_AELER_BOARD_SUCCESS',
      resolve => (res: Board) => resolve(res),
    ),
    error: createActionCreator('PATCH_AELER_BOARD_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const archiveAelerBoard = Object.assign(
  (boardId: string): ThunkResult<Promise<void | { type: 'DELETE_BOARD_SUCCESS'; payload: {boardId: string} }>> => {
    return async (dispatch) => {
      dispatch(archiveAelerBoard.next())

      return new BoardsApi(getConfiguration4())
        .deleteBoards({ boardId })
        .then((response) => dispatchSuccessWithEffect(dispatch, archiveAelerBoard.complete({ boardId: boardId }), ['Board archived']))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, archiveAelerBoard.error(error), error)))
    }
  },
  {
    next: createActionCreator('DELETE_BOARD_REQUEST'),
    complete: createActionCreator('DELETE_BOARD_SUCCESS',
      resolve => (payload: {boardId: string}) => resolve(payload),
    ),
    error: createActionCreator('DELETE_BOARD_ERROR',
      resolve => error => resolve(error),
    ),
  })

const mockAelerBoard = {
  provider: 'aeler',
  boardId: 'NEW_AELER_BOARD',
}

const mockFunc = async (boardId: string, payload:Board):Promise<Board> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(mockAelerBoard), 200)
  })
}
