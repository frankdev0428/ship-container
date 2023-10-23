import React, { ChangeEvent, useEffect } from 'react'
import {
  Box,
  Button,
  TextField,
  Grid,
  Typography,
  StandardTextFieldProps,
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'

import SelectPopper from '../../Utils/SelectPopper'
import { LabeledDatePicker } from '../../shared/LabeledDatePicker'
import BoardsPicker from '../BoardsPicker'
import { BoardSourceEnum } from '../../../../services/equipment/types'
import { getBoardContainerId } from '../../../../services/boards/actions'
import { AppState } from '../../../../store'

const commonProps = {
  variant: 'outlined' as any,
  margin: 'dense' as any,
  size: 'small' as any,
  style: { minWidth: 160 },
  fullWidth: true,
}

const GridField = (props: StandardTextFieldProps) => (
  <Grid item xs={6}>
    <TextField {...commonProps} style={{ ...commonProps.style, marginTop: 4, marginBottom: 0 }} {...props}/>
  </Grid>
)

const boardSelectOptions = [
  { value: BoardSourceEnum.Aeler, label: 'AELER' },
  { value: BoardSourceEnum.Kizy, label: 'KIZY' },
  { value: BoardSourceEnum.Nexxiot, label: 'NEXXIOT' },
  { value: BoardSourceEnum.Most, label: 'MOST' },
]

export interface BoardProfile {
  containerId: string;
  boardId?: string;
  boardSource?: BoardSourceEnum;
  installDate?: Date;
  removalDate?: Date;
  installComments?: string;
  removalComments?: string;
  installTechnicianId?: string;
  removalTechnicianId?: string;
  installLocationId?: string;
  removalLocationId?: string;
  installLocationName?: string;
  removalLocationName?: string;
}

interface PairingBoardProfileProps {
  hideContainerId?: boolean
  containerId: string;
  boardProfiles: BoardProfile[];
  setBoardProfiles: (profiles: BoardProfile[]) => void
  isBoardPaired: (boardId: string) => boolean
  setDisableSubmit: (disabled: boolean) => void
}

const PairingBoardProfiles = ({ hideContainerId, containerId, boardProfiles, setBoardProfiles, isBoardPaired, setDisableSubmit }: PairingBoardProfileProps) => {
  const boards = useSelector((state: AppState) => state.boards.boards)
  const loadingStatusContainerId = useSelector((state: AppState) => state.boards.loadingStatusContainerId)

  const _dispatch = useDispatch()

  const handleBoardProfileChange = (index: number, key: keyof BoardProfile) => (value: string | Date | null) => {
    const newBoards = [...boardProfiles]
    newBoards[index][key] = (value || undefined) as any

    if (key === 'boardId' && value && newBoards[index].boardSource) {
      _dispatch(getBoardContainerId([value as string], newBoards[index].boardSource as 'aeler'))
    }

    setBoardProfiles(newBoards)
  }

  const handleAddMore = (containerId: string) => {
    setBoardProfiles([
      ...boardProfiles,
      {
        containerId: containerId,
        boardSource: BoardSourceEnum.Aeler,
      },
    ])
  }

  useEffect(() => {
    const hasConflicts = boardProfiles.find(bp => Boolean(boards.find(b => bp.boardId && bp.boardId === b.boardId)?.containerIds?.length))

    if (hasConflicts) {
      setDisableSubmit(true)
      return
    }
    !loadingStatusContainerId && setDisableSubmit(false)
  }, [loadingStatusContainerId, boardProfiles.map(bp => bp.boardId)])

  return (
    <Box id='pairing-board-profile-container-form'>
      { !hideContainerId && <Typography variant='button' paragraph>{containerId}</Typography> }
      {
        boardProfiles.map((board, index) => {
          const assignedBoardIndex = boardProfiles.findIndex(bp => board.boardId && bp.boardId === board.boardId)
          const boardIsPaired = Boolean(boards.find(b => board.boardId && b.boardId === board.boardId)?.containerIds?.length) || false
          return (
            <Grid key={index} container spacing={1} marginBottom={3} >
              <Grid item xs={12}>
                <SelectPopper
                  label={board.boardId !== undefined && board.boardId !== '' ? 'Source' : 'Source*'}
                  options={boardSelectOptions} // FIXME: import from common instead of declaring here again
                  value={board.boardSource || 'aeler'}
                  onChange={handleBoardProfileChange(index, 'boardSource')}
                  required={board.boardId !== undefined && board.boardId !== ''}
                  style={{ maxWidth: '50%', marginTop: 4, marginBottom: 0 }}
                />
              </Grid>
              <Grid item xs={6} >
                <BoardsPicker
                  value={board.boardId}
                  required={board.installDate !== null && board.boardId !== undefined}
                  label={board.installDate !== null && board.boardId !== undefined ? 'Board ID' : 'Board ID*'}
                  type={board?.boardSource || BoardSourceEnum.Aeler}
                  callback={handleBoardProfileChange(index, 'boardId')}
                  {...(
                    (board.boardId && isBoardPaired(board.boardId)) ||
                    (assignedBoardIndex !== -1 && assignedBoardIndex !== index) ||
                    boardIsPaired
                  ) && {
                    textFieldProps: {
                      error: true,
                      helperText: '*Board already paired. Please select another one',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <LabeledDatePicker
                  label={board.boardId !== undefined && board.boardId !== '' ? 'Installation date' : 'Installation date*'}
                  textFieldProps={{
                    size: 'small',
                    fullWidth: true,
                    required: board.boardId !== undefined && board.boardId !== '',
                  }}
                  value={board.installDate || null}
                  onChange={handleBoardProfileChange(index, 'installDate')}
                />

              </Grid>
              <GridField
                label='Installation comments'
                type='text'
                value={board.installComments}
                onChange={e => handleBoardProfileChange(index, 'installComments')(e.target.value)}
              />
              <GridField
                label='Installation technician'
                type='text'
                value={board.installTechnicianId}
                onChange={e => handleBoardProfileChange(index, 'installTechnicianId')(e.target.value)}
              />
              <GridField
                label='Installation location ID'
                type='text'
                value={board.installLocationId}
                onChange={e => handleBoardProfileChange(index, 'installLocationId')(e.target.value)}
              />
              <GridField
                label='Installation location name'
                type='text'
                value={board.installLocationName}
                onChange={e => handleBoardProfileChange(index, 'installLocationName')(e.target.value)}
              />
            </Grid>
          )
        })
      }
      <Box my={2}>
        <Button onClick={() => handleAddMore(containerId)} size='small' variant='text'>+ ADD MORE BOARDS</Button>
      </Box>
    </Box>

  )
}

export default PairingBoardProfiles
