import React, { useEffect, useState } from 'react'
import { Paper, PaperProps, TextField, Box, Button, TextFieldProps } from '@mui/material'
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete'
import { useDispatch, useSelector } from 'react-redux'

import { listAelerBoards, listNexxiotBoards } from '../../../services/boards/actions'
import { AppState } from '../../../store'
import { listBoards } from '../../../services/thunks'
import { BoardSourceEnum } from '../../../services/equipment/types'

const CustomPaper = (props: PaperProps) => {
  return <Paper elevation={8} {...props} />
}

interface BoardsPickerProps {
  label?: string
  // multiple?: boolean;
  callback: (boards: string) => void
  disabled?: boolean
  defaultValue?: string
  isLocationsAutocomplete?: boolean
  value?: string
  required?: boolean
  type?: BoardSourceEnum
  textFieldProps?: TextFieldProps
}

const BoardsPicker = ({ value, label, callback, disabled, defaultValue, isLocationsAutocomplete, required, type, textFieldProps }: BoardsPickerProps) => {
  const { boards /*, isLoading */ } = useSelector((state: AppState) => state.boards)
  const [_value, setValue] = useState<string | undefined>(value || undefined)
  const loading = false
  const _dispatch = useDispatch()

  // useEffect(() => {
  //   boards?.length === 0 && _dispatch(listBoards())
  // }, boards)

  const isControlled = value !== undefined

  const type2color = new Map([
    [BoardSourceEnum.Aeler, '#003068'],
    [BoardSourceEnum.Kizy, '#e02b20'],
    [BoardSourceEnum.Nexxiot, '#9e0d0a'],
    [BoardSourceEnum.Most, '#173661'],
  ])

  const options = boards.map((b) => ({
    label: b.boardId,
    id: b.boardId,
    type: b.provider,
    color: type2color.get(b.provider as any) || undefined,
  })).filter((b) => (type ? b.type === type : true))

  // const handleCreateLocation = (location: ExchangeLocationInput) => {
  //   _dispatch(addLocation(location))
  // }

  const filterOptions = createFilterOptions<{
    label: string
    id: string
    type?: string
    color?: string
  }>({
    limit: 50, // to prevent massive render of all options...
  })

  return (
    <Autocomplete
      filterOptions={filterOptions}
      disabled={disabled}
      id="depot-id-input"
      // freeSolo
      loading={loading}
      // multiple={multiple}
      size='small'
      // disableCloseOnSelect={multiple}
      getOptionLabel={(a) => a.label}
      isOptionEqualToValue={(a) => options.find((o) => o.id === a.id) !== undefined}
      options={options}
      PaperComponent={CustomPaper}
      value={options.find((o) => o.id === _value) || null}
      clearOnBlur
      renderInput={(params) => (
        <TextField
          {...params}
          required={required === undefined ? true : required}
          fullWidth
          label={label || 'Device ID'}
          margin="dense"
          variant="outlined"
          {...textFieldProps}
        />
      )}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          {option.type && (
            <Box component='span' sx={{
              background: option.color || 'gray',
              color: 'white',
              borderRadius: '5px',
              // border: 1px solid black,
              fontSize: 10,
              padding: '3px',
              marginRight: '3px',
            }}
            >
              {option.type}
            </Box>
          )}
          <span>{option.label}</span>
        </Box>
      )}
      // onInputChange={(_, newInputValue) => _dispatch(listDepots({ nameStartsWith: newInputValue }))}
      onChange={(event, value) => {
        // if (isControlled) {
        setValue(value ? (value as any).id : undefined)
        // }
        return callback(value ? (value as any).id : undefined)
      }}
      // defaultValue={defaultValue ? options.filter(d => defaultValue?.includes(d.id)) : undefined}
    />
  )
}

export default BoardsPicker
