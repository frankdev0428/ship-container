import React from 'react'
import {
  Box,
  Checkbox,
  TableCell,
  TableRow,
} from '@mui/material'
import { format } from 'date-fns'

import Typography, { DisableableTypography } from '../Utils/Typography'
import { BatteryStatus, Board, LatestMessage } from '../../../services/boards/types'
import { TableHeadCell } from '../../../store/ui/types'
import OverflowTooltip from '../shared/OverflowTooltip'
import { MsgSensorsUpdatedAt } from '../../../apis-client/svc-boards-aeler'

import SensorsCell from './SensorsCell'
import DeleteBoard from './DeleteBoard'
import BatteryCell from './BatteryCell'
import LatestMessageCell from './LatestMessageCell'

export const mapToBoardRow = (board: Board): BoardRowDataProps => {
  return {
    id: board.boardId,
    provider: board.provider,
    containerIds: board.containerIds || [],
    // updatedAt: board.updatedAt,
    hasGps: board.hasGps || false,
    hasShock: board.hasShock || false,
    hasTempExt: board.hasTempExt || false,
    hasTempInt: board.hasTempInt || false,
    hasPressureExt: board.hasPressureExt || false,
    hasPressureInt: board.hasPressureInt || false,
    hasGases: board.hasGases || false,
    hasLightInt: board.hasLightInt || false,
    hasLightExt: board.hasLightExt || false,
    hasHumExt: board.hasHumExt || false,
    hasHumInt: board.hasHumInt || false,
    hasDoor: board.hasDoor || false,
    hasRFID: board.hasRFID || false,
    healthSensors: board.healthSensors,
    healthGps: board.healthGps,
    latestMessage: board.latestMessage,
    boardBatteryStatus: board.boardBatteryStatus,
  }
}

const rowTypoVariant = 'body2'

const sensorKeyMap = new Map<string, string>([
  ['hasShock', ''],
  ['hasTempExt', 'externalTemperature'],
  ['hasTempInt', 'temperature'],
  ['hasHumExt', 'externalHumidity'],
  ['hasHumInt', 'humidity'],
  ['hasPressureExt', 'externalPressure'],
  ['hasPressureInt', 'pressure'],
  ['hasGases', 'ngm3TVOC'],
  ['hasLightInt', 'centiLux'],
  ['hasLightExt', 'centiLuxExternal'],
  ['hasRFID', ''],
])

interface BoardCellProps {
  headCell: TableHeadCell;
  board: BoardRowDataProps;
  headerCells: TableHeadCell[];
}

const BoardCell = ({ headCell, board, headerCells }: BoardCellProps): (JSX.Element | null) => {
  if (headCell.hide) return null

  const sensorKey = sensorKeyMap.get(headCell.id) as string

  let content
  switch (headCell.id) {
    case 'id':
      return (<TableCell>
          <OverflowTooltip title={board.id} deps={[headerCells]} >
            <Typography noWrap variant={rowTypoVariant} >{board.id}</Typography>
          </OverflowTooltip>
        </TableCell>)
    case 'latestMessage': {
      return (<TableCell>
        <LatestMessageCell latestMessage={board.latestMessage} />
      </TableCell>)
    }
    case 'battery': {
      return (<TableCell>
        <BatteryCell isAelerBoard={board.provider === 'aeler'} boardBatteryStatus={board.boardBatteryStatus}/>
      </TableCell>)
    }
    case 'containerIds':
      return (<TableCell>
        <OverflowTooltip title={board.containerIds.join(', ')} deps={[headerCells]} >
          <>
            {board.containerIds.map((id, idx) => <Typography key={idx} noWrap variant={rowTypoVariant} >{id}</Typography>)}
          </>
        </OverflowTooltip>
      </TableCell>)
    // case 'ctUpdated':
    //   return (<TableCell>
    //     <SensorsCell value={board.healthSensors?.updatedAt.getTime()} lastUpdatedAt={new Date(board.updatedAt)} headCell={headCell.id} formatValue={(value) => `${value}`}/>
    //   </TableCell>)
    case 'hasGps':
      return (<TableCell>
        <SensorsCell sensorName={headCell.id} headCells={headerCells} enabled={board.hasGps} value={board.healthGps?.updatedAt && format(new Date(board.healthGps?.updatedAt).getTime(), 'dd-MM-yyyy HH:mm z')} lastUpdatedAt={board.healthGps?.updatedAt} formatValue={(value) => `${value}`}/>
      </TableCell>)
    case 'hasTempExt':
    case 'hasTempInt':
    case 'hasHumExt':
    case 'hasHumInt':
    case 'hasPressureExt':
    case 'hasPressureInt':
    case 'hasGases':
    case 'hasLightInt':
    case 'hasLightExt':
    case 'hasRFID':
      return (<TableCell>
        <SensorsCell
          sensorName={headCell.id}
          headCells={headerCells}
          enabled={board[headCell.id]}
          value={board.healthSensors ? (board.healthSensors as any)[sensorKey] : undefined}
          lastUpdatedAt={board.healthSensors?.updatedAt}
          formatValue={(value) => `${value}`}
        />
      </TableCell>)
    case 'hasDoor': {
      let label // : string | undefined
      if (board.healthSensors?.door !== undefined) {
        if (board.healthSensors?.door === 0) {
          label = 'Door: Open'
        } else {
          label = 'Door: Closed'
        }
      }
      return (<TableCell>
        <SensorsCell sensorName={headCell.id} headCells={headerCells} enabled={board.hasDoor} value={label} lastUpdatedAt={board.healthSensors?.updatedAt} formatValue={(value) => `${value}`}/>
      </TableCell>)
    }
    case 'hasShock': {
      const label = 'X'
      return (<TableCell>
        <SensorsCell sensorName={headCell.id} headCells={headerCells} enabled={board.hasDoor} value={label} lastUpdatedAt={board.healthSensors?.updatedAt} formatValue={(value) => `${value}`}/>
      </TableCell>)
    }

    default:
      content = board[headCell.id as 'id']
      return (<TableCell>
        <OverflowTooltip title={content || ''} deps={[headerCells]} >
          <DisableableTypography noWrap variant={rowTypoVariant} >{content}</DisableableTypography>
        </OverflowTooltip>
      </TableCell>)
  }
}

