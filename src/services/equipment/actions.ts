import { createActionCreator } from 'deox'

import {
  ContainersApi,
  Container,
  EquipmentStatus,
  EquipmentsApi,
  GetEquipmentsRequest,
  PublicEquipment,
  PostEquipmentsEquipmentidStatusRequest,
  ContainerInput,
  EquipmentLeaseContractInput as AllocateInput,
  LeasesApi,
  ContainerPanelProfile,
  ContainerWithProfile,
  ContainerPatchInput,
  PatchEquipmentStatusInput,
  BoardsProfile,
  PatchBoardpairingprofileRequest,
  BoardPairingProfileApi,
  DeleteBoardpairingprofileRequest,
  EquipmentLeaseContractUpdate,
  EquipmentLeaseContractWithLease,
  V2Api,
} from '../../apis-client'
import { LeasecontractsApi } from '../../apis-client/apis/LeasecontractsApi'
import { ThunkResult } from '../../frameworks/types'
import { aelerApiFailure } from '../../frameworks/apiUtils'
import { getConfiguration } from '../auth/keycloak'
import { dispatchErrorWithEffect, dispatchSuccessWithEffect } from '../../store/effects'
import { EquipmentLeaseContract } from '../lease/types'

import { ContainerPanelProfileInput, ContainerSensorsProfileInput, Contract, ContractWithLease, PostBoardpairingprofileRequest } from './types'

