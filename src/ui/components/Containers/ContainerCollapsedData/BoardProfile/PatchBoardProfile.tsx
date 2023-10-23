import React, { ChangeEvent, FormEvent, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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
  LinearProgress,
  Typography,
  Tooltip,
} from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import UpdateIcon from '@mui/icons-material/Edit'
import LinkOffIcon from '@mui/icons-material/LinkOff'

import { showWarning } from '../../../../../store/error/actions'
import { BoardsProfileAPI, ContainerBoardPairingProfilePatchInput, ContainerBoardPairingProfilePatchInputBoardSourceEnum } from '../../../../../services/equipment/types'
import LabeledDateTimePicker from '../../../shared/LabeledDateTimePicker'
import { patchBoardProfile } from '../../../../../services/thunks'
import { AppState } from '../../../../../store'
import { isValidDate } from '../../../shared/utils'

import { StyledDialogActions } from './DeleteBoardProfile'

const commonProps = {
  variant: 'outlined' as any,
  margin: 'dense' as any,
  size: 'small' as any,
  style: { minWidth: 290 },
  fullWidth: true,
}

interface PatchBoardProfileDialogProps {
  board: Partial<BoardsProfileAPI>;
  boardPairingProfileId: string;
  handleClose: () => void;
  handlePatch: (boardPairingProfileId: string, board: ContainerBoardPairingProfilePatchInput) => void;
  unpairBoard?: boolean
}

const PatchBoardProfileDialog = ({ board, unpairBoard, boardPairingProfileId, handleClose, handlePatch }: PatchBoardProfileDialogProps) => {
  const [patchBoardProfile, setPatchBoardProfile] = useState<ContainerBoardPairingProfilePatchInput>({
    boardId: board.boardId,
    containerId: board.containerId,
    boardSource: board.boardSource as ContainerBoardPairingProfilePatchInputBoardSourceEnum | undefined,
    installDate: board.installDate,
    removalDate: board.removalDate,
    installComments: board.installComments,
    removalComments: board.removalComments,
    installTechnicianId: board.installTechnicianId,
    removalTechnicianId: board.removalTechnicianId,
    installLocationId: board.installLocationId,
    removalLocationId: board.removalLocationId,
    installLocationName: board.installLocationName,
    removalLocationName: board.removalLocationName,
  })

  const loadingStatusContainerId = useSelector((state: AppState) => state.boards.loadingStatusContainerId)
  const loadingStatusNexxiot = useSelector((state: AppState) => state.boards.loadingStatusNexxiot)
  const loadingStatusAeler = useSelector((state: AppState) => state.boards.loadingStatusAeler)
  const loadingStatusKizy = useSelector((state: AppState) => state.boards.loadingStatusKizy)

  const loading = loadingStatusContainerId || loadingStatusNexxiot || loadingStatusKizy || loadingStatusAeler

  const _dispatch = useDispatch()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.stopPropagation()
    event.preventDefault()

    if (
      boardPairingProfileId === '' ||
      (
        !unpairBoard && (
          !patchBoardProfile.containerId ||
          !patchBoardProfile.boardSource ||
          !patchBoardProfile.boardId
        )
      ) ||
      !isValidDate(patchBoardProfile.installDate)
    ) {
      _dispatch(showWarning([`Invalid ${unpairBoard ? 'install date' : 'fields'}.`]))
    } else {
      handlePatch(boardPairingProfileId, patchBoardProfile)
    }
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string) => {
    const keyType = typeof patchBoardProfile[key as keyof ContainerBoardPairingProfilePatchInput]

    setPatchBoardProfile({
      ...patchBoardProfile,
      [key]: keyType === 'number' ? parseInt(event.target.value) : event.target.value || null,
    })
  }

  const handleChangeDate = (date: Date | null, key: string) => {
    setPatchBoardProfile({
      ...patchBoardProfile,
      [key]: date,
    })
  }

  return (
    <Dialog open={true} maxWidth={'md'} /* fullWidth */ onClose={handleClose}>
      { loading && <LinearProgress sx={{ position: 'absolute', width: '100%' }}/> }
      <DialogTitle>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography variant={'h6'}>
            {
              unpairBoard
                ? `Remove IoT board ${patchBoardProfile.boardId || ''} from ${patchBoardProfile.containerId || ''}`
                : `Edit IoT board ${patchBoardProfile.boardId || ''}`
            }
            </Typography>
          <Box justifyContent={'flex-end'}>
            <IconButton size='small' onClick={handleClose}><ClearIcon/></IconButton>
          </Box>
        </Box>
        </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box display='flex' flexDirection='column'>
            <Box display='flex'flexDirection='row' sx={{ gap: 2 }}>
              <TextField
                {...commonProps}
                inputProps={{ readOnly: true }}
                label='Board source'
                value={patchBoardProfile.boardSource}
                disabled={true}
              />
              <TextField
                {...commonProps}
                inputProps={{ readOnly: true }}
                label='Board id'
                value={patchBoardProfile.boardId}
                disabled={true}
              />
            </Box>
            <Box display='flex' sx={{ gap: 2, mt: 1.5 }}>
              <Box flexGrow={1}>
                <Typography gutterBottom variant='h6'>Installation</Typography>
                <LabeledDateTimePicker
                  textFieldProps={{ required: true, fullWidth: true, disabled: unpairBoard }}
                  label='Installation date'
                  value={patchBoardProfile.installDate || null}
                  onChange={e => e !== null && handleChangeDate(e, 'installDate')}
                  InputProps={{ readOnly: unpairBoard }}

                />
                <TextField
                  {...commonProps}
                  label='Installation Comments'
                  value={patchBoardProfile.installComments}
                  onChange={e => handleChange(e, 'installComments')}
                  disabled={unpairBoard}
                  inputProps={{ readOnly: unpairBoard }}
                />
                <TextField
                  {...commonProps}
                  label='Installation Technician ID'
                  value={patchBoardProfile.installTechnicianId}
                  onChange={e => handleChange(e, 'installTechnicianId')}
                  disabled={unpairBoard}
                  inputProps={{ readOnly: unpairBoard }}
                />
                <TextField
                  {...commonProps}
                  label='Installation Location ID'
                  value={patchBoardProfile.installLocationId}
                  onChange={e => handleChange(e, 'installLocationId')}
                  disabled={unpairBoard}
                  inputProps={{ readOnly: unpairBoard }}
                />
                <TextField
                  {...commonProps}
                  label='Installation Location Name'
                  value={patchBoardProfile.installLocationName}
                  onChange={e => handleChange(e, 'installLocationName')}
                  disabled={unpairBoard}
                  inputProps={{ readOnly: unpairBoard }}
                />
              </Box>
              <Box flexGrow={1}>
                <Typography gutterBottom variant='h6'>Removal</Typography>
                <LabeledDateTimePicker
                  textFieldProps={{ fullWidth: true, required: unpairBoard }}
                  label='Removal date'
                  value={patchBoardProfile.removalDate || null}
                  onChange={e => handleChangeDate(e, 'removalDate')}
                />
                <TextField
                  {...commonProps}
                  label='Removal Comments'
                  value={patchBoardProfile.removalComments}
                  onChange={e => handleChange(e, 'removalComments')}
                />
                <TextField
                  {...commonProps}
                  label='Removal Technician ID'
                  value={patchBoardProfile.removalTechnicianId}
                  onChange={e => handleChange(e, 'removalTechnicianId')}
                />
                <TextField
                  {...commonProps}
                  label='Removal Location ID'
                  value={patchBoardProfile.removalLocationId}
                  onChange={e => handleChange(e, 'removalLocationId')}
                />
                <TextField
                  {...commonProps}
                  label='Removal Location Name'
                  value={patchBoardProfile.removalLocationName}
                  onChange={e => handleChange(e, 'removalLocationName')}
                />
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <StyledDialogActions>
          <Button color='primary' onClick={handleClose}>Cancel</Button>
          <Button color='primary' variant='contained' type='submit'>
            {unpairBoard ? 'Remove board' : 'Save changes'}
          </Button>
        </StyledDialogActions>
      </form>
    </Dialog>
  )
}

