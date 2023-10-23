/* eslint-disable no-useless-escape */
import React, { FormEvent, useState } from 'react'
import {
  Box,
  BoxProps,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import { useDispatch } from 'react-redux'
import DeleteIcon from '@mui/icons-material/Delete'

import Typography from '../Utils/Typography'
import { deleteLease } from '../../../services/lease/actions'

interface DeleteOrderDialogProps {
  orderId: string;
  handleClose: () => void;
  handleDelete: () => void;
}

const DeleteOrderDialog = ({ handleClose, handleDelete }: DeleteOrderDialogProps) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.stopPropagation()
    event.preventDefault()
    handleDelete()
  }

  return (
    <Dialog open={true} maxWidth={'sm'} fullWidth onClose={handleClose} >
      <DialogTitle>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography variant={'h6'}>Are you sure you want to delete that order?</Typography>
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
          <Button color='primary' variant='contained' type='submit' >Delete</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

interface DeleteOrderProps extends BoxProps {
  orderId: string;
  disabled?: boolean
}

const DeleteOrder = ({ orderId, disabled, ...boxProps }: DeleteOrderProps): JSX.Element => {
  const [open, setOpen] = useState(false)

  const _dispatch = useDispatch()

  const onDelete = (orderId: string) => {
    _dispatch(deleteLease(orderId))
  }

  const handleDelete = () => {
    setOpen(false)
    onDelete(orderId)
  }

  return (
    <Box {...boxProps}>
      <Tooltip title={disabled ? 'Containers allocated to this order' : 'Delete order'}>
        <span>
          <IconButton disabled={disabled} size='small' onClick={() => setOpen(true)}>
            <DeleteIcon color={disabled ? 'disabled' : 'error'}/>
          </IconButton>
        </span>
      </Tooltip>
      { open && <DeleteOrderDialog orderId={orderId} handleClose={() => setOpen(false)} handleDelete={handleDelete}/>}
    </Box>
  )
}

export default DeleteOrder
