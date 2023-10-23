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
import { StorageRateInput } from '../../../apis-client'
import { addStorageRate } from '../../../services/financials/actions'
import { CurrencyEnum } from '../../../services/financials/types'

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

interface NewStorageRateDialogProps {
  depotId: string;
  handleClose: () => void;
  handleCreate: (move: StorageRateInput) => void;
}

const NewStorageRateDialog = ({ depotId, handleClose, handleCreate }: NewStorageRateDialogProps) => {
  // const [availabilityDate, setAvailabilityDate] = useState<Date | null>(new Date())
  const [newStorageRate, setNewStorageRate] = useState<StorageRateInput>({
    input: {
      depotId: depotId,
      validFrom: new Date(),
      currency: CurrencyEnum.Eur as any,
      validUntil: undefined,
    },
    dailyRate: {
      type: 'flat' as any,
      rateId: 'fixme',
      rate: 0,
    },
  })
  const _dispatch = useDispatch()

  const currencies = [
    CurrencyEnum.Eur,
    CurrencyEnum.Usd,
    CurrencyEnum.Chf,
  ]

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.stopPropagation()
    event.preventDefault()

    if (newStorageRate.dailyRate.rate === 0) {
      _dispatch(showWarning(['Need to set cost']))
    } else {
      handleCreate({
        ...newStorageRate,
        dailyRate: {
          ...newStorageRate.dailyRate,
          rate: parseFloat(newStorageRate.dailyRate.rate as any),
        },
      })
    }
  }

  const handleChangeInput = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string) => {
    setNewStorageRate({
      ...newStorageRate,
      input: {
        ...newStorageRate.input,
        [key]: event.target.value,
      },
    })
  }

  const handleChangeDailyRate = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string) => {
    setNewStorageRate({
      ...newStorageRate,
      dailyRate: {
        ...newStorageRate.dailyRate,
        rate: event.target.value as any,
      },
    })
  }

  return (
    <Dialog open={true} maxWidth={'sm'} fullWidth onClose={handleClose} >
      <DialogTitle>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography variant={'h6'}>New Storage Rate</Typography>
          {/* { loadingDepots && <CircularProgress sx={{ marginLeft: '16px' }} size={20} /> } */}
          <Box justifyContent={'flex-end'}>
            <IconButton size='small' onClick={handleClose}><ClearIcon/></IconButton>
          </Box>
        </Box>
        </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
            <Box display='flex' flexDirection='column' >
              <TextField inputProps={{
                inputMode: 'numeric',
                pattern: '[0-9\.]*',
              }} required {...commonProps} label="Rate" value={newStorageRate.dailyRate.rate} onChange={e => handleChangeDailyRate(e, 'dailyRate')} />
              {/* <TextField required {...commonProps} label="Reason" value={newStorageRate.reason} onChange={e => handleChange(e, 'reason')} /> */}
              <SelectableTextField
                label={'Currency'}
                options={currencies}
                value={newStorageRate.input.currency}
                onChange={e => handleChangeInput(e, 'currency')}
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

interface NewStorageRateProps extends BoxProps {
  depotId: string;
  // onCreate: (container: StorageRateInput) => void
}

const NewStorageRate = ({ depotId, ...boxProps }: NewStorageRateProps) => {
  const [open, setOpen] = useState(false)

  const _dispatch = useDispatch()

  const onCreate = (cost: StorageRateInput) => {
    _dispatch(addStorageRate(cost))
  }

  const handleCreate = (move: StorageRateInput) => {
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
      { open && <NewStorageRateDialog depotId={depotId} handleClose={() => setOpen(false)} handleCreate={handleCreate}/>}
    </Box>
  )
}

export default NewStorageRate
