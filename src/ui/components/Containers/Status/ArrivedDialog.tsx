import React, { FormEvent, useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'

import { LabeledDatePicker } from '../../shared/LabeledDatePicker'
import Typography from '../../Utils/Typography'
import FacilityAutocomplete from '../../shared/Autocomplete/FacilityAutocomplete'

const commonProps = {
  variant: 'outlined' as any,
  margin: 'dense' as any,
  size: 'small' as any,
  style: { minWidth: 160 },
}

interface ArrivedDialogProps {
  depotInDate: Date,
  depotId: string,
  label?: string,
  title?: string,
  dateLabel?: string,
  handleClose: () => void;
  handleMarkArrived: (depotInDate: Date, depotId: string) => void;
}

const ArrivedDialog = ({ depotInDate: _depotInDate, depotId: _depotId, handleClose, handleMarkArrived, label, title, dateLabel }: ArrivedDialogProps): any => {
  const [depotInDate, setDepotInDate] = useState(_depotInDate)
  const [depotId, setDepotId] = useState(_depotId)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.stopPropagation()
    event.preventDefault()

    handleMarkArrived(depotInDate, depotId)
  }

  return (
    <Dialog open={true} maxWidth={'sm'} fullWidth onClose={handleClose} >
      <DialogTitle>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography variant={'h6'}>{title || 'Mark Containers as ARRIVED'}</Typography>
          <Box justifyContent={'flex-end'}>
            <IconButton size='small' onClick={handleClose}><ClearIcon/></IconButton>
          </Box>
        </Box>
        </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
            <Box display='flex' flexDirection='column' >
              <LabeledDatePicker
                label={dateLabel || 'Return Date'}
                value={depotInDate}
                onChange={date => date && setDepotInDate(date)}
              />
              {/* <TextField {...commonProps} required label="Destination Depot" value={depotId} onChange={e => setDepotId(e.target.value)} /> */}
              <FacilityAutocomplete callback={(depot) => setDepotId(depot as string)}/>
            </Box>
        </DialogContent>
        <DialogActions>
          {/* <Button color='primary' onClick={handleClose}>Close</Button> */}
          <Button color='primary' variant='contained' type='submit' >{label || 'Mark Arrived'}</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default ArrivedDialog
