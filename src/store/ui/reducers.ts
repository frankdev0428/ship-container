import { inititalBoardProfileHeadCells } from '../../ui/components/Containers/ContainerCollapsedData/BoardProfile/BoardProfileTable'
import { inititalBoardHeadCells } from '../../ui/views/Boards'
import { inititalContainerHeadCells } from '../../ui/views/Containers'
import { initialDepotHeadCells } from '../../ui/views/Depots'
import { inititalOrderHeadCells } from '../../ui/views/Orders'

import * as t from './types'
import { SortByUI } from './types'

/**
 * To ensure that if the defaults change, we are not using outdated config
 */
const parseTableCells = (raw: string | null, defaultHeader: t.TableHeadCell[]): t.TableHeadCell[] => {
  try {
    if (!raw) return defaultHeader
    const parsed = JSON.parse(raw) as t.TableHeadCell[]
    if (parsed.length === undefined || parsed.length !== defaultHeader.length) return defaultHeader
    if (parsed.some((e, idx) => e.id !== defaultHeader[idx].id || e.label !== defaultHeader[idx].label)) return defaultHeader
    return parsed
  } catch (e: any) {
    return defaultHeader
  }
}

const containersViewInitialState = {
  containerTableHeadCells: parseTableCells(localStorage.getItem('containerTableHeadCells'), inititalContainerHeadCells),
  containerSortBy: {
    order: 'asc' as const,
    orderBy: 'availableFrom',
  },
  containerFilters: [null],
}

const ordersViewInitialState = {
  orderTableHeadCells: parseTableCells(localStorage.getItem('orderTableHeadCells'), inititalOrderHeadCells),
  orderSortBy: {
    order: 'desc' as const,
    orderBy: 'createdAt',
  },
  orderFilters: [null],
  orderStatusTab: 'ALL',
}

const boardsViewInitialState = {
  boardTableHeadCells: parseTableCells(localStorage.getItem('boardTableHeadCells'), inititalBoardHeadCells),
  boardSortBy: {
    order: 'asc' as const,
    orderBy: 'id',
  },
  boardFilters: [null],
}

const boardsProfileViewInitialState = {
  boardProfileTableHeadCells: parseTableCells(localStorage.getItem('boardProfileTableHeadCells'), inititalBoardProfileHeadCells),
  boardProfileSortBy: {
    order: 'asc' as const,
    orderBy: 'id',
  },
  boardProfileFilters: [null],
}

const depotsViewInitialState = {
  depotTableHeadCells: parseTableCells(localStorage.getItem('depotTableHeadCells'), initialDepotHeadCells),
  depotSortBy: {
    order: 'asc' as const,
    orderBy: 'city',
  },
  depotFilters: [null],
}

const customersViewInitialState = {
  customerFilters: [null],
  customerSortBy: {
    order: 'asc' as const,
    orderBy: 'id',
  },
}

const allocateTableInitialState = {
  allocateTableHeadCells: parseTableCells(localStorage.getItem('allocateTableHeadCells'), inititalContainerHeadCells),
  allocateFilters: [null],
  allocateSortBy: {
    order: 'asc' as const,
    orderBy: 'id',
  },
}

const initialState: t.UIReducerState = {
  ...containersViewInitialState,
  ...ordersViewInitialState,
  ...boardsViewInitialState,
  ...depotsViewInitialState,
  ...customersViewInitialState,
  ...boardsProfileViewInitialState,
  ...allocateTableInitialState,
}

export interface ReducerActions {
  type: string;
  containerTableHeadCells?: t.TableHeadCell[];
  containerSortBy?: SortByUI;
  containerFilters?: t.UIReducerState['containerFilters'];
  orderTableHeadCells?: t.TableHeadCell[];
  orderSortBy?: SortByUI;
  orderFilters?: t.UIReducerState['orderFilters'];
  orderStatusTab?: t.UIReducerState['orderStatusTab']
  boardTableHeadCells?: t.TableHeadCell[];
  boardSortBy?: SortByUI;
  boardFilters?: t.UIReducerState['boardFilters'];

  datagridState?: t.UIReducerState['datagridState'];

  boardProfileTableHeadCells?: t.TableHeadCell[];
  boardProfileSortBy?: SortByUI;
  boardProfileFilters?: t.UIReducerState['boardProfileFilters'];

  depotTableHeadCells?: t.TableHeadCell[];
  depotSortBy?: SortByUI;
  depotFilters?: t.UIReducerState['boardFilters'];
  customerFilters?: t.UIReducerState['customerFilters'];
  customerSortBy?: SortByUI;
  allocateFilters?: t.UIReducerState['allocateFilters'];
  allocateSortBy?: SortByUI;
}

