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
import { archiveAelerBoard } from '../../../services/boards/actions'

interface DeleteBoardDialogProps {
  boardId: string;
  handleClose: () => void;
  handleDelete: (boardId: string) => void;
}

const DeleteBoardDialog = ({ boardId, handleClose, handleDelete }: DeleteBoardDialogProps) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.stopPropagation()
    event.preventDefault()
    handleDelete(boardId)
  }

  return (
    <Dialog open={true} maxWidth={'sm'} fullWidth onClose={handleClose} >
      <DialogTitle>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography variant={'h6'}>Archive Board</Typography>
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

interface DeleteBoardProps extends BoxProps {
  boardId: string;
  disabled?: boolean
}

const DeleteBoard = ({ boardId, disabled, ...boxProps }: DeleteBoardProps): JSX.Element => {
  const [open, setOpen] = useState(false)

  const _dispatch = useDispatch()

  const onDelete = (boardId: string) => {
    _dispatch(archiveAelerBoard(boardId))
  }

  const handleDelete = (boardId: string) => {
    setOpen(false)
    onDelete(boardId)
  }

  return (
    <Box {...boxProps}>
      <Tooltip title={disabled ? 'Board paired to a container' : 'Delete board'}>
        <span>
          <IconButton disabled={disabled} size='small' onClick={() => setOpen(true)}>
            <DeleteIcon color={disabled ? 'disabled' : 'error'}/>
          </IconButton>
        </span>
      </Tooltip>
      { open && <DeleteBoardDialog boardId={boardId} handleClose={() => setOpen(false)} handleDelete={handleDelete}/>}
    </Box>
  )
}

export default DeleteBoard