export interface BoardRowDataProps {
  id: string;
  provider: string;
  containerIds: string[];
  // updatedAt: Date;
  hasGps: boolean;
  hasShock: boolean;
  hasTempExt: boolean;
  hasTempInt: boolean;
  hasPressureExt: boolean;
  hasPressureInt: boolean;
  hasGases: boolean;
  hasLightInt: boolean;
  hasLightExt: boolean;
  hasHumInt: boolean;
  hasHumExt: boolean;
  hasDoor: boolean;
  hasRFID: boolean;
  healthGps?: {
    geometry: number[];
    updatedAt: Date;
  }
  healthSensors?: Partial<MsgSensorsUpdatedAt>;
  latestMessage?: LatestMessage;
  boardBatteryStatus?: BatteryStatus
}
export interface BoardRowProps extends BoardRowDataProps {
  headerCells: TableHeadCell[];
  isSelected?: boolean;
  disableSelect?: boolean;

  // handleRowClick: (event: React.MouseEvent<unknown>, id: string) => void;
}

const BoardRow = (props: BoardRowProps): JSX.Element => {
  const {
    id,
    provider,
    containerIds,
    // updatedAt,
    hasGps,
    hasShock,
    hasTempExt,
    hasTempInt,
    hasPressureExt,
    hasPressureInt,
    hasGases,
    hasLightInt,
    hasLightExt,
    hasHumInt,
    hasHumExt,
    hasDoor,
    hasRFID,
    isSelected,
    disableSelect,
    headerCells,
    healthSensors,
    healthGps,
    latestMessage,
    boardBatteryStatus,
    // handleRowClick,
  } = props
  // const orderStatusMap = useOrderStatusMap()

  const labelId = `enhanced-table-checkbox-${id}`

  const cellProps = {
    id,
    provider,
    containerIds,
    // updatedAt,
    hasGps,
    hasShock,
    hasTempExt,
    hasTempInt,
    hasPressureExt,
    hasPressureInt,
    hasGases,
    hasLightInt,
    hasLightExt,
    hasHumInt,
    hasHumExt,
    hasDoor,
    hasRFID,
    healthSensors,
    healthGps,
    boardBatteryStatus,
    latestMessage,
  }

  return (
    <TableRow
      // hover
      // onClick={(event) => handleRowClick(event, boardId)}
      role={disableSelect ? 'checkbox' : undefined}
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
      { headerCells.filter(h => h.id !== 'actions').map((hc, i) =>
        <BoardCell
          key={i}
          headCell={hc}
          headerCells={headerCells}
          board={cellProps}
          // orderStatusMap={orderStatusMap}
        />).filter(Boolean)}
          <TableCell padding={'none'} align='center'>
            <Box display='flex' alignItems={'center'} justifyContent={'flex-end'}>
           {/* { provider === 'aeler' && <PatchBoard board={{
             boardId: id,
             provider: provider,
           }}/>} */}
              {provider === 'aeler' && <DeleteBoard disabled={containerIds.length > 0} boardId={id}/>}
            </Box>
          </TableCell>
    </TableRow>
  )
}

export default BoardRow
