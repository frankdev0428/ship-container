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
  Popper,
  Popover,
} from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import { useDispatch, useSelector } from 'react-redux'

import { LabeledDatePicker } from '../shared/LabeledDatePicker'
import Typography from '../Utils/Typography'
import { showError } from '../../../store/error/actions'
import { EquipmentMoveInput, EquipmentMoveInputMoveTypeEnum, ExchangeLocationInput } from '../../../apis-client'
import FacilityAutocomplete from '../shared/Autocomplete/FacilityAutocomplete'
import { AppState } from '../../../store'
import { Facility } from '../../../services/places/types'

const commonProps = {
  variant: 'outlined' as any,
  margin: 'dense' as any,
  size: 'small' as any,
  style: { minWidth: 160 },
}

interface NewLocationDialogProps {
  name?: string;
  handleClose: () => void;
  handleCreate: (location: ExchangeLocationInput) => void;
  isNotDialog?: boolean;
}

const NewLocationDialog = ({ name, handleClose, handleCreate, isNotDialog }: NewLocationDialogProps) => {
  // const [availabilityDate, setAvailabilityDate] = useState<Date | null>(new Date())
  const [newLocation, setNewLocation] = useState<ExchangeLocationInput>({
    name: name || '',
    depotId: undefined,
    addressId: undefined,
    locationId: undefined,
  })
  // const { companies, loadingStatus } = useSelector((state: AppState) => state.company)

  const _dispatch = useDispatch()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.stopPropagation()
    event.preventDefault()

    if (newLocation.name === '') {
      _dispatch(showError(['Need to input move ID']))
    } else {
      handleCreate({
        ...newLocation,
      })
    }
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string) => {
    setNewLocation({
      ...newLocation,
      [key]: event.target.value,
    })
  }

  const isDialog = isNotDialog ? !isNotDialog : true

  return isDialog
    ? (
    <Dialog open={true} maxWidth={'sm'} fullWidth onClose={handleClose} >
      <DialogTitle>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography variant={'h6'}>New Location</Typography>
          {/* { loadingDepots && <CircularProgress sx={{ marginLeft: '16px' }} size={20} /> } */}
          <Box justifyContent={'flex-end'}>
            <IconButton size='small' onClick={handleClose}><ClearIcon/></IconButton>
          </Box>
        </Box>
        </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
            <Box display='flex' flexDirection='column' >
              {/* <TextField required {...commonProps} label="Container Id" value={newLocation.equipmentId} onChange={e => handleChange(e, 'equipmentId')} /> */}
              <TextField required {...commonProps} label="Name" value={newLocation.name} onChange={e => handleChange(e, 'name')} />
              <FacilityAutocomplete required={false} label={'Depot'} callback={(depot) => setNewLocation({
                ...newLocation,
                depotId: depot as string,
              })}/>
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
      <form onSubmit={handleSubmit}>
        <Box display='flex' flexDirection='column' >
          {/* <TextField required {...commonProps} label="Container Id" value={newLocation.equipmentId} onChange={e => handleChange(e, 'equipmentId')} /> */}
          <TextField required {...commonProps} label="Name" value={newLocation.name} onChange={e => handleChange(e, 'name')} />
          <FacilityAutocomplete required={false} label={'Depot'} callback={(depot) => setNewLocation({
            ...newLocation,
            depotId: depot as string,
          })}/>
        </Box>
        <Button color='primary' variant='contained' type='submit' >Create</Button>
      </form>
      )
}

interface NewLocationProps {
  name?: string;
  onCreate: (location: ExchangeLocationInput) => void;
  isNotDialog?: boolean;
  label?: string;
}

const NewLocation = ({ label, name, onCreate, isNotDialog }: NewLocationProps) => {
  const [open, setOpen] = useState(false)
  const [bla, setBla] = useState<any>(null)

  const handleCreate = (location: ExchangeLocationInput) => {
    setOpen(false)
    onCreate({
      ...location,
    })
  }

  const isDialog = isNotDialog ? !isNotDialog : true

  return isDialog
    ? (
      <Box ml={2} >
        <Button variant='contained' color='primary' size='small' disabled={false} onClick={() => setOpen(true)}>
          New Location
        </Button>
        { open && <NewLocationDialog name={name} isNotDialog={isNotDialog} handleClose={() => setOpen(false)} handleCreate={handleCreate}/>}
      </Box>
      )
    : (
      <Box ml={2} >
        <Button variant='contained' color='primary' size='small' disabled={false}
          onClick={(event) => {
            setOpen(true)
            setBla(event.currentTarget)
          }}
        >
          {label || 'New Location'}
        </Button>
        <Popover open={open} anchorEl={bla} onClose={() => setOpen(false)}>
          <NewLocationDialog name={name} isNotDialog={isNotDialog} handleClose={() => setOpen(false)} handleCreate={handleCreate}/>
        </Popover>
        {/* <NewLocationDialog name={name} isNotDialog={isNotDialog} handleClose={() => setOpen(false)} handleCreate={handleCreate}/> */}
      </Box>
      )
}

export default NewLocation