const uiReducer = (
  state = initialState,
  action: ReducerActions,
): t.UIReducerState => {
  switch (action.type) {
    case 'CONTAINER_COLUMNS_CHANGE':
      localStorage.setItem('containerTableHeadCells', JSON.stringify(action.containerTableHeadCells))
      return {
        ...state,
        ...action.containerTableHeadCells && { containerTableHeadCells: action.containerTableHeadCells },
      }
    case 'CONTAINER_TABLE_SORT_BY':
      return {
        ...state,
        ...action.containerSortBy && { containerSortBy: action.containerSortBy },
      }
    case 'CONTAINER_FILTERS_CHANGE':
      return {
        ...state,
        ...action.containerFilters && { containerFilters: action.containerFilters },
      }
    case 'ORDER_COLUMNS_CHANGE':
      localStorage.setItem('orderTableHeadCells', JSON.stringify(action.orderTableHeadCells))
      return {
        ...state,
        ...action.orderTableHeadCells && { orderTableHeadCells: action.orderTableHeadCells },
      }
    case 'ORDER_TABLE_SORT_BY':
      return {
        ...state,
        ...action.orderSortBy && { orderSortBy: action.orderSortBy },
      }
    case 'ORDER_FILTERS_CHANGE':
      return {
        ...state,
        ...action.orderFilters && { orderFilters: action.orderFilters },
      }
    case 'DATAGRID_STATE':
      localStorage.setItem('datagridState', JSON.stringify(action.datagridState))
      return {
        ...state,
        ...action.datagridState && { datagridState: action.datagridState },
      }
    case 'ORDER_TAB_CHANGE':
      return {
        ...state,
        ...action.orderStatusTab && { orderStatusTab: action.orderStatusTab },
      }
    case 'BOARD_COLUMNS_CHANGE':
      localStorage.setItem('boardTableHeadCells', JSON.stringify(action.boardTableHeadCells))
      return {
        ...state,
        ...action.boardTableHeadCells && { boardTableHeadCells: action.boardTableHeadCells },
      }
    case 'BOARD_TABLE_SORT_BY':
      return {
        ...state,
        ...action.boardSortBy && { boardSortBy: action.boardSortBy },
      }
    case 'BOARD_FILTERS_CHANGE':
      return {
        ...state,
        ...action.boardFilters && { boardFilters: action.boardFilters },
      }
      /* BOARDS HIDDEN VIEW */
    case 'BOARD_PROFILE_COLUMNS_CHANGE':
      localStorage.setItem('boardProfileTableHeadCells', JSON.stringify(action.boardProfileTableHeadCells))
      return {
        ...state,
        ...action.boardProfileTableHeadCells && { boardProfileTableHeadCells: action.boardProfileTableHeadCells },
      }
    case 'BOARD_PROFILE_TABLE_SORT_BY':
      return {
        ...state,
        ...action.boardProfileSortBy && { boardProfileSortBy: action.boardProfileSortBy },
      }
    case 'BOARD_PROFILE_FILTERS_CHANGE':
      return {
        ...state,
        ...action.boardProfileFilters && { boardProfileFilters: action.boardProfileFilters },
      }
      /* DEPOTS */
    case 'DEPOT_COLUMNS_CHANGE':
      localStorage.setItem('depotTableHeadCells', JSON.stringify(action.depotTableHeadCells))
      return {
        ...state,
        ...action.depotTableHeadCells && { depotTableHeadCells: action.depotTableHeadCells },
      }
    case 'DEPOT_TABLE_SORT_BY':
      return {
        ...state,
        ...action.depotSortBy && { depotSortBy: action.depotSortBy },
      }
    case 'DEPOT_FILTERS_CHANGE':
      return {
        ...state,
        ...action.depotFilters && { depotFilters: action.depotFilters },
      }
    case 'CUSTOMER_FILTERS_CHANGE':
      return {
        ...state,
        ...action.customerFilters && { customerFilters: action.customerFilters },
      }
    case 'CUSTOMER_TABLE_SORT_BY':
      return {
        ...state,
        ...action.customerSortBy && { customerSortBy: action.customerSortBy },
      }
    case 'ALLOCATE_FILTERS_CHANGE':
      return {
        ...state,
        ...action.allocateFilters && { allocateFilters: action.allocateFilters },
      }
    case 'ALLOCATE_TABLE_SORT_BY':
      return {
        ...state,
        ...action.allocateSortBy && { allocateSortBy: action.allocateSortBy },
      }
    default:
      return state
  }
}

export default uiReducer
