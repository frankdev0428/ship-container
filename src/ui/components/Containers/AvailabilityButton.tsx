import React, { useState } from 'react'
import { Box, BoxProps, Button, IconButton, Paper, ClickAwayListener, Popper, Popover } from '@mui/material'
import TodayIcon from '@mui/icons-material/Today'
import CloseIcon from '@mui/icons-material/Close'

import { LabeledDatePicker } from '../../components/shared/LabeledDatePicker'
import FacilityAutocomplete from '../shared/Autocomplete/FacilityAutocomplete'

interface AvailabilityButtonProps extends Omit<BoxProps, 'onClick'> {
  onClick: (dateFrom: Date | null, dateTo: Date | null, depotIds: string[]) => void;
  fromDate?: Date;
  toDate?: Date;
  depots?: string[];
}

const AvailabilityButton = ({ onClick, fromDate, toDate, depots, ...boxProps }: AvailabilityButtonProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [availabilityDateFrom, setAvailabilityDateFrom] = useState<Date | null>(fromDate || new Date())
  const [availabilityDateTo, setAvailabilityDateTo] = useState<Date | null>(toDate || new Date())
  const [selectedDepots, setSelectedDepots] = useState<string[]>(depots || [])

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  const open = Boolean(anchorEl)

  return (
    <Box {...boxProps}>
      <Button color={'primary'} size='small' onClick={handleClick} endIcon={<TodayIcon/>} >Check Availability</Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        // sx={{ zIndex: 1000 }}
        // placement='bottom-end'
      >
      <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
        <Paper elevation={8} sx={{ width: '300px', padding: '16px' }}>
          <Box pb={1} width='100%' display='flex' justifyContent='flex-end'>
            <IconButton size='small' color='primary' onClick={() => setAnchorEl(null)}><CloseIcon/></IconButton>
          </Box>
            <LabeledDatePicker
              label="Availability from"
              value={availabilityDateFrom}
              onChange={setAvailabilityDateFrom}
              textFieldProps={{ size: 'small' }}
            />
            <LabeledDatePicker
              label="Availability to"
              value={availabilityDateTo}
              onChange={setAvailabilityDateTo}
              minDate={availabilityDateFrom || undefined}
              textFieldProps={{ size: 'small' }}
            />
            <FacilityAutocomplete multiple defaultValue={selectedDepots} callback={(depots) => {
              return setSelectedDepots(depots as string[])
            }} label='Depot IDs'/>
            <Box pt={2} display='flex' justifyContent='flex-end'>
              <Button variant='contained' size='small' color='primary' onClick={() => {
                setAnchorEl(null)
                return onClick(availabilityDateFrom, availabilityDateTo, selectedDepots)
              }}>
                Check Availability
              </Button>
            </Box>
        </Paper>
      </ClickAwayListener>
      </Popover>
    </Box>
  )
}

export default AvailabilityButton
