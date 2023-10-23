import { BoardBatteryStatus, ExtendedBoard as _AelerBoard, LatestMessageDate, MsgSensorsUpdatedAt } from '../../apis-client/svc-boards-aeler'
import { ExtendedBoard as _NexxiotBoard } from '../../apis-client/svc-boards-nexxiot'
import { ExtendedBoard as _KizyBoard } from '../../apis-client/svc-boards-kizy'
import { ExtendedBoard as _MostBoard } from '../../apis-client/svc-boards-most'

export type BoardInput = {
  deviceId: string;
  provider: string;
  hasGps: boolean;
  hasShock: boolean;
  hasTempExt: boolean;
  hasTempInt: boolean;
  hasPressureExt: boolean;
  hasPressureInt: boolean;
  hasGases: boolean;
  hasLightInt: boolean;
  hasLightExt: boolean;
  hasDoor: boolean;
  hasRFID: boolean;
} // FIXME

export type _Board = KizyBoard & NexxiotBoard & AelerBoard & MostBoard
export type LatestMessage = LatestMessageDate
export type BatteryStatus = BoardBatteryStatus
export type B1 = Omit<_Board, 'sensors' | 'assets' | 'gps' | 'latestMessageDate'>
export interface Board extends B1 {
  provider: string;
  healthGps?: {
    geometry: number[];
    updatedAt: Date;
  }
  healthSensors?: Partial<MsgSensorsUpdatedAt>;
  containerIds?: string[];
  latestMessage?: LatestMessageDate
}

export type AelerBoard = _AelerBoard
export type NexxiotBoard = _NexxiotBoard
export type KizyBoard = _KizyBoard
export type MostBoard = _MostBoard

export interface BoardsReducerState {
  // depots: Depot[];
  boards: Board[];
  loadingStatusKizy: boolean;
  loadingStatusAeler: boolean;
  loadingStatusNexxiot: boolean;
  loadingStatusMost: boolean;
  loadingStatusContainerId: boolean;
}
