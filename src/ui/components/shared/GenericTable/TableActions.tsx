
import React, { ReactNode, useState } from 'react'
// import { useQueryParam, StringParam } from 'use-query-params'
import {
  Popper,
  Paper,
  ClickAwayListener,
  Grow,
  Box,
  IconButton,
  List,
  ListItem,
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'

export interface TableAction {
  label: string | ((numSelected: number) => ReactNode | string)
  action: (ids: string[], event: React.MouseEvent<HTMLElement>) => void
  disabled?: boolean
}

interface TableActionsProps {
  actions: TableAction[]
  selectedIds?: string[]
  disabled?: boolean
}

const TableActions = React.memo(({ actions, selectedIds, disabled }: TableActionsProps): JSX.Element => {
  const [open, setOpen] = React.useState(false)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    setOpen((previousOpen) => !previousOpen)
  }

  const handleClose = (event: any /* React.MouseEvent<Document, MouseEvent> */) => {
    event.target?.localName !== 'body' && setOpen(false)
  }

  return (
    <>
      <IconButton color='primary' disabled={disabled} onClick={handleClick} size='small'>
        <MoreVertIcon fontSize={'small'} />
      </IconButton>
      {
        !disabled &&
          <Popper placement='bottom-end' open={open} anchorEl={anchorEl} role={undefined} transition sx={{ zIndex: 1200 }} /* disablePortal */>
          {({ TransitionProps, placement }) => (
            <Grow {...TransitionProps} style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }} >
                <Paper elevation={8} sx={{ minWidth: '180px' }}>
                  <ClickAwayListener onClickAway={handleClose}>
                    <List dense id="table-actions-menu">
                      {actions.map((action, index) => (
                        <ListItem
                          key={index}
                          button
                          disabled={action.disabled}
                          onClick={(event) => {
                            handleClose(event)
                            selectedIds && action.action(selectedIds, event)
                          }}
                        >
                          { typeof action.label === 'function'
                            ? action.label(selectedIds?.length || 0)
                            : action.label
                          }
                        </ListItem>
                      ))}
                    </List>
                  </ClickAwayListener>
                </Paper>
            </Grow>
          )}
        </Popper>
      }
    </>
  )
})
TableActions.displayName = 'TableActions'
export default TableActions
