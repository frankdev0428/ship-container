import {
  EquipmentMoveWithStatus,
  EquipmentMoveInput as _EquipmentMoveInput,
} from '../../apis-client'

export type Move = EquipmentMoveWithStatus
export type EquipmentMoveInput = _EquipmentMoveInput

export interface MoveReducerState {
  moves: {
    equipmentId: string;
    moves: Move[];
  }[];
  loadingStatus: boolean;
}
