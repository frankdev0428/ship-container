import React, { FormEvent, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  BoxProps,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
} from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'

import { showWarning } from '../../../../../store/error/actions'
import Typography from '../../../Utils/Typography'
import { BoardSourceEnum, ContainerBoardPairingProfilePostInput } from '../../../../../services/equipment/types'
import { postBoardProfile } from '../../../../../services/thunks'
import { AppState } from '../../../../../store'
import { isValidDate } from '../../../shared/utils'
import PairingBoardProfiles, { BoardProfile } from '../../NewContainer/PairingBoardProfiles'

import { StyledDialogActions } from './DeleteBoardProfile'

interface NewBoardProfileDialogProps {
  containerId: string
  handleClose: () => void;
  handleCreate: (board: ContainerBoardPairingProfilePostInput) => void;
}

const NewBoardProfileDialog = ({ containerId, handleClose, handleCreate }: NewBoardProfileDialogProps) => {
  const defaultNewBoard: BoardProfile = {
    boardId: '',
    containerId: containerId,
    boardSource: BoardSourceEnum.Aeler,
    installDate: new Date(),
  }

  const [newBoardProfile, setNewBoardProfile] = useState<BoardProfile[]>([defaultNewBoard])
  const [disableSubmit, setDisableSubmit] = useState(false)

  const { loadingStatusAeler, loadingStatusContainerId, loadingStatusKizy, loadingStatusNexxiot } = useSelector((state: AppState) => state.boards)

  const loadingBoards = loadingStatusAeler || loadingStatusContainerId || loadingStatusKizy || loadingStatusNexxiot

  const _dispatch = useDispatch()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event?.stopPropagation()
    event?.preventDefault()

    if (
      newBoardProfile.find((b) => (
        !b.boardId ||
        !b.boardSource ||
        !isValidDate(b.installDate)
      ))
    ) {
      _dispatch(showWarning(['Need to input board source, board id and install date']))
    } else {
      newBoardProfile.forEach((board) => {
        const newBoard = {
          ...board,
          boardId: String(board.boardId),
          boardSource: String(board.boardSource),
          installDate: board.installDate as Date,
        }
        handleCreate(newBoard)
      })
    }
  }

  return (
    <Dialog open={true} maxWidth={'sm'} /* fullWidth */ onClose={handleClose} >
      { loadingBoards && <LinearProgress sx={{ position: 'absolute', width: '100%' }}/> }
      <DialogTitle>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography variant={'h6'}>Install IoT boards to {containerId}</Typography>
          <Box justifyContent={'flex-end'}>
            <IconButton size='small' onClick={handleClose}><ClearIcon/></IconButton>
          </Box>
        </Box>
        </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
          <PairingBoardProfiles
            hideContainerId
            containerId={containerId}
            boardProfiles={newBoardProfile}
            setBoardProfiles={(formProfiles) => {
              setNewBoardProfile(formProfiles)
            }}
            isBoardPaired={(boardId: string) => false}
            setDisableSubmit={setDisableSubmit}
          />
        </DialogContent>
        <StyledDialogActions>
          <Button color='primary' onClick={handleClose}>Cancel</Button>
          <Button
            color='primary'
            disabled={disableSubmit || newBoardProfile.filter((b) => !isValidDate(b.installDate)).length > 0 || newBoardProfile.filter((b) => !b.containerId).length > 0}
            variant='contained'
            type='submit'
          >
            Install
          </Button>
        </StyledDialogActions>
      </form>
    </Dialog>
  )
}

interface NewBoardProfileProps extends BoxProps {
  containerId: string
}

const NewBoardProfile = ({ containerId, ...boxProps }: NewBoardProfileProps) => {
  const [open, setOpen] = useState(false)

  const _dispatch = useDispatch()

  const onClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation()
    event.preventDefault()
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const onCreate = (board: ContainerBoardPairingProfilePostInput) => {
    _dispatch(postBoardProfile(board.containerId, board))
  }

  const handleCreate = (board: ContainerBoardPairingProfilePostInput) => {
    setOpen(false)
    onCreate(board)
  }

  return (
    <Box {...boxProps} >
      <Button variant='contained' size='small' color='primary' disabled={false} onClick={() => setOpen(true)}>
        Install board
      </Button>
      {
        open && <NewBoardProfileDialog
          containerId={containerId}
          handleClose={handleClose}
          handleCreate={handleCreate}
        />
      }
    </Box>
  )
}

export default NewBoardProfile
