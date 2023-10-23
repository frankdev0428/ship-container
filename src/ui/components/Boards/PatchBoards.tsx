import React, { ChangeEvent, FormEvent, useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  Box,
  BoxProps,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import UpdateIcon from '@mui/icons-material/Edit'

import Typography from '../Utils/Typography'
import { showWarning } from '../../../store/error/actions'
import { modifyAelerBoard } from '../../../services/boards/actions'
import { Board } from '../../../services/boards/types'

const commonProps = {
  variant: 'outlined' as any,
  margin: 'dense' as any,
  size: 'small' as any,
  style: { minWidth: 160 },
}

interface PatchBoardDialogProps {
  boardId: string;
  provider: string;
  handleClose: () => void;
  handlePatch: (boardId: string, board: Board) => void;
}

const PatchBoardDialog = ({ boardId, provider, handleClose, handlePatch }: PatchBoardDialogProps) => {
  const [patchBoard, setPatchBoard] = useState<Board>({
    boardId: boardId,
    provider: provider,
  })

  const _dispatch = useDispatch()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.stopPropagation()
    event.preventDefault()

    if (boardId === '') {
      _dispatch(showWarning(['Error']))
    } else {
      handlePatch(boardId, patchBoard)
    }
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string) => {
    const keyType = typeof patchBoard[key as keyof Board]

    setPatchBoard({
      ...patchBoard,
      [key]: keyType === 'number' ? parseInt(event.target.value) : event.target.value,
    })
  }

  const handleDialogClick = (event: any) => {
    event.stopPropagation()
  }

  return (
    <Dialog open={true} maxWidth={'sm'} fullWidth onClose={handleClose} onClick={handleDialogClick}>
      <DialogTitle>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography variant={'h6'}>Update Board</Typography>
          {/* { loadingDepots && <CircularProgress sx={{ marginLeft: '16px' }} size={20} /> } */}
          <Box justifyContent={'flex-end'}>
            <IconButton size='small' onClick={handleClose}><ClearIcon/></IconButton>
          </Box>
        </Box>
        </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
            <Box display='flex' flexDirection='column' >
              <TextField {...commonProps} label="Board id" value={patchBoard.boardId} onChange={e => handleChange(e, 'boardId')} />
              <TextField {...commonProps} label="Provider" value={patchBoard.provider} onChange={e => handleChange(e, 'provider')} />
            </Box>
        </DialogContent>
        <DialogActions>
          {/* <Button color='primary' onClick={handleClose}>Close</Button> */}
          <Button color='primary' variant='contained' type='submit' >Update</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

interface PatchBoardProps extends BoxProps {
  board: {
    boardId: string;
    provider: string;
  };
  // onPatch: (boardId: string, depot: FacilityInput) => void
}

const PatchBoard = ({ board, ...boxProps }: PatchBoardProps): JSX.Element => {
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

  const handlePatch = (boardId: string, board: Board) => {
    setOpen(false)
    _dispatch(modifyAelerBoard(boardId, board))
  }

  return (
    <Box {...boxProps} >
      <IconButton disabled={true} color='primary' size='small' onClick={onClick}>
        <UpdateIcon/>
      </IconButton>
      {
        open && <PatchBoardDialog
          boardId={board.boardId}
          provider={board.provider}
          handleClose={handleClose}
          handlePatch={handlePatch}
        />
      }
    </Box>
  )
}

export default PatchBoard
