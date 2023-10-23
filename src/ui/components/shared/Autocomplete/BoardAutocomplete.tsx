import React from 'react'
import { Paper, PaperProps, TextField, Autocomplete } from '@mui/material'
import { useSelector } from 'react-redux'

import { AppState } from '../../../../store'

interface BoardAutocompleteProps {
  boardSource?: string | null;
  disabled?: boolean;
  multiple?: boolean;
  label?: string;
  defaultValue?: string[];
  required?: boolean,
  onChange: (key: string) => void
}

const BordAutocomplete = ({ boardSource, disabled, multiple, label, defaultValue, required, onChange }: BoardAutocompleteProps): JSX.Element => {
  const boards = useSelector((state: AppState) => state.boards.boards)
  const { loadingStatusAeler, loadingStatusContainerId, loadingStatusKizy, loadingStatusNexxiot } = useSelector((state: AppState) => state.boards)

  const loadingBoards = loadingStatusAeler || loadingStatusContainerId || loadingStatusKizy || loadingStatusNexxiot

  const boardOptions = boards.filter(b => b.provider === boardSource).map(b => ({ value: b.boardId, label: b.boardId }))

  const options = boardOptions

  return (
    <Autocomplete
      disabled={disabled}
      id="board-id-input"
      freeSolo
      loading={loadingBoards}
      multiple={multiple}
      size='small'
      disableCloseOnSelect={multiple}
      getOptionLabel={(a) => a.label}
      isOptionEqualToValue={(a) => options.find(o => o.value === a.value) !== undefined}
      options={options as any[]}
      componentsProps={{ paper: { elevation: 8 } }}
      clearOnBlur
      renderInput={(params) => (
        <TextField {...params} required={required} fullWidth label={label || 'Board ID'} margin='dense' variant="outlined" />
      )}
      onChange={(e, v) => onChange(v.value)}
      defaultValue={defaultValue ? options.filter(d => defaultValue?.includes(d.value)) : undefined}
    />
  )
}

export default BordAutocomplete
