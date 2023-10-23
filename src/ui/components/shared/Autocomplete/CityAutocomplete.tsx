import React, { useEffect, useState } from 'react'
import { Paper, PaperProps, TextField, Autocomplete, Box, Button } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'

import { AppState } from '../../../../store'
import { listCities } from '../../../../services/places/actions'

const CustomPaper = (props: PaperProps) => {
  return <Paper elevation={8} {...props} />
}

interface CityAutocompleteProps {
  label?: string;
  multiple?: boolean;
  callback: (depots: string | string[]) => void;
  callbackCityCode?: (depots: string | string[] | undefined) => void;
  disabled?: boolean;
  defaultValue?: string[];
  value?: string;
  controlled?: boolean;
  countryId?: string;
}

const CityAutocomplete = ({ controlled, value, label, multiple, callback, callbackCityCode, disabled, defaultValue, countryId }: CityAutocompleteProps) => {
  const { cities } = useSelector((state: AppState) => state.places)
  const [_value, setValue] = useState<string[] | undefined>(value ? [value] : undefined)
  const loading = false

  const optionsCities = cities.map(d => ({
    label: d.name,
    id: d.cityId,
    code: d.identifiers_iso3,
  }))

  const options = optionsCities

  useEffect(() => {
    setValue(value ? [value] : undefined)
    if (value) _dispatch(listCities(undefined, undefined, value))
    if (callbackCityCode && value) callbackCityCode(options.find(o => value === o.id)?.code)
  }, [value])

  useEffect(() => {
    if (callbackCityCode && value) callbackCityCode(options.find(o => value === o.id)?.code)
  }, [optionsCities])

  const _dispatch = useDispatch()

  console.log(value, _value)

  return (
    <Autocomplete
      disabled={disabled}
      id="depot-id-input"
      freeSolo
      loading={loading}
      multiple={multiple}
      size='small'
      disableCloseOnSelect={multiple}
      getOptionLabel={(a) => a.label}
      isOptionEqualToValue={(a) => options.find(o => o.id === a.id) !== undefined}
      options={options as any[]}
      PaperComponent={CustomPaper}
      // {...controlled && { value: options.find(o => o.id === value) || null }}
      {...controlled && { value: options.find(o => _value?.includes(o.id)) || null }}
      clearOnBlur
      renderInput={(params) => (
        <TextField {...params} required fullWidth label={label || 'City ID'} margin='dense' variant="outlined" />
      )}
      onChange={(event, value) => {
        if (controlled) {
          if (multiple) setValue((value as any[]).map(e => e.id))
          else setValue(value ? (value as any).id : undefined)
        }
        if (callbackCityCode) {
          const c2 = multiple
            ? callbackCityCode((value as any[]).map(e => e.code))
            : callbackCityCode(value ? (value as any).code : undefined)
        }
        return value && multiple
          ? callback((value as any[]).map(e => e.id))
          : callback(value ? (value as any).id : undefined)
      }}
      defaultValue={defaultValue ? options.filter(d => defaultValue?.includes(d.id)) : undefined}
      onInputChange={(_, newInputValue) => {
        if (newInputValue.length < 3) { return null } else { _dispatch(listCities(newInputValue, countryId)) }
      }}
    />
  )
}

export default CityAutocomplete