export const createContainer = Object.assign(
  (params: ContainerInput): ThunkResult<Promise<void | { type: 'CREATE_EQUIPMENT_SUCCESS'; payload: Container }>> => {
    return async (dispatch) => {
      dispatch(createContainer.next())

      return await new ContainersApi(getConfiguration())
        .postContainers({ body: params })
        .then((response) => dispatchSuccessWithEffect(dispatch, createContainer.complete(response), ['Container created']))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, createContainer.error(error), error)))
    }
  },
  {
    next: createActionCreator('CREATE_EQUIPMENT_REQUEST'),
    complete: createActionCreator('CREATE_EQUIPMENT_SUCCESS',
      resolve => (Equipment: Container) => resolve(Equipment),
    ),
    error: createActionCreator('CREATE_EQUIPMENT_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const createEquipmentStatus = Object.assign(
  (params: PostEquipmentsEquipmentidStatusRequest): ThunkResult<Promise<void | { type: 'POST_EQUIPMENT_STATUS_SUCCESS'; payload: EquipmentStatus }>> => {
    return async (dispatch) => {
      dispatch(createEquipmentStatus.next())

      return new EquipmentsApi(getConfiguration())
        .postEquipmentsEquipmentidStatus(params)
        .then((response) => dispatchSuccessWithEffect(dispatch, createEquipmentStatus.complete(response), ['Status created']))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, createEquipmentStatus.error(error), error)))
    }
  },
  {
    next: createActionCreator('POST_EQUIPMENT_STATUS_REQUEST'),
    complete: createActionCreator('POST_EQUIPMENT_STATUS_SUCCESS',
      resolve => (Equipments: EquipmentStatus) => resolve(Equipments),
    ),
    error: createActionCreator('POST_EQUIPMENT_STATUS_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const listEquipments = Object.assign(
  (params: GetEquipmentsRequest, usev2?: boolean): ThunkResult<Promise<void | { type: 'GET_EQUIPMENTS_SUCCESS'; payload: PublicEquipment[] }>> => {
    return async (dispatch) => {
      dispatch(listEquipments.next())

      if (usev2) {
        return new V2Api(getConfiguration())
          .getV2Equipments(params)
          .then((response) => dispatch(listEquipments.complete(response)))
          .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, listEquipments.error(error), error)))
      } else {
        return new EquipmentsApi(getConfiguration())
          .getEquipments(params)
          .then((response) => dispatch(listEquipments.complete(response)))
          .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, listEquipments.error(error), error)))
      }
    }
  },
  {
    next: createActionCreator('GET_EQUIPMENTS_REQUEST'),
    complete: createActionCreator('GET_EQUIPMENTS_SUCCESS',
      resolve => (Equipments: PublicEquipment[]) => resolve(Equipments),
    ),
    error: createActionCreator('GET_EQUIPMENTS_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const listEquipment = Object.assign(
  (equipmentId: string): ThunkResult<Promise<void | { type: 'GET_EQUIPMENT_SUCCESS'; payload: PublicEquipment }>> => {
    return async (dispatch) => {
      dispatch(listEquipment.next())

      return new EquipmentsApi(getConfiguration())
        .getEquipmentsEquipmentid({ equipmentId })
        .then((response) => dispatch(listEquipment.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, listEquipment.error(error), error)))
    }
  },
  {
    next: createActionCreator('GET_EQUIPMENT_REQUEST'),
    complete: createActionCreator('GET_EQUIPMENT_SUCCESS',
      resolve => (Equipments: PublicEquipment) => resolve(Equipments),
    ),
    error: createActionCreator('GET_EQUIPMENT_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const allocateContainer = Object.assign(
  (equipmentId: string, params: AllocateInput): ThunkResult<Promise<void | { type: 'CREATE_EQUIPMENT_CONTRACT_SUCCESS'; payload: ContractWithLease }>> => {
    return async (dispatch) => {
      dispatch(allocateContainer.next())

      return new EquipmentsApi(getConfiguration())
        .postEquipmentsEquipmentidContract({ equipmentId, body: params })
        .then((response) => dispatch(allocateContainer.complete(response as any /** FXIME */)))
        .catch(async error => {
          let err
          await aelerApiFailure((error) => {
            err = { containerId: equipmentId, ...error }
            dispatch(allocateContainer.error(error))
          })(error)
          return err
        })
        // .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, allocateContainer.error(error), error)))
    }
  },
  {
    next: createActionCreator('CREATE_EQUIPMENT_CONTRACT_REQUEST'),
    complete: createActionCreator('CREATE_EQUIPMENT_CONTRACT_SUCCESS',
      resolve => (contract: ContractWithLease) => resolve(contract),
    ),
    error: createActionCreator('CREATE_EQUIPMENT_CONTRACT_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const listAvailableEquipments = Object.assign(
  (params: GetEquipmentsRequest): ThunkResult<Promise<void | { type: 'GET_EQUIPMENTS_AVAILABLE_SUCCESS'; payload: PublicEquipment[] }>> => {
    return async (dispatch) => {
      dispatch(listAvailableEquipments.next())

      return new EquipmentsApi(getConfiguration())
        .getEquipments(params)
        .then((response) => dispatch(listAvailableEquipments.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, listAvailableEquipments.error(error), error)))
    }
  },
  {
    next: createActionCreator('GET_EQUIPMENTS_AVAILABLE_REQUEST'),
    complete: createActionCreator('GET_EQUIPMENTS_AVAILABLE_SUCCESS',
      resolve => (Equipments: PublicEquipment[]) => resolve(Equipments),
    ),
    error: createActionCreator('GET_EQUIPMENTS_AVAILABLE_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const markAvailable = Object.assign(
  (equipmentId: string, date: Date, locationId?: string): ThunkResult<Promise<void | { type: 'MARK_EQUIPMENT__AVAILABLE_SUCCESS'; payload: PublicEquipment }>> => {
    return async (dispatch) => {
      dispatch(markAvailable.next())

      return new EquipmentsApi(getConfiguration())
        .postEquipmentsEquipmentidStatusAvailable({
          equipmentId,
          body: {
            stopAtActual: date,
            ...locationId && { depotIdActual: locationId },
          },
        })
        .then((response) => dispatch(markAvailable.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, markAvailable.error(error), error)))
    }
  },
  {
    next: createActionCreator('MARK_EQUIPMENT__AVAILABLE_REQUEST'),
    complete: createActionCreator('MARK_EQUIPMENT__AVAILABLE_SUCCESS',
      resolve => (Equipments: PublicEquipment) => resolve(Equipments),
    ),
    error: createActionCreator('MARK_EQUIPMENT__AVAILABLE_ERROR',
      resolve => error => resolve(error),
    ),
  })

/*
FIXME: LEGACY CODE FROM BOARDS V1 -- remove it later
*/
// export const listEquipmentStatus = Object.assign(
//   (params: GetEquipmentsRequest): ThunkResult<Promise<void | { type: 'GET_EQUIPMENTS_SUCCESS'; payload: PublicEquipment[] }>> => {
//     return async (dispatch) => {
//       dispatch(listEquipments.next())

//       return new EquipmentsApi(getConfiguration())
//         .get(params)
//         .then((response) => dispatch(listEquipments.complete(response)))
//         .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, listEquipments.error(error), error)))
//     }
//   },
//   {
//     next: createActionCreator('GET_EQUIPMENTS_REQUEST'),
//     complete: createActionCreator('GET_EQUIPMENTS_SUCCESS',
//       resolve => (Equipments: PublicEquipment[]) => resolve(Equipments),
//     ),
//     error: createActionCreator('GET_EQUIPMENTS_ERROR',
//       resolve => error => resolve(error),
//     ),
//   })

export const listEquipmentLeaseContracts = Object.assign(
  (equipmentId: string): ThunkResult<Promise<void | { type: 'GET_EQUIPMENTS_LEASES_WITH_CONTRACT_SUCCESS'; payload: ContractWithLease[] }>> => {
    return async (dispatch) => {
      dispatch(listEquipmentLeaseContracts.next())

      return new EquipmentsApi(getConfiguration())
        .getEquipmentsEquipmentidLeasecontracts({ equipmentId: equipmentId })
        .then((response) => dispatch(listEquipmentLeaseContracts.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, listEquipmentLeaseContracts.error(error), error)))
    }
  },
  {
    next: createActionCreator('GET_EQUIPMENTS_LEASES_WITH_CONTRACT_REQUEST'),
    complete: createActionCreator('GET_EQUIPMENTS_LEASES_WITH_CONTRACT_SUCCESS',
      resolve => (Equipments: ContractWithLease[]) => resolve(Equipments),
    ),
    error: createActionCreator('GET_EQUIPMENTS_LEASES_WITH_CONTRACT_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const toggleEquipmentLease = Object.assign(
  (equipmentLeaseContractId: string): ThunkResult<Promise<void | { type: 'TOGGLE_EQUIPMET_LEASE_SUCCESS'; payload: EquipmentLeaseContract }>> => {
    return async (dispatch) => {
      dispatch(toggleEquipmentLease.next())

      return await new LeasesApi(getConfiguration())
        .postLeasesEquipmentleasecontractidToggle({ equipmentLeaseContractId })
        .then((response) => dispatch(toggleEquipmentLease.complete(response as EquipmentLeaseContract)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, toggleEquipmentLease.error(error), error)))
    }
  },
  {
    next: createActionCreator('TOGGLE_EQUIPMET_LEASE_REQUEST'),
    complete: createActionCreator('TOGGLE_EQUIPMET_LEASE_SUCCESS',
      resolve => (lease: EquipmentLeaseContract) => resolve(lease),
    ),
    error: createActionCreator('TOGGLE_EQUIPMET_LEASE_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const createPanelProfile = Object.assign(
  (containerId: string, panelProfile: ContainerPanelProfileInput): ThunkResult<Promise<void | { type: 'CREATE_CONTAINER_PP_SUCCESS'; payload: ContainerPanelProfile }>> => {
    return async (dispatch) => {
      dispatch(createPanelProfile.next())

      return new ContainersApi(getConfiguration())
        .postContainersContaineridPanelprofile({
          containerId,
          body: panelProfile,
        })
        .then((response) => dispatch(createPanelProfile.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, createPanelProfile.error(error), error)))
    }
  },
  {
    next: createActionCreator('CREATE_CONTAINER_PP_REQUEST'),
    complete: createActionCreator('CREATE_CONTAINER_PP_SUCCESS',
      resolve => (profile: ContainerPanelProfile) => resolve(profile),
    ),
    error: createActionCreator('CREATE_CONTAINER_PP_ERROR',
      resolve => error => resolve(error),
    ),
  })

/*
FIXME: LEGACY CODE FROM BOARDS V1 -- remove it later
*/
// export const createSensorProfile = Object.assign(
//   (containerId: string, sensorProfile: ContainerSensorsProfileInput): ThunkResult<Promise<void | { type: 'CREATE_CONTAINER_SP_SUCCESS'; payload: ContainerSensorsProfile }>> => {
//     return async (dispatch) => {
//       dispatch(createSensorProfile.next())

//       return new ContainersApi(getConfiguration())
//         .postContainersContaineridSensorsprofile({
//           containerId,
//           body: sensorProfile as any,
//         })
//         .then((response) => dispatch(createSensorProfile.complete(response)))
//         .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, createSensorProfile.error(error), error)))
//     }
//   },
//   {
//     next: createActionCreator('CREATE_CONTAINER_SP_REQUEST'),
//     complete: createActionCreator('CREATE_CONTAINER_SP_SUCCESS',
//       resolve => (profile: ContainerSensorsProfile) => resolve(profile),
//     ),
//     error: createActionCreator('CREATE_CONTAINER_SP_ERROR',
//       resolve => error => resolve(error),
//     ),
//   })

export const listContainer = Object.assign(
  (containerId: string): ThunkResult<Promise<void | { type: 'GET_CONTAINER_SUCCESS'; payload: ContainerWithProfile }>> => {
    return async (dispatch) => {
      dispatch(listContainer.next())

      return new ContainersApi(getConfiguration())
        .getContainersContainerid({ containerId })
        .then((response) => dispatch(listContainer.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, listContainer.error(error), error)))
    }
  },
  {
    next: createActionCreator('GET_CONTAINER_REQUEST'),
    complete: createActionCreator('GET_CONTAINER_SUCCESS',
      resolve => (Equipments: ContainerWithProfile) => resolve(Equipments),
    ),
    error: createActionCreator('GET_CONTAINER_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const updateContainer = Object.assign(
  (containerId: string, params: ContainerPatchInput): ThunkResult<Promise<void | { type: 'UPDATE_CONTAINER_SUCCESS'; payload: ContainerWithProfile }>> => {
    return async (dispatch) => {
      dispatch(updateContainer.next())

      return await new ContainersApi(getConfiguration())
        .patchContainersContainerid({ containerId, body: params })
        .then((response) => dispatchSuccessWithEffect(dispatch, updateContainer.complete(response as any), ['Container updated']))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, updateContainer.error(error), error)))
    }
  },
  {
    next: createActionCreator('UPDATE_CONTAINER_REQUEST'),
    complete: createActionCreator('UPDATE_CONTAINER_SUCCESS',
      resolve => (container: ContainerWithProfile) => resolve(container),
    ),
    error: createActionCreator('UPDATE_CONTAINER_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const updateEquipmentStatus = Object.assign(
  (equipmentId: string, statusId: string, params: PatchEquipmentStatusInput, throughLease?: boolean): ThunkResult<Promise<void | { type: 'PATCH_EQUIPMENT_STATUS_SUCCESS'; payload: EquipmentStatus }>> => {
    return async (dispatch) => {
      dispatch(updateEquipmentStatus.next())

      return new EquipmentsApi(getConfiguration())
        .patchEquipmentsEquipmentidStatusStatusid({
          equipmentId,
          statusId,
          throughLease: throughLease ? 1 : undefined,
          body: params,
        })
        .then((response) => dispatchSuccessWithEffect(dispatch, updateEquipmentStatus.complete(response), ['Gantt successfully updated']))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, updateEquipmentStatus.error(error), error)))
    }
  },
  {
    next: createActionCreator('PATCH_EQUIPMENT_STATUS_REQUEST'),
    complete: createActionCreator('PATCH_EQUIPMENT_STATUS_SUCCESS',
      resolve => (Equipments: EquipmentStatus) => resolve(Equipments),
    ),
    error: createActionCreator('PATCH_EQUIPMENT_STATUS_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const patchEquipmentLeaseContract = Object.assign(
  (equipmentLeaseContractId: string, input: EquipmentLeaseContractUpdate): ThunkResult<Promise<void | { type: 'PATCH_EQUIPMENT_LEASE_CONTRACT_SUCCESS'; payload: EquipmentLeaseContractWithLease }>> => {
    return async (dispatch) => {
      dispatch(patchEquipmentLeaseContract.next())

      return new LeasecontractsApi(getConfiguration())
        .patchLeasecontractsEquipmentleasecontractid({ equipmentLeaseContractId, body: input })
        .then((response) => dispatchSuccessWithEffect(dispatch, patchEquipmentLeaseContract.complete(response), ['Allocation successfully edited.']))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, patchEquipmentLeaseContract.error(error), error)))
    }
  },
  {
    next: createActionCreator('PATCH_EQUIPMENT_LEASE_CONTRACT_REQUEST'),
    complete: createActionCreator('PATCH_EQUIPMENT_LEASE_CONTRACT_SUCCESS',
      resolve => (Equipments: EquipmentLeaseContractWithLease) => resolve(Equipments),
    ),
    error: createActionCreator('PATCH_EQUIPMENT_LEASE_CONTRACT_ERROR',
      resolve => error => resolve(error),
    ),
  })

/* CUD ACTIONS FOR BOARDS */

export const createBoardPairingProfile = Object.assign(
  (requestParameters: PostBoardpairingprofileRequest): ThunkResult<Promise<void | { type: 'CREATE_BOARD_SUCCESS'; payload: BoardsProfile }>> => {
    return async (dispatch) => {
      dispatch(createBoardPairingProfile.next())

      return new BoardPairingProfileApi(getConfiguration())
        .postBoardpairingprofile(requestParameters)
        .then((response) => dispatch(createBoardPairingProfile.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, createBoardPairingProfile.error(error), error)))
    }
  },
  {
    next: createActionCreator('CREATE_BOARD_REQUEST'),
    complete: createActionCreator('CREATE_BOARD_SUCCESS',
      resolve => (board: BoardsProfile) => resolve(board),
    ),
    error: createActionCreator('CREATE_BOARD_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const archiveBoardProfile = Object.assign(
  (requestParameters: DeleteBoardpairingprofileRequest): ThunkResult<Promise<void | { type: 'DELETE_BOARD_SUCCESS'; payload: any }>> => {
    return async (dispatch) => {
      dispatch(archiveBoardProfile.next())

      return new BoardPairingProfileApi(getConfiguration() as any)
        .deleteBoardpairingprofile(requestParameters)
        .then((response) => dispatchSuccessWithEffect(dispatch, archiveBoardProfile.complete(response), ['Board archived']))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, archiveBoardProfile.error(error), error)))
    }
  },
  {
    next: createActionCreator('DELETE_BOARD_REQUEST'),
    complete: createActionCreator('DELETE_BOARD_SUCCESS',
      resolve => (res) => resolve(res),
    ),
    error: createActionCreator('DELETE_BOARD_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const modifyBoardProfile = Object.assign(
  (requestParameters: PatchBoardpairingprofileRequest): ThunkResult<Promise<void | { type: 'PATCH_BOARD_SUCCESS'; payload: BoardsProfile }>> => {
    return async (dispatch) => {
      dispatch(modifyBoardProfile.next())

      return new BoardPairingProfileApi(getConfiguration())
        .patchBoardpairingprofile(requestParameters)
        .then((response) => dispatchSuccessWithEffect(dispatch, modifyBoardProfile.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, modifyBoardProfile.error(error), error)))
    }
  },
  {
    next: createActionCreator('PATCH_BOARD_REQUEST'),
    complete: createActionCreator('PATCH_BOARD_SUCCESS',
      resolve => (board: BoardsProfile) => resolve(board),
    ),
    error: createActionCreator('PATCH_BOARD_ERROR',
      resolve => error => resolve(error),
    ),
  })

// THIS action is for listing equipments at a facility
// There is an open PR for the backend part of it

// export const getEquipmentsInventory = Object.assign(
//   (depotId: string): ThunkResult<Promise<void | { type: 'LIST_EQUIPMENTS_IN_DEPOT_SUCCESS'; payload: { depotId: string, equipments: PublicEquipment[] }}>> => {
//     return async (dispatch) => {
//       dispatch(getEquipmentsInventory.next())

//       return new EquipmentsApi(getConfiguration())
//         .getEquipmentsInventory({ depotId })
//         .then((response) => dispatch(getEquipmentsInventory.complete({ depotId: depotId, equipments: response })))
//         .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, getEquipmentsInventory.error(error), error)))
//     }
//   },
//   {
//     next: createActionCreator('LIST_EQUIPMENTS_IN_DEPOT_REQUEST'),
//     complete: createActionCreator('LIST_EQUIPMENTS_IN_DEPOT_SUCCESS',
//       resolve => (response: { depotId: string, equipments: PublicEquipment[] }) => resolve(response),
//     ),
//     error: createActionCreator('LIST_EQUIPMENTS_IN_DEPOT_ERROR',
//       resolve => error => resolve(error),
//     ),
//   })
