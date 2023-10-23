/* eslint-disable no-useless-escape */
import React, { FormEvent, useState } from 'react'
import {
  Box,
  BoxProps,
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  styled,
  Tooltip,
  useTheme,
} from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import { useDispatch, useSelector } from 'react-redux'
import DeleteIcon from '@mui/icons-material/Delete'
import LinkOffIcon from '@mui/icons-material/LinkOff'

import Typography from '../../../Utils/Typography'
import { DeleteBoardpairingprofileRequest } from '../../../../../services/equipment/types'
import { deleteBoardProfile } from '../../../../../services/thunks'
import { AppState } from '../../../../../store'
import { ADMIN_GROUPS, ENABLED_BOARD_EDITING_FLOW } from '../../../shared/utils'
import FormWarningMessage from '../../../shared/Form/FormWarningMessage'

const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.text.unselected,
  border: `1px solid ${theme.palette.text.unselected}`,
  // '&:hover': {
  //   backgroundColor: theme.palette.grey[100],
  // },
}))

export const StyledDialogActions = styled(DialogActions)(({
  padding: '0px 24px 24px',
}))

export const StyledDialogContent = styled(DialogContent)(({
  paddingTop: 0,
}))

interface UnpairBoardDialogProps {
  boardId: string;
  containerId: string;
  handleClose: () => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void
}

/**
 * This is a legacy component!
 * Once https://aeler.atlassian.net/browse/FM-653 is marked as done, this implementation should be removed from the codebase
 * along with the feature flag FF_ENABLE_BOARD_EDITING_FLOW
 * 
 */
const UnpairBoardDialog = ({ boardId, containerId, handleClose, handleSubmit }: UnpairBoardDialogProps) => {
  return (
    <Dialog open={true} maxWidth={'sm'} fullWidth onClose={handleClose} >
      <DialogTitle>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography variant={'h6'}>Are you sure you want to unpair board {boardId} from container {containerId}?</Typography>
          <Box justifyContent={'flex-end'}>
            <IconButton size='small' onClick={handleClose}><ClearIcon/></IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
        </DialogContent>
        <DialogActions>
          <Button color='primary' onClick={handleClose}>Cancel</Button>
          <Button color='primary' variant='contained' type='submit' >Unpair</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

interface DeleteBoardDialogProps {
  boardId: string;
  containerId: string;
  handleClose: () => void;
  handleDelete: () => void;
}

const DeleteBoardDialog = ({ boardId, containerId, handleClose, handleDelete }: DeleteBoardDialogProps) => {
  const theme = useTheme()
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.stopPropagation()
    event.preventDefault()
    handleDelete()
  }

  if (!ENABLED_BOARD_EDITING_FLOW) {
    return <UnpairBoardDialog boardId={boardId} containerId={containerId} handleClose={handleClose} handleSubmit={handleSubmit} />
  }

  return (
    <Dialog open={true} maxWidth={'sm'} fullWidth onClose={handleClose} >
      <DialogTitle>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography variant={'h6'}>Delete board</Typography>
          <Box justifyContent={'flex-end'}>
            <IconButton size='small' onClick={handleClose}><ClearIcon/></IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <StyledDialogContent>
          <Box display='flex' flexDirection='column' gap={3}>
            <Typography variant='body2' color={theme.palette.text.unselected}>
              Are you sure you want to delete board <b>{boardId}</b> pairing and pairing history?
            </Typography>
            <FormWarningMessage
              value={'This will erase all data previously streamed from this board for this container in Control Tower.'}
            />
          </Box>
        </StyledDialogContent>
        <StyledDialogActions>
          <ColorButton variant='outlined' onClick={handleClose}>
            Cancel
          </ColorButton>
          <Button color='error' variant='contained' type='submit'>Yes, delete board</Button>
        </StyledDialogActions>
      </form>
    </Dialog>
  )
}

interface DeleteBoardProps extends BoxProps {
  id: string;
  containerId: string;
  boardId: string;
}

const DeleteBoardProfile = ({ id, containerId, boardId, ...boxProps }: DeleteBoardProps): JSX.Element => {
  const [open, setOpen] = useState(false)
  const user = useSelector((state: AppState) => state.user.user)

  const _dispatch = useDispatch()

  const onDelete = (body: DeleteBoardpairingprofileRequest) => {
    _dispatch(deleteBoardProfile(containerId, body))
  }

  const handleDelete = () => {
    setOpen(false)
    const body: DeleteBoardpairingprofileRequest = {
      body: { boardPairingProfileId: id },
    }
    onDelete(body)
  }

  const isButtonDisabled = !user.groups?.some((group) => ADMIN_GROUPS.includes(group))

  return (
    <Box {...boxProps} >
      <Tooltip title='Delete board'>
        <span>
          <IconButton size='small' disabled={isButtonDisabled} onClick={() => setOpen(true)}>
            <DeleteIcon color={isButtonDisabled ? 'disabled' : 'error'}/>
          </IconButton>
        </span>
      </Tooltip>
      {
        open &&
          <DeleteBoardDialog
            boardId={boardId}
            containerId={containerId}
            handleClose={() => setOpen(false)}
            handleDelete={handleDelete}
          />
      }
    </Box>
  )
}

export default DeleteBoardProfile
