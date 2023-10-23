import { createReducer } from 'deox'

import { ExtendedBoardFromJSON as AelerBoardFromJSON } from '../../apis-client/svc-boards-aeler'
import { ExtendedBoardFromJSON as NexxiotBoardFromJSON } from '../../apis-client/svc-boards-nexxiot'
import { ExtendedBoardFromJSON as KizyBoardFromJSON } from '../../apis-client/svc-boards-kizy'
import { ExtendedBoardFromJSON as MostBoardFromJSON } from '../../apis-client/svc-boards-most'
import Config from '../../config.json'

import { archiveAelerBoard, createAelerBoard, createKizyBoard, getBoardContainerId, listAelerBoards, listKizyBoards, listMostBoards, listNexxiotBoards } from './actions'
import { mapAelerBoard, mapNexxiotBoard, mapKizyBoard, mapMostBoard } from './selectors'
import * as t from './types'
import mocksAeler from './mocks_aeler.json'
import mocksNexxiot from './mocks_nexxiot.json'
import mocksKizy from './mocks_kizy2.json'
import mocksMost from './mocks_most.json'

const mockParser = new Map<string, any>([
  ['aeler', AelerBoardFromJSON],
  ['nexxiot', NexxiotBoardFromJSON],
  ['kizy', KizyBoardFromJSON],
  ['most', MostBoardFromJSON],

])

// eslint-disable-next-line func-call-spacing
const mockMapper = new Map<string, (board: any, source: string) => t.Board>([
  ['aeler', mapAelerBoard],
  ['nexxiot', mapNexxiotBoard],
  ['kizy', mapKizyBoard],
  ['most', mapMostBoard],
])

const mapMockBoards = (mockBoards: any, source: 'aeler' | 'nexxiot' | 'kizy' | 'most') => mockBoards
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  .map((mb: any) => mockParser.get(source)(mb)).map((b: any): t.Board => mockMapper.get(source)!(b, source))

const initialState: t.BoardsReducerState = {
  boards: Config.FF_ENABLE_MOCK !== undefined && Config.FF_ENABLE_MOCK === 'true'
    ? [
        ...mapMockBoards(mocksAeler, 'aeler'),
        ...mapMockBoards(mocksNexxiot, 'nexxiot'),
        ...mapMockBoards(mocksKizy, 'kizy'),
        ...mapMockBoards(mocksMost, 'most'),
      ]
    : [],
  loadingStatusAeler: false,
  loadingStatusNexxiot: false,
  loadingStatusKizy: false,
  loadingStatusMost: false,
  loadingStatusContainerId: false,
}

