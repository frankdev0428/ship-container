import React from 'react'
import { Box, Checkbox, TableCell, TableRow } from '@mui/material'

import { TableHeadCell } from '../../../shared/GenericTable/SortableTableHead'
import OverflowTooltip from '../../../shared/OverflowTooltip'
import Typography, { DisableableTypography } from '../../../Utils/Typography'
import { getTimeLabel } from '../../../shared/utils'
import { BoardsProfileAPI, BoardsProfileBoardSourceEnum, ContainerBoardPairingProfilePatchInputBoardSourceEnum } from '../../../../../services/equipment/types'
import { LatestMessage } from '../../../../../services/boards/types'
import LatestMessageCell from '../../../Boards/LatestMessageCell'

import PatchBoardProfile from './PatchBoardProfile'
import DeleteBoardProfile from './DeleteBoardProfile'

export const mapToBoardProfileRow = (board: BoardsProfileAPI): BoardProfileRowDataProps => {
  return {
    id: board.boardPairingProfileId,
    containerId: board.containerId,
    boardId: board.boardId,
    boardSource: board.boardSource as any, // FIXME:
    createdAt: board.createdAt,
    updatedAt: board.updatedAt,
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
  }
}

interface BoardProfileCellProps {
  headCell: TableHeadCell;
  board: BoardProfileRowDataProps;
  headerCells: TableHeadCell[];
}

const BoardProfileCell = ({ headCell, board, headerCells }: BoardProfileCellProps): (JSX.Element | null) => {
  if (headCell.hide) return null
  let content

  const showDate = (date?: Date, deps?: any[]) => {
    if (date) {
      const availableToText = getTimeLabel(date, 'dateHourWithTz')
      return (<OverflowTooltip title={availableToText} deps={deps} >
        <DisableableTypography noWrap variant='body2'>{availableToText}</DisableableTypography>
      </OverflowTooltip>)
    } else return (<DisableableTypography noWrap variant='body2'>{undefined}</DisableableTypography>)
  }

  switch (headCell.id) {
    // case 'id':
    //   return (<TableCell>
    //       <OverflowTooltip title={board.id} deps={[headerCells]} >
    //         <Typography noWrap variant='body1' >{board.id}</Typography>
    //       </OverflowTooltip>
    //     </TableCell>)
    case 'containerId':
      return (<TableCell>
          <OverflowTooltip title={board.containerId} deps={[headerCells]} >
            <Typography noWrap variant='body1' >{board.containerId}</Typography>
          </OverflowTooltip>
        </TableCell>)
    case 'boardId':
      return (<TableCell>
          <OverflowTooltip title={board.boardId} deps={[headerCells]} >
            <Typography noWrap variant='body1' >{board.boardId}</Typography>
          </OverflowTooltip>
        </TableCell>)
    case 'boardSource':
      return (<TableCell>
          <OverflowTooltip title={board.boardSource} deps={[headerCells]} >
            <Typography noWrap variant='body1' >{board.boardSource}</Typography>
          </OverflowTooltip>
        </TableCell>)
    case 'installComments':
      return (<TableCell>
            <OverflowTooltip title={board.installComments || ''} deps={[headerCells]} >
              <Typography noWrap variant='body1' >{board.installComments}</Typography>
            </OverflowTooltip>
          </TableCell>)
    case 'removalComments':
      return (<TableCell>
            <OverflowTooltip title={board.removalComments || ''} deps={[headerCells]} >
              <Typography noWrap variant='body1' >{board.removalComments}</Typography>
            </OverflowTooltip>
          </TableCell>)

    case 'installTechnicianId':
      return (<TableCell>
      <OverflowTooltip title={board.installTechnicianId || ''} deps={[headerCells]} >
        <Typography noWrap variant='body1' >{board.installTechnicianId}</Typography>
      </OverflowTooltip>
    </TableCell>)
    case 'removalTechnicianId':
      return (<TableCell>
      <OverflowTooltip title={board.removalTechnicianId || ''} deps={[headerCells]} >
        <Typography noWrap variant='body1' >{board.removalTechnicianId}</Typography>
      </OverflowTooltip>
    </TableCell>)
    case 'installLocation': {
      const content = board.installLocationName && board.installLocationId
        ? `${board.installLocationName}, ${board.installLocationId}`
        : board.installLocationName && !board.installLocationId
          ? board.installLocationName
          : board.installLocationId && !board.installLocationName
            ? board.installLocationId
            : ''
      return (<TableCell>
      <OverflowTooltip title={content} deps={[headerCells]} >
        <Typography noWrap variant='body1' >{content}</Typography>
      </OverflowTooltip>
    </TableCell>) }
    case 'removalLocation': {
      const content = board.removalLocationName && board.removalLocationId
        ? `${board.removalLocationName}, ${board.removalLocationId}`
        : board.removalLocationName && !board.removalLocationId
          ? board.removalLocationName
          : board.removalLocationId && !board.removalLocationName
            ? board.removalLocationId
            : ''
      return (<TableCell>
        <OverflowTooltip title={content} deps={[headerCells]} >
          <Typography noWrap variant='body1' >{content}</Typography>
        </OverflowTooltip>
      </TableCell>) }
    case 'boardPairedLatestMessage': {
      return (<TableCell>
        <LatestMessageCell latestMessage={board.boardPairedLatestMessage}/>
      </TableCell>)
    }
    case 'createdAt':
      return (<TableCell >
            {showDate(board.createdAt, [headerCells])}
        </TableCell>)
    case 'updatedAt':
      return (<TableCell >
              {showDate(board.updatedAt, [headerCells])}
              </TableCell>)
    case 'installDate':
      return (<TableCell >
                {showDate(board.installDate, [headerCells])}
              </TableCell>)
    case 'removalDate':
      return (<TableCell >
                {showDate(board.removalDate, [headerCells])}
              </TableCell>)
    default:
      content = board[headCell.id as 'id']
      return (<TableCell>
        <OverflowTooltip title={content || ''} deps={[headerCells]} >
          <DisableableTypography noWrap variant='body1' >{content}</DisableableTypography>
        </OverflowTooltip>
      </TableCell>)
  }
}

