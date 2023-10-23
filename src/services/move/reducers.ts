import { createReducer } from 'deox'

import { createMove, listMoves, updateMove } from './actions'
import * as t from './types'

const initialState: t.MoveReducerState = {
  moves: [],
  loadingStatus: false,
}

export const moveReducers = createReducer(initialState, handleAction => [
  // Create Lease
  handleAction(createMove.next, (state) => ({
    ...state,
  })),
  handleAction(createMove.complete, (state: t.MoveReducerState, { payload }) => ({
    ...state,
    moves: state.moves.map(m => m.equipmentId).includes(payload.equipmentId)
      ? state.moves.map(m => m.equipmentId === payload.equipmentId
        ? {
            ...m,
            moves: [
              ...m.moves,
              payload.move,
            ],
          }
        : m)
      : [...state.moves, { equipmentId: payload.equipmentId, moves: [payload.move] }],
  })),
  handleAction(createMove.error, (state) => ({
    ...state,
  })),
  // // Create Lease Status
  // handleAction(createLeaseStatus.next, (state) => ({
  //   ...state,
  // })),
  // handleAction(createLeaseStatus.complete, (state: t.LeaseReducerState, { payload }) => ({
  //   ...state,
  //   moves: state.moves.map(lease => {
  //     return lease.orderId === payload.orderId
  //       ? {
  //           ...lease,
  //           equipmentmovestatuses: [payload],
  //         }
  //       : lease
  //   }),
  //   // leaseStatus: state.moves.filter(cs => cs.equipmentId === payload.equipmentId ? payload : cs),
  // })),
  // handleAction(createLeaseStatus.error, (state) => ({
  //   ...state,
  // })),
  // List
  handleAction(listMoves.next, (state) => ({
    ...state,
    loadingStatus: true,
  })),
  handleAction(listMoves.complete, (state: t.MoveReducerState, { payload }) => ({
    ...state,
    loadingStatus: false,
    moves: state.moves.map(m => m.equipmentId).includes(payload.equipmentId)
      ? state.moves.map(m => m.equipmentId === payload.equipmentId
        ? {
            ...m,
            moves: payload.moves,
          }
        : m)
      : [...state.moves, { equipmentId: payload.equipmentId, moves: payload.moves }],
  })),
  handleAction(listMoves.error, (state) => ({
    ...state,
    loadingStatus: false,
  })),
  // Update
  handleAction(updateMove.next, (state) => ({
    ...state,
  })),
  handleAction(updateMove.complete, (state: t.MoveReducerState, { payload }) => ({
    ...state,
    moves: state.moves.map(m => m.equipmentId === payload.equipmentId
      ? {
          ...m,
          moves: m.moves.map(m2 => m2.moveId === payload.moveId ? payload.move : m2),
        }
      : m),
  })),
  handleAction(updateMove.error, (state) => ({
    ...state,
  })),
])
