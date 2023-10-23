import React, { useState } from 'react'
import { Paper, PaperProps, TextField, Autocomplete, Box, Button } from '@mui/material'
import { useSelector } from 'react-redux'

import { AppState } from '../../../../store'

const CustomPaper = (props: PaperProps) => {
  return <Paper elevation={8} {...props} />
}

interface AddressAutocompleteProps {
  label?: string;
  multiple?: boolean;
  callback: (depots: string | string[]) => void;
  disabled?: boolean;
  defaultValue?: string[];
  value?: string;
  controlled?: boolean;
  required?: boolean;
}

const AddressAutocomplete = ({ controlled, value, label, multiple, callback, disabled, defaultValue, required }: AddressAutocompleteProps) => {
  const { addresses } = useSelector((state: AppState) => state.places)
  const [_value, setValue] = useState<string[] | undefined>(value ? [value] : undefined)
  const loading = false

  const options = addresses.map(d => ({
    label: d.name || d.addressId,
    id: d.addressId,
  }))

  // const options = optionsCountries

  return (
    <Autocomplete
      disabled={disabled}
      id="depot-id-input"
      // freeSolo
      loading={loading}
      multiple={multiple}
      size='small'
      disableCloseOnSelect={multiple}
      getOptionLabel={(a) => a.label}
      isOptionEqualToValue={(a) => options.find(o => o.id === a.id) !== undefined}
      options={options as any[]}
      PaperComponent={CustomPaper}
      {...controlled && { value: options.find(o => o.id === value) || null }}
      clearOnBlur
      renderInput={(params) => (
        <TextField {...params} required={required} fullWidth label={label || 'Address ID'} margin='dense' variant="outlined" />
      )}
      onChange={(event, value) => {
        if (controlled) {
          if (multiple) setValue((value as any[]).map(e => e.id))
          else setValue(value ? (value as any).id : undefined)
        }
        return value && multiple
          ? callback((value as any[]).map(e => e.id))
          : callback(value ? (value as any).id : undefined)
      }}
      defaultValue={defaultValue ? options.filter(d => defaultValue?.includes(d.id)) : undefined}
    />
  )
}

export default AddressAutocomplete
