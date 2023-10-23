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
  Popover,
  OutlinedInput,
  Chip,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import { useDispatch } from 'react-redux'

import Typography from '../Utils/Typography'
import { showError } from '../../../store/error/actions'
import { Board } from '../../../services/boards/types'
import SelectPopper from '../Utils/SelectPopper'

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
  multiple?: boolean;
}

interface MultiSelectProps {
  label: string;
  options: any[];
  value: any;
  onChange: (e: SelectChangeEvent<any>) => void;
  hasLabeledOptions?: boolean;
  disabled?: boolean;
  multiple?: boolean;
}

const MultiSelect = ({ label, options, value, onChange, hasLabeledOptions, disabled, multiple }: MultiSelectProps) => (
  <FormControl>
    <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
      <Select
        labelId="demo-multiple-chip-label"
        id="demo-multiple-chip"
        multiple
        value={value}
        onChange={onChange}
        input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            {(selected as any[]).map((option) => (
              <Chip key={hasLabeledOptions ? option.value : option} label={hasLabeledOptions ? option.label : option} />
            ))}
          </Box>
        )}
        // MenuProps={MenuProps}
      >
        {options.map((option) => (
          <MenuItem key={hasLabeledOptions ? option.value : option} value={hasLabeledOptions ? option.value : option}>
            {hasLabeledOptions ? option.label : option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
)

interface NewBoardDialogProps {
  name?: string;
  handleClose: () => void;
  handleCreate: (board: Board) => void;
  isNotDialog?: boolean;
}

const NewBoardDialog = ({ name, handleClose, handleCreate, isNotDialog }: NewBoardDialogProps) => {
  const [newBoard, setNewBoard] = useState<Board>({
    boardId: '',
    provider: 'aeler',
    hasGps: false,
    hasShock: false,
    hasTempExt: false,
    hasTempInt: false,
    hasPressureExt: false,
    hasPressureInt: false,
    hasHumInt: false,
    hasHumExt: false,
    hasGases: false,
    hasLightInt: false,
    hasLightExt: false,
    hasDoor: false,
    hasRFID: false,
  })

  const providerOptions = [
    { value: 'nexxiot', label: 'Nexxiot', disabled: true },
    { value: 'aeler', label: 'Aeler', disabled: false },
    { value: 'kizy', label: 'Kizy', disabled: true },
    { value: 'most', label: 'Most', disabled: true },
  ]

  const _dispatch = useDispatch()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.stopPropagation()
    event.preventDefault()

    if (!newBoard.boardId) {
      _dispatch(showError(['Need to input move ID']))
    } else {
      handleCreate({
        ...newBoard as any /** FIXME */,
      })
    }
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string, isCheckbox?: boolean) => {
    setNewBoard({
      ...newBoard,
      [key]: isCheckbox ? (event.target as any).checked : event.target.value,
    })
  }

  const handlePickerChange = (key: string) => (value: string | null) => {
    setNewBoard({
      ...newBoard,
      [key]: value,
    })
  }

  const isDialog = isNotDialog ? !isNotDialog : true

  return isDialog
    ? (
    <Dialog open={true} maxWidth={'sm'} fullWidth onClose={handleClose} >
      <DialogTitle>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography variant={'h6'}>New Board</Typography>
          {/* { loadingDepots && <CircularProgress sx={{ marginLeft: '16px' }} size={20} /> } */}
          <Box justifyContent={'flex-end'}>
            <IconButton size='small' onClick={handleClose}><ClearIcon/></IconButton>
          </Box>
        </Box>
        </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
            <Box display='flex' flexDirection='column' >
              <SelectPopper
                label={'provider'}
                options={providerOptions}
                value={newBoard.provider}
                onChange={handlePickerChange('provider')}
              />
              <TextField required {...commonProps} label="Board ID" value={newBoard.boardId} onChange={e => handleChange(e, 'boardId')} />
              <FormControlLabel
                control={<Checkbox
                  color='primary'
                  checked={newBoard.hasGps}
                  // inputProps={{ 'aria-labelledby': labelId }}
                  onChange={(e) => handleChange(e, 'hasGps', true) }
                />}
                label={'hasGps'}
              />
               <FormControlLabel
                control={<Checkbox
                  color='primary'
                  checked={newBoard.hasShock}
                  // inputProps={{ 'aria-labelledby': labelId }}
                  onChange={(e) => handleChange(e, 'hasShock', true) }
                />}
                label={'hasShock'}
              />
               <FormControlLabel
                control={<Checkbox
                  color='primary'
                  checked={newBoard.hasTempExt}
                  // inputProps={{ 'aria-labelledby': labelId }}
                  onChange={(e) => handleChange(e, 'hasTempExt', true) }
                />}
                label={'hasTempExt'}
              />
               <FormControlLabel
                control={<Checkbox
                  color='primary'
                  checked={newBoard.hasTempInt}
                  // inputProps={{ 'aria-labelledby': labelId }}
                  onChange={(e) => handleChange(e, 'hasTempInt', true) }
                />}
                label={'hasTempInt'}
              />
               <FormControlLabel
                control={<Checkbox
                  color='primary'
                  checked={newBoard.hasPressureExt}
                  // inputProps={{ 'aria-labelledby': labelId }}
                  onChange={(e) => handleChange(e, 'hasPressureExt', true) }
                />}
                label={'hasPressureExt'}
              />
               <FormControlLabel
                control={<Checkbox
                  color='primary'
                  checked={newBoard.hasPressureInt}
                  // inputProps={{ 'aria-labelledby': labelId }}
                  onChange={(e) => handleChange(e, 'hasPressureInt', true) }
                />}
                label={'hasPressureInt'}
              />
               <FormControlLabel
                control={<Checkbox
                  color='primary'
                  checked={newBoard.hasGases}
                  // inputProps={{ 'aria-labelledby': labelId }}
                  onChange={(e) => handleChange(e, 'hasGases', true) }
                />}
                label={'hasGases'}
              />
               <FormControlLabel
                control={<Checkbox
                  color='primary'
                  checked={newBoard.hasLightInt}
                  // inputProps={{ 'aria-labelledby': labelId }}
                  onChange={(e) => handleChange(e, 'hasLightInt', true) }
                />}
                label={'hasLightInt'}
              />
               <FormControlLabel
                control={<Checkbox
                  color='primary'
                  checked={newBoard.hasLightExt}
                  // inputProps={{ 'aria-labelledby': labelId }}
                  onChange={(e) => handleChange(e, 'hasLightExt', true) }
                />}
                label={'hasLightExt'}
              />
               <FormControlLabel
                  control={<Checkbox
                  color='primary'
                  checked={newBoard.hasHumInt}
                  // inputProps={{ 'aria-labelledby': labelId }}
                  onChange={(e) => handleChange(e, 'hasHumInt', true) }
                />}
                label={'hasHumInt'}
              />
               <FormControlLabel
                control={<Checkbox
                  color='primary'
                  checked={newBoard.hasHumExt}
                  // inputProps={{ 'aria-labelledby': labelId }}
                  onChange={(e) => handleChange(e, 'hasHumExt', true) }
                />}
                label={'hasHumExt'}
              />
               <FormControlLabel
                control={<Checkbox
                  color='primary'
                  checked={newBoard.hasDoor}
                  // inputProps={{ 'aria-labelledby': labelId }}
                  onChange={(e) => handleChange(e, 'hasDoor', true) }
                />}
                label={'hasDoor'}
              />
               <FormControlLabel
                control={<Checkbox
                  color='primary'
                  checked={newBoard.hasRFID}
                  // inputProps={{ 'aria-labelledby': labelId }}
                  onChange={(e) => handleChange(e, 'hasRFID', true) }
                />}
                label={'hasRFID'}
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
    : (
      // <form onSubmit={handleSubmit}>
      //   <Box display='flex' flexDirection='column' >
      //     {/* <TextField required {...commonProps} label="Container Id" value={newBoard.equipmentId} onChange={e => handleChange(e, 'equipmentId')} /> */}
      //     <TextField required {...commonProps} label="Name" value={newBoard.name} onChange={e => handleChange(e, 'name')} />
      //     <FacilityAutocomplete label={'Depot'} callback={(board) => setNewBoard({
      //       ...newBoard,
      //       boardId: board as string,
      //     })}/>
      //   </Box>
      //   <Button color='primary' variant='contained' type='submit' >Create</Button>
      // </form>
      <React.Fragment></React.Fragment>
      )
}

interface NewBoardProps {
  name?: string;
  onCreate: (board: Board) => void;
  isNotDialog?: boolean;
  label?: string;
}

const NewBoard = ({ label, name, onCreate, isNotDialog }: NewBoardProps) => {
  const [open, setOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<any>(null)

  const handleCreate = (board: Board) => {
    setOpen(false)
    onCreate({
      ...board,
    })
  }

  const isDialog = isNotDialog ? !isNotDialog : true

  return isDialog
    ? (
      <Box ml={2} >
        <Button variant='contained' color='primary' size='small' disabled={false} onClick={() => setOpen(true)}>
          New Board
        </Button>
        { open && <NewBoardDialog name={name} isNotDialog={isNotDialog} handleClose={() => setOpen(false)} handleCreate={handleCreate}/>}
      </Box>
      )
    : (
      <Box ml={2} >
        <Button variant='contained' color='primary' size='small' disabled={false}
          onClick={(event) => {
            setOpen(true)
            setAnchorEl(event.currentTarget)
          }}
        >
          {label || 'New Board'}
        </Button>
        <Popover open={open} anchorEl={anchorEl}>
          <NewBoardDialog name={name} isNotDialog={isNotDialog} handleClose={() => setOpen(false)} handleCreate={handleCreate}/>
        </Popover>
      </Box>
      )
}

export default NewBoard
