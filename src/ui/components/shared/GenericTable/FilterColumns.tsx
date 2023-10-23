import React, { Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Checkbox, ClickAwayListener, FormControlLabel, FormGroup, Grow, Tooltip, IconButton, Paper, Popper, IconButtonProps } from '@mui/material'
import ViewColumnIcon from '@mui/icons-material/ViewColumn'
import CloseIcon from '@mui/icons-material/Close'

import { AppState } from '../../../../store'
import { setBoardColumns, setBoardProfileColumns, setContainerColumns, setDepotColumns, setOrderColumns } from '../../../../store/ui/actions'
import { TableHeadCell } from '../../../../store/ui/types'
import { initialDepotHeadCells } from '../../../views/Depots'

interface FilterColumnsProps {
  type: 'container' | 'order' | 'depot' | 'board' | 'boardProfile'
  size?: IconButtonProps['size']
}

const FilterColumns = ({ type, size }: FilterColumnsProps) => {
  const [open, setOpen] = React.useState(false)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const { containerTableHeadCells } = useSelector((state: AppState) => state.ui)
  const { orderTableHeadCells } = useSelector((state: AppState) => state.ui)
  const depotTableHeadCells = useSelector((state: AppState) => state.ui.depotTableHeadCells)
  const boardTableHeadCells = useSelector((state: AppState) => state.ui.boardTableHeadCells)
  const boardProfileTableHeadCells = useSelector((state: AppState) => state.ui.boardProfileTableHeadCells)

  const _dispatch = useDispatch()

  // Declare default void dispatcher
  let dispatcher: (headCells: TableHeadCell[]) => (dispatch: () => void) => void = (_: TableHeadCell[]) => (dispatch: () => void): void => { dispatch() }
  let tableHeadCells: TableHeadCell[] = []

  switch (type) {
    case 'container':
      tableHeadCells = containerTableHeadCells
      dispatcher = setContainerColumns
      break
    case 'order':
      tableHeadCells = orderTableHeadCells
      dispatcher = setOrderColumns
      break
    case 'depot':
      tableHeadCells = depotTableHeadCells
      dispatcher = setDepotColumns
      break
    case 'board':
      tableHeadCells = boardTableHeadCells
      dispatcher = setBoardColumns
      break
    case 'boardProfile':
      tableHeadCells = boardProfileTableHeadCells
      dispatcher = setBoardProfileColumns
      break
    default:
      tableHeadCells = []
  }

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    setOpen((previousOpen) => !previousOpen)
  }

  const handleClose = (event: any /* React.MouseEvent<Document, MouseEvent> */) => {
    event.target?.localName !== 'body' && setOpen(false)
  }

  const handleChange = (id: string) => (event: any) => {
    const newH = tableHeadCells.map(h => h.id === id ? ({ ...h, hide: !h.hide }) : h)
    _dispatch(dispatcher(newH))
  }

  return (
    <Fragment>
      <Tooltip title="Show Columns" placement='top'>
        <IconButton color='primary' aria-label="expand row" size={size} onClick={handleClick}>
          <ViewColumnIcon/>
        </IconButton>
      </Tooltip>
      <Popper
        placement='bottom-end'
        open={open}
        anchorEl={anchorEl}
        role={undefined}
        transition
        sx={{ zIndex: 1200 }} /* disablePortal */>
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Grow {...TransitionProps} >
                <Paper elevation={8} >
                  <Box>
                    <Box pr={1} textAlign={'right'} >
                      <IconButton size='small' color='primary' onClick={handleClose}><CloseIcon/></IconButton>
                    </Box>
                    <Box p={2} pt={0} width={430} maxHeight='40vh' minHeight={200} overflow='hidden auto'>
                      <FormGroup>
                        {
                          tableHeadCells.map((hc, key) =>
                            (typeof hc.label === 'string'
                              ? <FormControlLabel
                              key={key}
                              control={<Checkbox color='primary' checked={!hc.hide} onChange={handleChange(hc.id)}/>}
                              label={hc.label}
                            />
                              : null),
                          )
                        }
                      </FormGroup>
                    </Box>
                  </Box>
                </Paper>
            </Grow>
            </ClickAwayListener>
        )}
      </Popper>
    </Fragment>
  )
}
export default FilterColumns
