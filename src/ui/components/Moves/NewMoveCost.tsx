import React, { ChangeEvent, FormEvent, useState } from 'react'
import {
  Box,
  BoxProps,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  TextField,
  FormControlLabel,
  Grid,
} from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import { useDispatch, useSelector } from 'react-redux'
import EditIcon from '@mui/icons-material/Edit'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'

import { LabeledDatePicker } from '../shared/LabeledDatePicker'
import Typography from '../Utils/Typography'
import { showError, showWarning } from '../../../store/error/actions'
import { EquipmentMoveInput, EquipmentMoveInputMoveTypeEnum, ExchangeLocationInput, MoveCostInput, MoveCostInputCurrencyEnum } from '../../../apis-client'
import FacilityAutocomplete from '../shared/Autocomplete/FacilityAutocomplete'
import { AppState } from '../../../store'
import NewLocation from '../Locations/NewLocation'
import { addLocation } from '../../../services/places/actions'
import { createNewLocation } from '../../../services/thunks'
import { addMoveCost } from '../../../services/financials/actions'

const commonProps = {
  variant: 'outlined' as any,
  margin: 'dense' as any,
  size: 'small' as any,
  style: { minWidth: 160 },
}

interface SelectableTextFieldProps {
  label: string;
  options: any[];
  value: any;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  hasLabeledOptions?: boolean;
  disabled?: boolean;
}

const SelectableTextField = ({ label, options, value, onChange, hasLabeledOptions, disabled }: SelectableTextFieldProps) => (
  <TextField
    id="outlined-select-container-size"
    select
    label={label}
    value={value}
    onChange={onChange}
    disabled={disabled || false}
    {...commonProps}
  >
    {options.map((option) => (
      <MenuItem key={hasLabeledOptions ? option.value : option} value={hasLabeledOptions ? option.value : option}>
        {hasLabeledOptions ? option.label : option}
      </MenuItem>
    ))}
  </TextField>
)

interface NewMoveCostDialogProps {
  moveId: string;
  handleClose: () => void;
  handleCreate: (move: MoveCostInput) => void;
}

const NewMoveCostDialog = ({ moveId, handleClose, handleCreate }: NewMoveCostDialogProps) => {
  // const [availabilityDate, setAvailabilityDate] = useState<Date | null>(new Date())
  const [newMoveCost, setNewMoveCost] = useState<MoveCostInput>({
    moveId: moveId,
    cost: 0,
    currency: MoveCostInputCurrencyEnum.Eur,
    reason: '',
  })
  const _dispatch = useDispatch()

  const currencies = [
    MoveCostInputCurrencyEnum.Eur,
    MoveCostInputCurrencyEnum.Usd,
    MoveCostInputCurrencyEnum.Chf,
  ]

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.stopPropagation()
    event.preventDefault()

    if (newMoveCost.cost === 0) {
      _dispatch(showWarning(['Need to set cost']))
    } else {
      handleCreate({
        ...newMoveCost,
      })
    }
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string) => {
    setNewMoveCost({
      ...newMoveCost,
      [key]: event.target.value,
    })
  }

  return (
    <Dialog open={true} maxWidth={'sm'} fullWidth onClose={handleClose} >
      <DialogTitle>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography variant={'h6'}>New Move Cost</Typography>
          {/* { loadingDepots && <CircularProgress sx={{ marginLeft: '16px' }} size={20} /> } */}
          <Box justifyContent={'flex-end'}>
            <IconButton size='small' onClick={handleClose}><ClearIcon/></IconButton>
          </Box>
        </Box>
        </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
            <Box display='flex' flexDirection='column' >
              <TextField inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} required {...commonProps} label="Cost" value={newMoveCost.cost} onChange={e => handleChange(e, 'cost')} />
              <TextField required {...commonProps} label="Reason" value={newMoveCost.reason} onChange={e => handleChange(e, 'reason')} />
              <SelectableTextField
                label={'Currency'}
                options={currencies}
                value={newMoveCost.currency}
                onChange={e => handleChange(e, 'currency')}
              />
            </Box>
        </DialogContent>
        <DialogActions>
          {/* <Button color='primary' onClick={handleClose}>Close</Button> */}
          <Button color='primary' variant='contained' type='submit' >Create</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

interface NewMoveCostProps extends BoxProps {
  moveId: string;
  // onCreate: (container: MoveCostInput) => void
}

const NewMoveCost = ({ moveId, ...boxProps }: NewMoveCostProps) => {
  const [open, setOpen] = useState(false)

  const _dispatch = useDispatch()

  const onCreate = (cost: MoveCostInput) => {
    _dispatch(addMoveCost(cost))
  }

  const handleCreate = (move: MoveCostInput) => {
    setOpen(false)
    onCreate({
      ...move,
    })
  }

  return (
    <Box {...boxProps} >
      {/* <Button variant='contained' color='primary' size='small' disabled={false} onClick={() => setOpen(true)}>
        New Move Cost
      </Button> */}
      <IconButton size='small' color='primary' onClick={() => setOpen(true)}>
        <AttachMoneyIcon />
      </IconButton>
      { open && <NewMoveCostDialog moveId={moveId} handleClose={() => setOpen(false)} handleCreate={handleCreate}/>}
    </Box>
  )
}

export default NewMoveCost
