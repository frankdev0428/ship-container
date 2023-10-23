import React, { ReactNode } from 'react'
import { styled } from '@mui/material/styles'
import {
  Checkbox,
  TableCell,
  TableCellProps,
  TableHead,
  TableRow,
  TableSortLabel,
  tableRowClasses,
  tableCellClasses,
  tableSortLabelClasses,
} from '@mui/material'

import { SelectableTypography } from '../component_utils'
import OverflowTooltip from '../OverflowTooltip'

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  [`&.${tableRowClasses.root}`]: {
    border: `1px solid ${theme.palette.info.main}`,
    backgroundColor: '#f4f5f8', // theme.palette.info.light,
  },
}))

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.info.light,
    border: `1px solid ${theme.palette.info.main}`,
    padding: '6px 8px 6px 8px',
  },
  [`&.${tableCellClasses.root}`]: {
    padding: '6px 8px 6px 8px',
  },
}))

const StyledTableSortLabel = styled(TableSortLabel)({
  [`& .${tableSortLabelClasses.icon}`]: {
    margin: 0,
  },
})

export interface TableHeadCell {
  id: string;
  isSortable?: boolean;
  align?: 'left' | 'center' | 'right' | undefined;
  label: string | null | ReactNode;
  hide?: boolean;
  width?: number;
}

export interface SortableTableHeadProps {
  headerCells: TableHeadCell[];
  order: 'asc' | 'desc' | undefined;
  orderBy: string;
  numSelected?: number;
  rowCount: number;
  size?: TableCellProps['size'];
  disableSelect?: boolean;
  singleSelect?: boolean;

  onSelectAllClick?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRequestSort: (event: any, property: string) => void;
}

interface CellProps {
  title: string;
  selected?: boolean;
  deps?: any[];
  children: any;
}

const CellContent = ({ title, selected, deps, children }: CellProps) => (typeof children === 'string'
  ? <OverflowTooltip title={title} deps={deps}>
      <SelectableTypography noWrap variant='body2' selected={selected} sx={{ width: '20px', flexGrow: 1, minWidth: '100%' }} >
        {children}
      </SelectableTypography>
    </OverflowTooltip>
  : children)

const SortableTableHead: React.FC<SortableTableHeadProps> = ({
  headerCells,
  order,
  orderBy,
  numSelected,
  rowCount,
  size = 'medium',
  singleSelect,
  disableSelect,
  onSelectAllClick,
  onRequestSort,
}) => {
  const createSortHandler = (property: string) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <StyledTableRow>
        {
          !disableSelect && (numSelected !== undefined) &&
            <StyledTableCell sx={{ p: '0px 12px 0px 16px !important', width: '64px' }}>
              <Checkbox
                disabled={singleSelect}
                color='primary'
                indeterminate={numSelected > 0 && numSelected < rowCount}
                checked={rowCount > 0 && numSelected === rowCount}
                onChange={onSelectAllClick}
                inputProps={{ 'aria-label': 'select all containers' }}
                sx={{ p: 0 }}
              />
            </StyledTableCell>
        }
        {headerCells.filter(h => !h.hide).map((headCell: TableHeadCell) => (
          <StyledTableCell
              size={size}
              key={headCell.id}
              align={headCell.id === 'actions' ? 'center' : headCell.align }
              sortDirection={orderBy === headCell.id ? order : undefined}
              { ...headCell.align && { align: headCell.align } }
              { ...headCell.id === 'actions' && { style: { width: 40 } } }
              { ... headCell.width && { style: { width: headCell.width } } }
              // { ...(headCell.id === 'id') && { style: { width: 200 } } }
              padding={headCell.label ? undefined : 'none'}
          >
            {
              headCell.isSortable
                ? <StyledTableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : 'asc'}
                    onClick={createSortHandler(headCell.id)}
                    sx={{ width: '20px', minWidth: '100%' }}
                  >
                    <CellContent title={typeof headCell.label === 'string' ? headCell.label : ''} selected={orderBy === headCell.id} deps={headerCells} >{headCell.label}</CellContent>
                  </StyledTableSortLabel>
                : <CellContent title={typeof headCell.label === 'string' ? headCell.label : ''} >{headCell.label}</CellContent>

            }
          </StyledTableCell>
        ))}
      </StyledTableRow>
    </TableHead>
  )
}

export default SortableTableHead
