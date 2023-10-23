/* eslint-disable no-useless-escape */
import React, { ChangeEvent, useState } from 'react'
import {
  MenuItem,
  TextField,
} from '@mui/material'

import { CurrencyEnum } from '../../../../services/financials/types'

const commonProps = {
  variant: 'outlined' as any,
  margin: 'dense' as any,
  size: 'small' as any,
  // style: { minWidth: 160 },
  style: { marginTop: 4, marginBottom: 0 },
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
    fullWidth
    {...commonProps}
  >
    {options.map((option) => (
      <MenuItem key={hasLabeledOptions ? option.value : option} value={hasLabeledOptions ? option.value : option}>
        {hasLabeledOptions ? option.label : option}
      </MenuItem>
    ))}
  </TextField>
)
const currencies = [
  CurrencyEnum.Eur,
  CurrencyEnum.Usd,
  CurrencyEnum.Chf,
]

interface CurrencyPickerProps {
  currency: CurrencyEnum;
  setCurrency: (c: CurrencyEnum) => void;
}

const CurrencyPicker = ({ currency, setCurrency }: CurrencyPickerProps) => {
  const [_currency, _setCurrency] = useState<CurrencyEnum>(currency)

  const handleChangeInput = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string) => {
    _setCurrency(event.target.value as any)
    setCurrency(event.target.value as any)
  }

  return (
    <SelectableTextField
      label={'Currency'}
      options={currencies}
      value={_currency}
      onChange={e => handleChangeInput(e, 'currency')}
    />
  )
}

export default CurrencyPicker