interface PatchBoardProfileProps extends BoxProps {
  board: Partial<BoardsProfileAPI>
  boardPairingProfileId: string
  unpairBoard?: boolean
  disabled?: boolean
}

const PatchBoardProfile = ({ boardPairingProfileId, board, unpairBoard, disabled, ...boxProps }: PatchBoardProfileProps): JSX.Element => {
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

  const onPatch = (boardPairingProfileId: string, board: ContainerBoardPairingProfilePatchInput) => {
    board.containerId && _dispatch(patchBoardProfile(board.containerId, boardPairingProfileId, board))
  }

  const handlePatch = (boardPairingProfileId: string, board: ContainerBoardPairingProfilePatchInput) => {
    setOpen(false)
    onPatch(boardPairingProfileId, board)
  }

  return (
    <Box {...boxProps}>
      <Tooltip title={unpairBoard ? 'Remove IoT board' : 'Update IoT board'}>
        <span>
          <IconButton color='primary' size='small' disabled={disabled} onClick={onClick}>
            {unpairBoard ? <LinkOffIcon/> : <UpdateIcon/>}
          </IconButton>
        </span>
      </Tooltip>
      {
        open &&
        <PatchBoardProfileDialog
          boardPairingProfileId={boardPairingProfileId}
          board={board}
          handleClose={handleClose}
          handlePatch={handlePatch}
          unpairBoard={unpairBoard}
        />
      }
    </Box>
  )
}

export default PatchBoardProfile
