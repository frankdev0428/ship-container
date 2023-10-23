import React, { ChangeEvent, FormEvent, useState } from 'react'
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  TextField,
  FormControlLabel,
  BoxProps,
  StandardTextFieldProps,
  Grid,
  Autocomplete,
} from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import { useDispatch } from 'react-redux'
import UpdateIcon from '@mui/icons-material/Edit'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'

import { LabeledDatePicker } from '../../shared/LabeledDatePicker'
import Typography from '../../Utils/Typography'
import { CurrentStatus, PatchEquipmentStatusInput } from '../../../../apis-client'
import { updateEquipmentStatus } from '../../../../services/equipment/actions'
import { updateStatus } from '../../../../services/thunks'
import FacilityAutocomplete from '../../shared/Autocomplete/FacilityAutocomplete'
import { CurrencyEnum } from '../../../../services/financials/types'

import CurrencyPicker from './CurrencyPicker'

const commonProps = {
  variant: 'outlined' as any,
  margin: 'dense' as any,
  size: 'small' as any,
  style: { marginTop: 4, marginBottom: 0 },
  fullWidth: true,
}

export interface CostRowDataProps {
  cost: number;
  currency: CurrencyEnum;
  invoicedAt?: Date;
  reason?: string;
  shouldUpdate?: boolean;
}

interface CostRowProps extends CostRowDataProps {
  onRemove: () => void;
  onUpdate: (cost: CostRowDataProps) => void;
  // onSubmit: () => void;
}

const reasons = [
  'Delivery',
  'Redelivery',
  'Cleaning',
]

const CostRow = ({ cost, currency, invoicedAt, reason, onRemove, onUpdate }: CostRowProps) => {
  // const [costUpdate, setCostUpdate] = useState<CostRowDataProps>({
  //   cost: cost,
  //   currency: currency,
  //   invoicedAt: invoicedAt,
  //   reason: reason,
  // })
  const costUpdate = {
    cost: cost,
    currency: currency,
    invoicedAt: invoicedAt,
    reason: reason,
  }
  const setCostUpdate = onUpdate
  const [reasonInput, setReasonInput] = useState(reason || '')

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string) => {
    const updated = {
      ...costUpdate,
      [key]: event.target.value,
      shouldUpdate: true,
    }
    setCostUpdate(updated)
  }

  const handleChangeReason = (e: any, reason: any) => {
    const updated = {
      ...costUpdate,
      reason: reason,
      shouldUpdate: true,
    }
    setCostUpdate(updated)
  }

  const handleChangeDate = (date: Date | null, key: string) => {
    const updated = {
      ...costUpdate,
      [key]: date,
      shouldUpdate: true,
    }
    setCostUpdate(updated)
  }

  return (
    <Box >
      <Grid container item spacing={1}>
        <Grid item xs={2}>
          <TextField {...commonProps}
            required
            label="Cost"
            type='number'
            inputProps={{ min: 0 }}
            value={costUpdate.cost}
            onChange={e => handleChange(e, 'cost')}
          />
        </Grid>
        <Grid item xs={2}>
          <CurrencyPicker
            currency={costUpdate.currency} setCurrency={(c: CurrencyEnum) => setCostUpdate({ ...costUpdate, currency: c, shouldUpdate: true })}
          />
        </Grid>
        <Grid item xs={3}>
          <LabeledDatePicker
            label="invoiced at"
            value={costUpdate.invoicedAt || null}
            onChange={date => handleChangeDate(date, 'invoicedAt')}
            textFieldProps={{
              style: { marginTop: 4, marginBottom: 0 },
            }}
          />
        </Grid>
        <Grid item xs={4}>
          {/* FIXME: add reasons there as free autocomplete */}
          <Autocomplete
            id="reason-input"
            freeSolo
            // getOptionLabel={(option) => typeof option !== 'string' ? option.name : '' }
            value={costUpdate.reason}
            onChange={handleChangeReason}
            onInputChange={(event, newInputValue) => {
              setReasonInput(newInputValue)
              handleChangeReason(undefined, newInputValue)
            }}
            inputValue={reasonInput}
            options={reasons}
            renderInput={(params) => (
              <TextField {...params} {...commonProps} label="Reason" margin="normal" variant="outlined" />
            )}
          />
        </Grid>
        <Grid>
          <IconButton size='small' onClick={onRemove}><RemoveCircleOutlineIcon/></IconButton>
        </Grid>
      </Grid>
    </Box>
  )
}

export default CostRow
