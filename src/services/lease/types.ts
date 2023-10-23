import {
  EquipmentLeaseStatus as _EquipmentLeaseStatus,
  EquipmentLeaseStatusOrderStatusEnum,
  EquipmentLeaseStatusContractStatusEnum,
  Lease as LeaseInput,
  CurrentLease as _CurrentLease,
  Status,
  EquipmentLeaseContract as _EquipmentLeaseContract,
  EquipmentLeasePatchInput as _EquipmentLeasePatchInput,
  LeaseVisibilityContract as _LeaseVisibilityContract,
  EquipmentLeasesPublic,
} from '../../apis-client'

export type Lease = EquipmentLeasesPublic & { isNewlyInserted?: boolean }
export type LeaseStatus = _EquipmentLeaseStatus

export type CurrentLease = _CurrentLease

export type EquipmentLeaseContract = _EquipmentLeaseContract
// export type OrderStatusEnum = EquipmentLeaseStatusOrderStatusEnum
// export type ContractStatusEnum = EquipmentLeaseStatusContractStatusEnum
export { EquipmentLeaseStatusOrderStatusEnum as OrderStatusEnum }
export { EquipmentLeaseStatusContractStatusEnum as ContractStatusEnum }

export type EquipmentLeaseInput = LeaseInput & Status
export type EquipmentLeasePatchInput = _EquipmentLeasePatchInput
export type LeaseVisibilityContract = _LeaseVisibilityContract

export interface LeaseReducerState {
  leases: Lease[];
  assignableLeases: Lease[];
  loadingStatus: boolean;
  isCreatingLease: boolean;
  vizContracts: LeaseVisibilityContract[];
}
