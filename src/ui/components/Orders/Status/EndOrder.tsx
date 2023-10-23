import React, { useState, useRef } from 'react'
import {
  Button,
  ButtonGroup,
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
  MenuItem,
  MenuList,
  Box,
  BoxProps,
} from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { useDispatch } from 'react-redux'

import { showWarning } from '../../../../store/error/actions'
import { Lease, OrderStatusEnum } from '../../../../services/lease/types'

import EndOrderDialog from './EndOrderDialog'

interface EndOrderProps extends BoxProps {
  orders: Lease[];

  onEndOrder: (orders: Lease[], orderStatus: OrderStatusEnum) => void
}

function capitalize(str: string) {
  const lower = str.toLowerCase()
  return str.charAt(0).toUpperCase() + lower.slice(1)
}

const options = Object.values(OrderStatusEnum).map(o =>
  ({ label: capitalize(o), value: o }))

const EndOrder = ({ orders, onEndOrder, ...boxProps }: EndOrderProps) => {
  const [open, setOpen] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const anchorRef = useRef<HTMLDivElement>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const _dispatch = useDispatch()

  const handleClick = () => {
    if (orders.length === 0) {
      _dispatch(showWarning(['Pick at least 1 order.']))
      return
    }
    setOpenDialog(true)
  }

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number,
  ) => {
    setSelectedIndex(index)
    setOpen(false)
  }

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const handleClose = (event: MouseEvent | TouchEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return
    }

    setOpen(false)
  }

  const handleEndOrder = () => {
    setOpenDialog(false)
    onEndOrder(orders, options[selectedIndex].value)
  }

  return (
    <Box {...boxProps}>
      <ButtonGroup variant="contained" size='small' color="primary" ref={anchorRef} aria-label="split button">
        <Button onClick={handleClick} >{`Mark as ${options[selectedIndex].label}`}</Button>
        <Button
          color="primary"
          size="small"
          // disabled={disabled || !container}
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal sx={{ zIndex: 1200 }}>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu">
                  {options.map((option, index) => (
                    <MenuItem
                      key={option.value}
                      // disabled={index === 2}
                      selected={index === selectedIndex}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      {`${option.label}`}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
      { openDialog && <EndOrderDialog label={`Mark as ${options[selectedIndex].label}`} orders={orders} handleClose={() => setOpenDialog(false)} handleEndOrder={handleEndOrder}/>}
    </Box>
  )
}

export default EndOrder
