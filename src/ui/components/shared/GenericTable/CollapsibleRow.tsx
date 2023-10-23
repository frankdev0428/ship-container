import React, { ReactNode } from 'react'
import {
  TableRow,
  TableCell,
  Collapse,
} from '@mui/material'

interface CollapsibleRowProps {
  open: boolean
  colSpan: number
  children: ReactNode
}

const CollapsibleRow = ({ open, colSpan, children }: CollapsibleRowProps): JSX.Element => {
  return (
    <TableRow sx={{ backgroundColor: open ? '#f9f9fb' : undefined }} >
      <TableCell padding='checkbox' sx={{ ...!open && { borderBottom: 'unset' } }} colSpan={colSpan}>
        <Collapse in={open} timeout="auto" unmountOnExit>
          {children}
        </Collapse>
      </TableCell>
    </TableRow>
  )
}

export default CollapsibleRow
