/* eslint-disable no-useless-escape */
import React, { ChangeEvent, FormEvent, useState } from 'react'
import {
  Box,
  BoxProps,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import { useDispatch } from 'react-redux'
import DeleteIcon from '@mui/icons-material/Delete'

import Typography from '../Utils/Typography'
import { archiveFacility } from '../../../services/places/actions'

interface DeleteFacilityDialogProps {
  name?: string
  handleClose: () => void;
  handleDelete: () => void;
}

const DeleteFacilityDialog = ({ name, handleClose, handleDelete }: DeleteFacilityDialogProps) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.stopPropagation()
    event.preventDefault()
    handleDelete()
  }

  return (
    <Dialog open={true} maxWidth={'sm'} fullWidth onClose={handleClose} >
      <DialogTitle>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography variant={'h6'}>{`Archive Facility ${name}`}</Typography>
          {/* { loadingDepots && <CircularProgress sx={{ marginLeft: '16px' }} size={20} /> } */}
          <Box justifyContent={'flex-end'}>
            <IconButton size='small' onClick={handleClose}><ClearIcon/></IconButton>
          </Box>
        </Box>
        </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
        </DialogContent>
        <DialogActions>
          {/* <Button color='primary' onClick={handleClose}>Close</Button> */}
          <Button color='primary' variant='contained' type='submit' >Archive</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

interface DeleteFacilityProps extends BoxProps {
  facilityId: string;
  name?: string
}

const DeleteFacility = ({ facilityId, name, ...boxProps }: DeleteFacilityProps) => {
  const [open, setOpen] = useState(false)

  const _dispatch = useDispatch()

  const onDelete = (facilityId: string) => {
    _dispatch(archiveFacility(facilityId))
  }

  const handleDelete = () => {
    setOpen(false)
    onDelete(facilityId)
  }

  return (
    <Box {...boxProps} >
      <IconButton size='small' onClick={() => setOpen(true)}>
        <DeleteIcon color='error'/>
      </IconButton>
      { open && <DeleteFacilityDialog name={name} handleClose={() => setOpen(false)} handleDelete={handleDelete}/>}
    </Box>
  )
}

export default DeleteFacility
