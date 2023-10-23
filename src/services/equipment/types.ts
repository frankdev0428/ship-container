
import {
  EquipmentStatus as _EquipmentStatus,
  PublicEquipment,
  ContainerInput as _ContainerInput,
  EquipmentStatusInput as _EquipmentStatusInput,
  EquipmentStatusStatusEnum as _PublicEquipmentStatusEnum,
  PostEquipmentsEquipmentidStatusRequest,
  EquipmentLeaseContractWithLease as _EquipmentLeaseContractWithLease,
  EquipmentStatusInputStatusEnum,
  EquipmentLeaseContract,
  EquipmentMoveInput as EquipmentMoveInputAPI,
  ContainerCharacteristicsSizeEnum,
  ContainerCharacteristicsTypeEnum,
  PostBoardpairingprofileRequest as _PostBoardpairingprofileRequest,
  ContainerBoardPairingProfilePostInput as _ContainerBoardPairingProfilePostInput,
  DeleteBoardpairingprofileRequest as _DeleteBoardpairingprofileRequest,
  ContainerBoardPairingProfilePatchInput as _ContainerBoardPairingProfilePatchInput,
  ContainerBoardPairingProfileDeleteInput as _ContainerBoardPairingProfileDeleteInput,
  EquipmentLeaseContractUpdate as _EquipmentLeaseContractUpdate,
  ContainerBoardPairingProfilePatchInputBoardSourceEnum as _ContainerBoardPairingProfilePatchInputBoardSourceEnum,
  PatchEquipmentStatusInput as PatchEquipmentStatusInput_,
  // Model20 as _ContainerSensorsProfileInput,
  ContainerWithProfile as _ContainerWithProfile,
  ContainerSensorsProfileInput as ContainerSensorsProfileInputAPI,
  CurrentStatusStatusEnum as _CurrentStatusStatusEnum,
  // ContainerSensorsProfile as ContainerSensorsProfileAPI,
  BoardsProfile,
  BoardsProfileBoardSourceEnum as _BoardsProfileBoardSourceEnum,
} from '../../apis-client'

export type Equipment = PublicEquipment & {isNewlyInserted?: boolean}

export type ContainerStatus = _EquipmentStatus
// export type ContainerInput = _ContainerInput

export type ContainerStatusInput = _EquipmentStatusInput
export const ContainerStatusEnum = { ..._PublicEquipmentStatusEnum }
export type ContainerStatusEnum = _PublicEquipmentStatusEnum

export type EquipmentStatusEnum = EquipmentStatusInputStatusEnum
export const EquipmentStatusEnum = { ...EquipmentStatusInputStatusEnum }
export type CurrentStatusStatusEnum = _CurrentStatusStatusEnum
export type EquipmentStatusInput = PostEquipmentsEquipmentidStatusRequest
export type ContractWithLease = _EquipmentLeaseContractWithLease
export type EquipmentLeaseContractUpdate = _EquipmentLeaseContractUpdate
export type Contract = EquipmentLeaseContract

export type BoardsProfileAPI = BoardsProfile
export type PatchEquipmentStatusInput = PatchEquipmentStatusInput_
export type PostBoardpairingprofileRequest = _PostBoardpairingprofileRequest
export type ContainerBoardPairingProfilePostInput = _ContainerBoardPairingProfilePostInput
export type DeleteBoardpairingprofileRequest = _DeleteBoardpairingprofileRequest
export type ContainerBoardPairingProfileDeleteInput = _ContainerBoardPairingProfileDeleteInput
export type BoardsProfileBoardSourceEnum = _BoardsProfileBoardSourceEnum
export type ContainerBoardPairingProfilePatchInput = _ContainerBoardPairingProfilePatchInput
export type ContainerBoardPairingProfilePatchInputBoardSourceEnum = _ContainerBoardPairingProfilePatchInputBoardSourceEnum
// export type ContainerSensorsProfileInput = _ContainerSensorsProfileInput

export const BoardSourceEnum = { ..._BoardsProfileBoardSourceEnum, ..._ContainerBoardPairingProfilePatchInputBoardSourceEnum }
export type BoardSourceEnum = _BoardsProfileBoardSourceEnum | _ContainerBoardPairingProfilePatchInputBoardSourceEnum

/* eslint-disable camelcase */
export interface ContainerInput {
  containerId: string;
  characteristics_size: ContainerCharacteristicsSizeEnum; // ContainerSizeName;
  characteristics_type: ContainerCharacteristicsTypeEnum; // ContainerTypeName;
  containerVersion: string;
  characteristics_maxPayload: string;
  characteristics_builtYear: string;
  inspectionDate: Date;
  cscCertNo: string;
  cscCertDate: Date;
  cscCertLink?: string;
  volume: number;
  status: string;
  characteristics_grade?: string;
  characteristics_tare?: number; // the empty weight the of container, number, optional to create ctr, can not change,
  electronicsCharging?: boolean; // bool optional to create ctr, can change (every few years, record needed)
  insurance?: string; // free form string optional to create ctr, can change (every few years, record needed)
  cameraExt?: false; //  external cam, bool, optional to create ctr, can change (every few years, record needed)
  cameraInt?: false; //  external cam, bool, optional to create ctr, can change (every few years, record needed)
  doorType?: string,
  floorType?: string,
  depotId?: string;
  depotAvailabilityDatePlanned?: Date;
  depotAvailabilityDateActual?: Date;
}

export interface ContainerPanelProfileInput {
  leftPanel: string;
  rightPanel: string;
  roofPanel: string;
  endPanel: string;
}

// The following is deprecated, from boards v1
export interface ContainerSensorsProfileInput extends Omit<ContainerSensorsProfileInputAPI, 'source'> {
  source: 'aeler' | 'kizy' | 'nexxiot';
  dateFittedKizy?: Date;
}

/*
FIXME: LEGACY CODE FROM BOARDS V1 -- remove it later
*/
// The following is deprecated, from boards v1
// export interface ContainerSensorsProfile extends ContainerSensorsProfileAPI {
//   dateFittedKizy?: Date;
// }

export type ContainerWithProfile = _ContainerWithProfile

export interface DepotInventory {
  depotId: string;
  equipments: Equipment[];
}

export interface EquipmentReducerState {
  equipments: Equipment[];
  equipmentsInDepots: DepotInventory[];
  availableEquipments: Equipment[];
  loadingStatus: boolean;
  allocations: ContractWithLease[];
  containers: ContainerWithProfile[];
}
