import React, { Fragment, useState } from 'react'
import {
  Box,
  Button,
  ButtonGroup,
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
  MenuItem,
  MenuList,
  BoxProps,
} from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { useDispatch } from 'react-redux'

import { EquipmentStatusInput, Equipment, EquipmentStatusEnum } from '../../../../services/equipment/types'
import { showWarning } from '../../../../store/error/actions'
// import { createContainerStatus } from '../../../../services/container/actions'
// import { ContainerInputOperationalStatusEnum, ContainerStatusInput, ContainerStatusOptionalOperationalStatusEnum } from '../../../../apis-client'
// import { markArrived } from '../../../../services/thunks'

import ArrivedDialog from './ArrivedDialog'

const options = [
  { title: 'Mark Arrived', disabled: true },
  { title: 'Mark as Tested', disabled: true },
  { title: 'Mark as Available', disabled: true },
  { title: 'Mark as Damaged', disabled: false },
]

export interface ChangeStatusButtonProps extends BoxProps {
  container?: Equipment;
  disabled?: boolean;

  onChangeStatus: (input: EquipmentStatusInput) => void
}

const ChangeStatusButton = ({ container, disabled, onChangeStatus, ...boxProps }: ChangeStatusButtonProps) => {
  const [open, setOpen] = React.useState(false)
  const [openArrivedDialog, setOpenArrivedDialog] = useState(false)
  const [openTestedDialog, setOpenTestedDialog] = useState(false)
  const [openAvailableDialog, setOpenAvailableDialog] = useState(false)
  const [openDamagedDialog, setOpenDamagedDialog] = useState(false)
  const anchorRef = React.useRef<HTMLDivElement>(null)
  const [selectedIndex, setSelectedIndex] = useState(3)
  const _dispatch = useDispatch()

  const handleClick = () => {
    if (disabled) {
      _dispatch(showWarning(['Pick only 1 container.']))
      return
    }
    if (selectedIndex === 0) {
      setOpenArrivedDialog(true)
    }

    if (selectedIndex === 1) {
      setOpenTestedDialog(true)
    }

    if (selectedIndex === 2) {
      setOpenAvailableDialog(true)
    }

    if (selectedIndex === 3) {
      setOpenDamagedDialog(true)
    }
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

  const handleMarkArrived = (depotInDate: Date, depotId: string) => {
    setOpenArrivedDialog(false)
    container && onChangeStatus({
      equipmentId: container.equipmentId,
      // eventType: 'Arrival',
      // optionalFields: {
      body: {
        status: EquipmentStatusEnum.Production, // FIXME
        locationFrom: depotId,
        // depotInDatePlanned: depotInDate,
        // ...container.depotInDateActual && { depotInDateActual: depotInDate }, // FIXME
        // destinationLocation: {
        //   // ...container.destinationLocation as any,
        //   depotId: depotId,
        // },
        // },
      },
    })
  }

  const handleMarkAvailable = (depotInDate: Date, depotId: string) => {
    setOpenAvailableDialog(false)
    container && onChangeStatus({
      equipmentId: container.equipmentId,
      // eventType: 'Arrival',
      // optionalFields: {
      body: {
        status: 'AVAILABLE' as any, // FIXME
        depotInDateActual: depotInDate,
        locationFrom: depotId,
        // ...container.depotInDateActual && { depotInDateActual: depotInDate }, // FIXME
        // destinationLocation: {
        //   // ...container.destinationLocation as any,
        //   depotId: depotId,
        // },
        // },
      },
    })
  }

  const handleMarkDamaged = (depotInDate: Date, depotId: string) => {
    setOpenDamagedDialog(false)
    container && onChangeStatus({
      equipmentId: container.equipmentId,
      body: {
        status: EquipmentStatusEnum.Mnr,
        locationFrom: depotId,
        reason: 'DAMAGED',
        depotOutDatePlanned: depotInDate,
      },
    })
  }

  // const handleMarkAvailable = (depotInDate: Date, depotId: string) => {
  //   setOpenAvailableDialog(false)
  //   container && onChangeStatus({
  //     equipmentId: container.equipmentId,
  //     // eventType: 'Arrival',
  //     // optionalFields: {
  //     body: {
  //       depotInDateActual: depotInDate,
  //     },
  //   })
  // }

  return (
    <Box position='relative' {...boxProps}>
      <ButtonGroup variant="contained" color="primary" ref={anchorRef} aria-label="split button" size='small'>
        <Button onClick={handleClick} disabled={disabled} >{options[selectedIndex].title}</Button>
        <Button
          color="primary"
          size="small"
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal sx={{ zIndex: 1200, width: '100%' }}>
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
                      key={option.title}
                      disabled={option.disabled}
                      selected={index === selectedIndex}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      {option.title}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
      {
        openArrivedDialog &&
        <ArrivedDialog
          depotId={''} // container?.destinationLocation?.depotId || ''}
          depotInDate={/* container?.depotInDateActual || container?.depotInDatePlanned || */ new Date() }
          handleClose={() => setOpenArrivedDialog(false)}
          handleMarkArrived={handleMarkArrived}
        />
      }
      {
        openAvailableDialog &&
        <ArrivedDialog
          depotId={''} // container?.destinationLocation?.depotId || ''}
          depotInDate={/* container?.depotInDateActual || container?.depotInDatePlanned || */ new Date() }
          handleClose={() => setOpenAvailableDialog(false)}
          handleMarkArrived={handleMarkAvailable}
        />
      }
      {
        openDamagedDialog &&
        <ArrivedDialog
          depotId={''} // container?.destinationLocation?.depotId || ''}
          depotInDate={/* container?.depotInDateActual || container?.depotInDatePlanned || */ new Date() }
          handleClose={() => setOpenDamagedDialog(false)}
          handleMarkArrived={handleMarkDamaged}
          title={'Mark container as DAMAGED'}
          label={'Mark Damaged'}
          dateLabel={'Damaged from'}
        />
      }
    </Box>
  )
}

export default ChangeStatusButton
