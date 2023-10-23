import React, { useState } from 'react'
import { Paper, PaperProps, TextField, Autocomplete, Box, Button, TextFieldProps } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'

import { getAutocompleteDepots } from '../../../../services/autocomplete/actions'
import { addLocation, listFacilities } from '../../../../services/places/actions'
import { AppState } from '../../../../store'
import NewLocation from '../../Locations/NewLocation'
import { ExchangeLocationInput } from '../../../../apis-client'

const CustomPaper = (props: PaperProps) => {
  return <Paper elevation={8} {...props} />
}

interface FacilityAutocompleteProps {
  label?: string;
  multiple?: boolean;
  TextFieldProps?: TextFieldProps;
  callback: (depots: string | string[]) => void;
  disabled?: boolean;
  defaultValue?: string | string[];
  isLocationsAutocomplete?: boolean;
  value?: string | string[];
  required?: boolean;
}

const FacilityAutocomplete = ({ value, label, multiple, callback, disabled, defaultValue, isLocationsAutocomplete, required, TextFieldProps }: FacilityAutocompleteProps) => {
  const { facilities, locations /*, isLoading */ } = useSelector((state: AppState) => state.places)
  const [_value, setValue] = useState<string | string[] | undefined>(value || undefined)
  const loading = false
  const _dispatch = useDispatch()

  const isControlled = value !== undefined

  const type2color = new Map([
    ['BOCR', '#d64933'], // Border crossing
    ['CULO', '#9e0d0a'], // Customer location
    ['COFS', '#d64933'], // Container freight station
    ['COYA', '#d64933'], // Container yard
    ['DEPO', '#003068'], // Depot
    ['INTE', '#d64933'], // Inland terminal
    ['POTE', '#d64933'], // Port terminal
    ['PBST', '#d64933'], // Pilot boarding station
  ])

  const optionsDeps = facilities.map(d => ({
    label: d.address?.city.name + ', ' + d.name,
    id: d.facilityId,
    type: d.type,
    color: type2color.get(d.type) || undefined,
  }))

  const optionsLocs = locations.map(d => ({
    label: d.name,
    id: d.exchangeLocationId,
    type: undefined,
    color: undefined,
  }))

  const options: {label: string; id: string; type?: string, color?: string}[] = isLocationsAutocomplete ? optionsLocs : optionsDeps

  const handleCreateLocation = (location: ExchangeLocationInput) => {
    _dispatch(addLocation(location))
  }

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
      isOptionEqualToValue={(a, v) => v !== undefined && v.id === a.id}
      options={options as any[]}
      PaperComponent={CustomPaper}
      {...isControlled && { value: options.find(o => o.id === _value) || null }}
      // {...value && { value: options.find(o => o.id === value) || null }}
      clearOnBlur
      renderInput={(params) => (
        <TextField
          {...params}
          required={required === undefined ? true : required}
          fullWidth
          label={label || 'Facility ID'}
          margin='dense'
          variant="outlined"
          {...TextFieldProps}
        />
      )}
      renderOption={(props, option) => (
        <Box component='li' {...props}>
          {option.type && (
            <Box component='span' sx={{
              background: option.color || 'gray',
              color: 'white',
              borderRadius: '5px',
              // border: 1px solid black,
              fontSize: 10,
              padding: '3px',
              marginRight: '3px',
            }}>{option.type}</Box>
          )}
          <span>{option.label}</span>
        </Box>
      )}
      // onInputChange={(_, newInputValue) => _dispatch(listDepots({ nameStartsWith: newInputValue }))}
      onChange={(event, value) => {
        if (isControlled) {
          if (multiple) setValue((value as any[]).map(e => e.id))
          else setValue(value ? (value as any).id : undefined)
        }
        return value && multiple
          ? callback((value as any[]).map(e => e.id))
          : callback(value ? (value as any).id : undefined)
      }}
      defaultValue={defaultValue ? options.filter(d => defaultValue?.includes(d.id)) : undefined}
      // onClose={(event) => { console.log(event) }}
      // onInputChange={(event, value, reason) => {
      //   console.log(event, value, reason)
      // }}
      // open={open}
      // onOpen={openPopper}
      // onClose={closePopper} 
      // noOptionsText={isLocationsAutocomplete
      //   ? (
      //   <Box onClick={(event) => {
      //     event.stopPropagation()
      //     event.preventDefault()

      //     console.log('-------_>', event)
      //   }}
      //   onMouseDown={event => {
      //     event.preventDefault()
      //     event.stopPropagation()
      //   }}
      //   display="flex" justifyContent="space-between" alignItems="center">
      //     Location not available
      //     {/* <Button
      //       variant="outlined"
      //       color="primary"
      //       onClick={() => { console.log('Add new color') }}
      //     >
      //     Add New Location
      //     </Button> */}
      //     <NewLocation isNotDialog={true} name={undefined} onCreate={handleCreateLocation} />
      //   </Box>
      //     )
      //   : (<Box display="flex" justifyContent="space-between" alignItems="center">Sorry no depot</Box>)
      //   }
    />
  )
}

export default FacilityAutocomplete
