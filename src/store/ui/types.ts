
// import { StateFilter } from '../../ui/views/Containers/SearchBar/Filter/FilterButton'

import { GridInitialStatePro } from '@mui/x-data-grid-pro/models/gridStatePro'

import { StateFilter } from '../../ui/components/shared/Filter/FilterButton'
import { TableHeadCell as _TableHeadCell } from '../../ui/components/shared/GenericTable/SortableTableHead'

export type TableHeadCell = _TableHeadCell

export interface SortByUI {
  order: 'asc' | 'desc';
  orderBy: string;
}

interface ContainersViewReducerState {
  containerTableHeadCells: TableHeadCell[];
  containerSortBy: SortByUI;
  containerFilters: StateFilter[];
}

interface OrderReducerState {
  orderTableHeadCells: TableHeadCell[];
  orderSortBy: SortByUI;
  orderFilters: StateFilter[];
  orderStatusTab: string;
}

interface BoardsReducerState {
  boardTableHeadCells: TableHeadCell[];
  boardSortBy: SortByUI;
  boardFilters: StateFilter[];
}

interface BoardsProfileReducerState {
  boardProfileTableHeadCells: TableHeadCell[];
  boardProfileSortBy: SortByUI;
  boardProfileFilters: StateFilter[];
}

interface DepotsReducerState {
  depotTableHeadCells: TableHeadCell[];
  depotSortBy: SortByUI;
  depotFilters: StateFilter[];
}

interface CustomersReducerState {
  customerFilters: StateFilter[];
  customerSortBy: SortByUI;
}

interface AllocateTableReducerState {
  allocateTableHeadCells: TableHeadCell[];
  allocateFilters: StateFilter[];
  allocateSortBy: SortByUI;
}

interface ColumnsReducerState {
  datagridState?: {
    orders?: GridInitialStatePro
    ordersAllocation?: GridInitialStatePro
    ordersVisibility?: GridInitialStatePro
    containers?: GridInitialStatePro
    containersBoardsProfile?: GridInitialStatePro
    containersAllocation?: GridInitialStatePro
    containersStatuses?: GridInitialStatePro
    facilities?: GridInitialStatePro
    facilitiesContainers?: GridInitialStatePro
    facilitiesContacts?: GridInitialStatePro
    boards?: GridInitialStatePro
    reports?: GridInitialStatePro
    customers?: GridInitialStatePro
    allocate?: GridInitialStatePro
  };
}

export type UIReducerState = AllocateTableReducerState & CustomersReducerState & ContainersViewReducerState & OrderReducerState & BoardsReducerState & BoardsProfileReducerState & DepotsReducerState & ColumnsReducerState
