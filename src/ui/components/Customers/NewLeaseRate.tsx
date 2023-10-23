/* eslint-disable no-useless-escape */
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
import { LeaseRateInput, LeaseRateInputCurrencyEnum } from '../../../apis-client'
import { addLeaseRate } from '../../../services/financials/actions'

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

interface NewLeaseRateDialogProps {
  customerId: string;
  handleClose: () => void;
  handleCreate: (move: LeaseRateInput) => void;
}

const NewLeaseRateDialog = ({ customerId, handleClose, handleCreate }: NewLeaseRateDialogProps) => {
  // const [availabilityDate, setAvailabilityDate] = useState<Date | null>(new Date())
  const [newLeaseRate, setNewLeaseRate] = useState<LeaseRateInput>({
    customerId: customerId,
    validFrom: new Date(),
    dailyRate: 0,
    currency: LeaseRateInputCurrencyEnum.Eur,
    validUntil: undefined,
  })
  const _dispatch = useDispatch()

  const currencies = [
    LeaseRateInputCurrencyEnum.Eur,
    LeaseRateInputCurrencyEnum.Usd,
    LeaseRateInputCurrencyEnum.Chf,
  ]

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.stopPropagation()
    event.preventDefault()

    if (newLeaseRate.dailyRate === 0) {
      _dispatch(showWarning(['Need to set cost']))
    } else {
      handleCreate({
        ...newLeaseRate,
      })
    }
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string) => {
    setNewLeaseRate({
      ...newLeaseRate,
      [key]: event.target.value,
    })
  }

  return (
    <Dialog open={true} maxWidth={'sm'} fullWidth onClose={handleClose} >
      <DialogTitle>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography variant={'h6'}>New Lease Rate</Typography>
          {/* { loadingDepots && <CircularProgress sx={{ marginLeft: '16px' }} size={20} /> } */}
          <Box justifyContent={'flex-end'}>
            <IconButton size='small' onClick={handleClose}><ClearIcon/></IconButton>
          </Box>
        </Box>
        </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
            <Box display='flex' flexDirection='column' >
              <TextField inputProps={{ inputMode: 'numeric', pattern: '[0-9\.]*' }} required {...commonProps} label="Rate" value={newLeaseRate.dailyRate} onChange={e => handleChange(e, 'dailyRate')} />
              {/* <TextField required {...commonProps} label="Reason" value={newLeaseRate.reason} onChange={e => handleChange(e, 'reason')} /> */}
              <SelectableTextField
                label={'Currency'}
                options={currencies}
                value={newLeaseRate.currency}
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

interface NewLeaseRateProps extends BoxProps {
  customerId: string;
  // onCreate: (container: LeaseRateInput) => void
}

const NewLeaseRate = ({ customerId, ...boxProps }: NewLeaseRateProps) => {
  const [open, setOpen] = useState(false)

  const _dispatch = useDispatch()

  const onCreate = (cost: LeaseRateInput) => {
    _dispatch(addLeaseRate(cost))
  }

  const handleCreate = (move: LeaseRateInput) => {
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
      { open && <NewLeaseRateDialog customerId={customerId} handleClose={() => setOpen(false)} handleCreate={handleCreate}/>}
    </Box>
  )
}

export default NewLeaseRate
