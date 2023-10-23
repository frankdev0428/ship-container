import React, { useEffect, useState } from 'react'
import { Paper, PaperProps, TextField, Autocomplete, Box, Button } from '@mui/material'
import { useSelector } from 'react-redux'

import { AppState } from '../../../../store'

const CustomPaper = (props: PaperProps) => {
  return <Paper elevation={8} {...props} />
}

interface CountryAutocompleteProps {
  label?: string;
  multiple?: boolean;
  callback: (depots: string | string[]) => void;
  callbackCountryCode?: (depots: string | string[] | undefined) => void;
  disabled?: boolean;
  defaultValue?: string[];
  value?: string;
  controlled?: boolean;
}

const CountryAutocomplete = ({ controlled, value, label, multiple, callback, callbackCountryCode, disabled, defaultValue }: CountryAutocompleteProps) => {
  const { countries } = useSelector((state: AppState) => state.places)
  const [_value, setValue] = useState<string[] | undefined>(value ? [value] : undefined)
  const loading = false

  const optionsCountries = countries.map(d => ({
    label: d.name,
    id: d.countryId,
    code: d.code,
  }))

  const options = optionsCountries

  useEffect(() => {
    setValue(value ? [value] : undefined)
    if (callbackCountryCode && value) callbackCountryCode(options.find(o => value === o.id)?.code)
  }, [value])

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
      options={options}
      PaperComponent={CustomPaper}
      // {...controlled && { value: options.find(o => o.id === value) || null }}
      {...controlled && { value: options.find(o => _value?.includes(o.id)) || null }}
      // {...controlled && { inputValue: options.find(o => o.id === value)?.label || '' }}
      clearOnBlur
      renderInput={(params) => (
        <TextField {...params} required fullWidth label={label || 'Country ID'} margin='dense' variant="outlined" />
      )}
      // onInputChange={(event, newInputValue) => {
      //   console.log('--------- newInputValue', newInputValue)
      //   if (callbackCountryCode) {
      //     const c2 = multiple
      //       ? callbackCountryCode((value as any[]).map(e => e.code))
      //       : callbackCountryCode(value ? (value as any).code : undefined)
      //   }
      // }}
      onChange={(event, value) => {
        if (controlled) {
          if (multiple) setValue((value as any[]).map(e => e.id))
          else setValue(value ? (value as any).id : undefined)
        }
        if (callbackCountryCode) {
          const c2 = multiple
            ? callbackCountryCode((value as any[]).map(e => e.code))
            : callbackCountryCode(value ? (value as any).code : undefined)
        }
        return value && multiple
          ? callback((value as any[]).map(e => e.id))
          : callback(value ? (value as any).id : undefined)
      }}
      // defaultValue={defaultValue ? options.filter(d => defaultValue?.includes(d.id)) : undefined}
    />
  )
}

export default CountryAutocomplete