export const boardsReducers = createReducer(initialState, handleAction => [
  // Create Aeler Board
  handleAction(createAelerBoard.next, (state) => ({
    ...state,
  })),
  handleAction(createAelerBoard.complete, (state: t.BoardsReducerState, { payload }) => ({
    ...state,
    boards: [
      ...state.boards,
      {
        ...mapAelerBoard(payload, 'aeler'),
      },
    ],
  })),
  handleAction(createAelerBoard.error, (state) => ({
    ...state,
  })),
  // // Create Nexxiot Board
  // handleAction(createNexxiotBoard.next, (state) => ({
  //   ...state,
  // })),
  // handleAction(createNexxiotBoard.complete, (state: t.BoardsReducerState, { payload }) => ({
  //   ...state,
  //   boards: [
  //     ...state.boards,
  //     {
  //       ...payload,
  //       provider: 'nexxiot',
  //     },
  //   ],
  // })),
  // handleAction(createNexxiotBoard.error, (state) => ({
  //   ...state,
  // })),
  // List Aeler boards
  handleAction(listAelerBoards.next, (state) => ({
    ...state,
    loadingStatusAeler: true,
  })),
  handleAction(listAelerBoards.complete, (state: t.BoardsReducerState, { payload }) => ({
    ...state,
    boards: [
      ...state.boards.filter(b => b.provider !== 'aeler'),
      ...payload.map(e => mapAelerBoard(e, 'aeler')),
    ],
    loadingStatusAeler: false,
  })),
  handleAction(listAelerBoards.error, (state) => ({
    ...state,
    loadingStatusAeler: false,
  })),

  handleAction(archiveAelerBoard.next, (state) => ({
    ...state,
    loadingStatusAeler: true,
  })),
  handleAction(archiveAelerBoard.complete, (state: t.BoardsReducerState, { payload }) => {
    return (({
      ...state,
      boards: [
        ...state.boards.filter(b => b.boardId !== payload.boardId),
      ],
      loadingStatusAeler: false,
    }))
  }),
  handleAction(archiveAelerBoard.error, (state) => ({
    ...state,
    loadingStatusAeler: false,
  })),

  // List Nexxiot boards
  handleAction(listNexxiotBoards.next, (state) => ({
    ...state,
    loadingStatusNexxiot: true,
  })),
  handleAction(listNexxiotBoards.complete, (state: t.BoardsReducerState, { payload }) => ({
    ...state,
    boards: [
      ...state.boards.filter(b => b.provider !== 'nexxiot'),
      ...payload.map(e => mapNexxiotBoard(e, 'nexxiot')),
    ],
    loadingStatusNexxiot: false,
  })),
  handleAction(listNexxiotBoards.error, (state) => ({
    ...state,
    loadingStatusNexxiot: false,
  })),
  /** KIZY BOARDS -------------------------------------------------------------------------------- */
  // List Kizy boards
  handleAction(listKizyBoards.next, (state) => ({
    ...state,
    loadingStatusKizy: true,
  })),
  handleAction(listKizyBoards.complete, (state: t.BoardsReducerState, { payload }) => ({
    ...state,
    boards: [
      ...state.boards.filter(b => b.provider !== 'kizy'),
      ...payload.map(e => mapKizyBoard(e, 'kizy')),
    ],
    loadingStatusKizy: false,
  })),
  handleAction(listKizyBoards.error, (state) => ({
    ...state,
    loadingStatusKizy: false,
  })),
  // Create Kizy board
  handleAction(createKizyBoard.next, (state) => ({
    ...state,
  })),
  // handleAction(createKizyBoard.complete, (state: t.BoardsReducerState, { payload }) => ({
  //   ...state,
  //   boards: [...state.boards, mapKizyBoard(payload, 'kizy')],
  // })),
  handleAction(createKizyBoard.error, (state) => ({
    ...state,
  })),

  // Get Kizy board container id
  handleAction(getBoardContainerId.next, (state) => ({
    ...state,
    loadingStatusContainerId: true,
  })),
  handleAction(getBoardContainerId.complete, (state: t.BoardsReducerState, { payload }) => {
    return ({
      ...state,
      boards: state.boards.map(b => b.provider === payload.source
        ? { ...b, containerIds: payload.pairings.find(p => p.boardId === b.boardId)?.containerIds || [] }
        : b,
      ),
      loadingStatusContainerId: false,
    })
  }),
  handleAction(getBoardContainerId.error, (state) => ({
    ...state,
    loadingStatusContainerId: false,
  })),
  /** MOST BOARDS -------------------------------------------------------------------------------- */
  // List MOST boards
  handleAction(listMostBoards.next, (state) => ({
    ...state,
    loadingStatusMost: true,
  })),
  handleAction(listMostBoards.complete, (state: t.BoardsReducerState, { payload }) => ({
    ...state,
    boards: [
      ...state.boards.filter(b => b.provider !== 'most'),
      ...payload.map(e => mapMostBoard(e, 'most')),
    ],
    loadingStatusMost: false,
  })),
  handleAction(listMostBoards.error, (state) => ({
    ...state,
    loadingStatusMost: false,
  })),
])
