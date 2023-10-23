import React, { ReactNode, useState } from 'react'
import {
  Box,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  TableCell,
  TableCellProps,
  TableFooter,
  TablePagination,
  Paper,
  CircularProgress,
} from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
import MoreVertIcon from '@mui/icons-material/MoreVert'

import { getComparator, stableSort } from '../utils'
import Typography from '../../Utils/Typography'
import { SortByUI, TableHeadCell } from '../../../../store/ui/types'
import { CenteredContent } from '../component_utils'
import Searchbar from '../Search'

import SortableTableHead from './SortableTableHead'
import TableActions, { TableAction } from './TableActions'

const StyledTableRow = styled(TableRow)({
  '& > *': {
    borderBottom: 'unset',
  },
})

const StyledNoData = styled('div')({
  margin: '10px auto',
  width: '80%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: '40px',
  paddingBottom: '40px',
})

interface NoDataProps {
  searchFilter: string;
}

const NoData = ({ searchFilter } : NoDataProps) => {
  return (
    <StyledNoData>
      <div>
        { searchFilter !== ''
          ? <Typography align='center' variant='subtitle2'>{'You don\'t have any entries matching your search filter.'}</Typography>
          : <>
            <Typography align='center' variant='subtitle2'>{'You don\'t have any entries in your list yet.'}</Typography>
            <Typography variant='subtitle2'>{'Usually, this is a permission issue. If you believe you should have access to some containers\' data, contact AELER support.'}</Typography>
          </>
        }
      </div>
    </StyledNoData>
  )
}

export const NewlyCreatedNotif = () => {
  const theme = useTheme()
  return (
    <span style={{
      background: theme.palette.primary.highlight,
      color: 'white',
      borderRadius: 5,
      padding: 3,
      fontSize: 10,
      marginRight: 3,
      position: 'absolute',
      top: -6,
      left: 42,
      zIndex: 100,
    }}>
      New
    </span>
  )
}

export interface TableRowUiProps {
  isNewlyInserted?: boolean
}

export interface GenericTableProps {
  headerCells: TableHeadCell[];
  size?: TableCellProps['size'];
  disableSelect?: boolean;
  singleSelect?: boolean;

  rows: any;
  rowComponent: (row: any) => JSX.Element;

  order: SortByUI['order'];
  orderBy: string;
  setSortBy?: (sortBy: SortByUI) => (dispatch: () => void) => void;

  selected?: string[];
  handleSelectAllClick?: (event: React.ChangeEvent<HTMLInputElement>) => void;

  noDataComponent?: ReactNode | ((s: string) => ReactNode);
  loading?: boolean;

  searchPlaceholder?: string;
  searchBy?: (rows: any, s: string) => void;

  tableActions?: TableAction[]
}

const GenericTable: React.FC<GenericTableProps> = ({
  headerCells,
  rows,
  size = 'small',
  disableSelect,
  singleSelect,
  rowComponent,
  order: order_,
  orderBy: orderBy_,
  setSortBy: setSortByCallback,
  selected,
  handleSelectAllClick,
  noDataComponent,
  loading,
  searchPlaceholder,
  searchBy,
  tableActions,
}) => {
  const [sortBy, setSortBy_] = useState({ order: order_, orderBy: orderBy_ })
  // const [selected, setSelected] = React.useState<string[]>([])
  const [page, setPage] = React.useState(0)
  const [searchFilter, setSearchFilter] = useState('')
  const [rowsPerPage, setRowsPerPage] = React.useState(200)
  const theme = useTheme()

  const { order, orderBy, setSortBy } = setSortByCallback
    ? ({ order: order_, orderBy: orderBy_, setSortBy: setSortByCallback })
    : ({ order: sortBy.order, orderBy: sortBy.orderBy, setSortBy: setSortBy_ })

  const handleRequestSort = (event: any, property: string) => {
    const isAsc = orderBy === property && order === 'asc'
    setSortBy({ order: isAsc ? 'desc' : 'asc', orderBy: property })
  }

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const colSPan = headerCells.filter(h => !h.hide).length + (disableSelect ? 0 : 1)

  let rowData = rows
  if (searchBy && searchFilter !== '') {
    rowData = searchBy(rows, searchFilter)
  }

  const numSelected = selected?.length
  const hasSelectedItems: boolean = typeof numSelected === 'number' && numSelected > 0

  return (
    <>
      { searchBy !== undefined && <Box width={300} mb={1}>
          <Searchbar
            placeholder={searchPlaceholder || 'Search...'}
            filter={searchFilter}
            setFilter={setSearchFilter}
            clearAll={() => setSearchFilter('')}
          />
        </Box>
      }
      { !disableSelect && hasSelectedItems &&
        <Box
          width={1} /* height={20} */
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          p={0.5}
          pl={2}
          sx={{ background: hasSelectedItems ? '#E7F0FF' : '#f1f1f1' }}
        >

           <Typography color='textSecondary' { ...hasSelectedItems && { style: { color: theme.palette.primary.highlight } }}>
            {hasSelectedItems && `${numSelected} item${numSelected && numSelected > 1 ? 's' : ''} selected` }
          </Typography>
          <TableActions actions={tableActions || []} selectedIds={selected} disabled={disableSelect || numSelected === 0} />
        </Box>
      }
      <TableContainer component={Paper} elevation={0} sx={{
        width: '100%',
        height: '100%',
        border: '1px solid #e1e3e9',
        borderRadius: '4px',
      }}>
        <Table stickyHeader size={size} sx={{ tableLayout: 'fixed', height: '100%' }} aria-label="table">
          <SortableTableHead
              headerCells={headerCells}
              order={order}
              orderBy={orderBy}
              numSelected={numSelected}
              rowCount={rowData.length}
              size={size}
              disableSelect={disableSelect}
              singleSelect={singleSelect}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
          />
          <TableBody>
            { stableSort(rowData, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row: any, index: number) => rowComponent({
                key: `${row.id}-${index}`,
                // handleRowClick: handleRowClick,
                // isSelected: isSelected(row.id),
                headerCells,
                disableSelect,
                ...row,
              }))
            }
            {/* Row to fill in blank space and show message when there is no data */}
            <StyledTableRow sx={{ height: '100%' }}>
              <TableCell colSpan={colSPan} padding='none' sx={{ borderBottom: 'unset' }}>
                {loading
                  ? <CenteredContent><CircularProgress /></CenteredContent>
                  : rowData.length === 0 && (
                    (noDataComponent &&
                      typeof noDataComponent === 'function'
                      ? noDataComponent(searchFilter)
                      : noDataComponent
                    ) || <NoData searchFilter={searchFilter} />)
                }
              </TableCell>
            </StyledTableRow>
          </TableBody>
          <TableFooter sx={{ position: 'sticky', bottom: 0, background: 'white' }}>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50, 100, 200]}
                colSpan={colSPan}
                count={rowData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{ borderTop: '1px solid rgba(224, 224, 224, 1)' }}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  )
}

export default GenericTable
