import * as t from './types'
import { ReducerActions } from './reducers'
import { SortByUI } from './types'

export const setContainerColumns = (headCells: t.TableHeadCell[]) => {
  return (dispatch: (payload: ReducerActions) => void): void => {
    dispatch({ type: 'CONTAINER_COLUMNS_CHANGE', containerTableHeadCells: headCells })
  }
}

export const setContainerSortBy = (sortBy: SortByUI) => {
  return (dispatch: (payload: ReducerActions) => void): void => {
    dispatch({ type: 'CONTAINER_TABLE_SORT_BY', containerSortBy: sortBy })
  }
}

export const setContainerFilters = (containerFilters: t.UIReducerState['containerFilters']) => {
  return (dispatch: (payload: ReducerActions) => void): void => {
    dispatch({ type: 'CONTAINER_FILTERS_CHANGE', containerFilters: containerFilters })
  }
}

export const setOrderColumns = (headCells: t.TableHeadCell[]) => {
  return (dispatch: (payload: ReducerActions) => void): void => {
    dispatch({ type: 'ORDER_COLUMNS_CHANGE', orderTableHeadCells: headCells })
  }
}

export const setOrderSortBy = (sortBy: SortByUI) => {
  return (dispatch: (payload: ReducerActions) => void): void => {
    dispatch({ type: 'ORDER_TABLE_SORT_BY', orderSortBy: sortBy })
  }
}

export const setOrderFilters = (orderFilters: t.UIReducerState['orderFilters']) => {
  return (dispatch: (payload: ReducerActions) => void): void => {
    dispatch({ type: 'ORDER_FILTERS_CHANGE', orderFilters: orderFilters })
  }
}

export const setDatagridState = (datagridState: t.UIReducerState['datagridState']) => {
  return (dispatch: (payload: ReducerActions) => void): void => {
    dispatch({ type: 'DATAGRID_STATE', datagridState })
  }
}

export const setOrderViewTab = (orderStatusTab: t.UIReducerState['orderStatusTab']) => {
  return (dispatch: (payload: ReducerActions) => void): void => {
    dispatch({ type: 'ORDER_TAB_CHANGE', orderStatusTab: orderStatusTab })
  }
}

/* DEPOTS */
export const setDepotColumns = (headCells: t.TableHeadCell[]) => {
  return (dispatch: (payload: ReducerActions) => void): void => {
    dispatch({ type: 'DEPOT_COLUMNS_CHANGE', depotTableHeadCells: headCells })
  }
}

export const setDepotSortBy = (sortBy: SortByUI) => {
  return (dispatch: (payload: ReducerActions) => void): void => {
    dispatch({ type: 'DEPOT_TABLE_SORT_BY', depotSortBy: sortBy })
  }
}

export const setDepotFilters = (depotFilters: t.UIReducerState['depotFilters']) => {
  return (dispatch: (payload: ReducerActions) => void): void => {
    dispatch({ type: 'DEPOT_FILTERS_CHANGE', depotFilters: depotFilters })
  }
}

/* BOARDS */
export const setBoardColumns = (headCells: t.TableHeadCell[]) => {
  return (dispatch: (payload: ReducerActions) => void): void => {
    dispatch({ type: 'BOARD_COLUMNS_CHANGE', boardTableHeadCells: headCells })
  }
}

export const setBoardSortBy = (sortBy: SortByUI) => {
  return (dispatch: (payload: ReducerActions) => void): void => {
    dispatch({ type: 'BOARD_TABLE_SORT_BY', boardSortBy: sortBy })
  }
}

export const setBoardFilters = (boardFilters: t.UIReducerState['boardFilters']) => {
  return (dispatch: (payload: ReducerActions) => void): void => {
    dispatch({ type: 'BOARD_FILTERS_CHANGE', boardFilters: boardFilters })
  }
}

/* BOARDS HIDDEN VIEW */
export const setBoardProfileColumns = (headCells: t.TableHeadCell[]) => {
  return (dispatch: (payload: ReducerActions) => void): void => {
    dispatch({ type: 'BOARD_PROFILE_COLUMNS_CHANGE', boardProfileTableHeadCells: headCells })
  }
}

export const setBoardProfileSortBy = (sortBy: SortByUI) => {
  return (dispatch: (payload: ReducerActions) => void): void => {
    dispatch({ type: 'BOARD_PROFILE_TABLE_SORT_BY', boardProfileSortBy: sortBy })
  }
}

export const setBoardProfileFilters = (boardProfileFilters: t.UIReducerState['boardProfileFilters']) => {
  return (dispatch: (payload: ReducerActions) => void): void => {
    dispatch({ type: 'BOARD_PROFILE_FILTERS_CHANGE', boardProfileFilters: boardProfileFilters })
  }
}

export const setCustomerSortBy = (sortBy: SortByUI) => {
  return (dispatch: (payload: ReducerActions) => void): void => {
    dispatch({ type: 'CUSTOMER_TABLE_SORT_BY', customerSortBy: sortBy })
  }
}

export const setCustomerFilters = (customerFilters: t.UIReducerState['customerFilters']) => {
  return (dispatch: (payload: ReducerActions) => void): void => {
    dispatch({ type: 'CUSTOMER_FILTERS_CHANGE', customerFilters: customerFilters })
  }
}

export const setAllocateSortBy = (sortBy: SortByUI) => {
  return (dispatch: (payload: ReducerActions) => void): void => {
    dispatch({ type: 'ALLOCATE_TABLE_SORT_BY', allocateSortBy: sortBy })
  }
}

export const setAllocateFilters = (allocateFilters: t.UIReducerState['allocateFilters']) => {
  return (dispatch: (payload: ReducerActions) => void): void => {
    dispatch({ type: 'ALLOCATE_FILTERS_CHANGE', allocateFilters: allocateFilters })
  }
}