export interface BoardProfileRowDataProps {
  id: string;
  containerId: string;
  boardId: string;
  boardSource: ContainerBoardPairingProfilePatchInputBoardSourceEnum;
  createdAt: Date;
  updatedAt: Date;
  installDate: Date;
  removalDate?: Date;
  installComments?: string;
  removalComments?: string;
  installTechnicianId?: string;
  removalTechnicianId?: string;
  installLocationId?: string;
  removalLocationId?: string;
  installLocationName?: string;
  removalLocationName?: string;
  boardPairedLatestMessage?: LatestMessage;
}
export interface BoardProfileRowProps extends BoardProfileRowDataProps {
  headerCells: TableHeadCell[];
  disableSelect?: boolean;
  isSelected?: boolean;
}

const BoardProfileRow = (props: BoardProfileRowProps): JSX.Element => {
  const {
    id,
    containerId,
    boardId,
    boardSource,
    createdAt,
    updatedAt,
    installDate,
    removalDate,
    installComments,
    removalComments,
    installTechnicianId,
    removalTechnicianId,
    installLocationId,
    removalLocationId,
    installLocationName,
    removalLocationName,
    headerCells,
    disableSelect,
    isSelected,
    boardPairedLatestMessage,
  } = props

  const labelId = `enhanced-table-checkbox-${id}`

  const cellProps = {
    id,
    containerId,
    boardId,
    boardSource,
    createdAt,
    updatedAt,
    installDate,
    removalDate,
    installComments,
    removalComments,
    installTechnicianId,
    removalTechnicianId,
    installLocationId,
    removalLocationId,
    installLocationName,
    removalLocationName,
    boardPairedLatestMessage,
  }

  return (
      <TableRow
        role={disableSelect ? 'checkbox' : undefined}
        sx={{ height: 40 }}
        aria-checked={isSelected}
        tabIndex={-1}
        selected={isSelected}
      >
      {
        !disableSelect &&
          <TableCell padding="checkbox">
            <Checkbox
              color='primary'
              checked={isSelected}
              inputProps={{ 'aria-labelledby': labelId }}
            />
          </TableCell>
      }
        { headerCells.filter(h => h.id !== 'actions').map(hc =>
          <BoardProfileCell
            key={hc.id}
            headCell={hc}
            headerCells={headerCells}
            board={cellProps}
          />).filter(Boolean)}
            <TableCell padding={'none'} align='center'>
            <Box display='flex' alignItems={'center'} justifyContent={'space-between'}>

              <PatchBoardProfile
                boardPairingProfileId={id}
                board={{
                  boardId,
                  containerId,
                  boardSource: boardSource as unknown as BoardsProfileBoardSourceEnum | undefined,
                  installDate,
                  removalDate: removalDate || undefined,
                  installComments: installComments || undefined,
                  removalComments: removalComments || undefined,
                  installTechnicianId: installTechnicianId || undefined,
                  removalTechnicianId: removalTechnicianId || undefined,
                  installLocationId: installLocationId || undefined,
                  removalLocationId: removalLocationId || undefined,
                  installLocationName: installLocationName || undefined,
                  removalLocationName: removalLocationName || undefined,
                }}/>
              <DeleteBoardProfile id={id} boardId={boardId} containerId={containerId}/>
             </Box>
          </TableCell>
        </TableRow>
  )
}

export default BoardProfileRow
