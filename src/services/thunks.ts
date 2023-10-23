import { responsiveProperty } from '@mui/material/styles/cssUtils'
import { getDateRangePickerViewDesktopUtilityClass } from '@mui/x-date-pickers-pro'

import { EquipmentLeaseContractUpdate, EquipmentLeaseStatusOrderStatusEnum, ExchangeLocationInput, PostEquipmentsEquipmentidStatusRequest } from '../apis-client'
import { FacilityInput } from '../apis-client/svc-places'
import { ThunkResult } from '../frameworks/types'
import { showError, showSuccessSnackbar } from '../store/error/actions'
import { notEmpty } from '../ui/components/shared/utils'

import { createAelerBoard, listAelerBoards, listKizyBoards, listNexxiotBoards, createKizyBoard, getBoardContainerId, archiveAelerBoard, listMostBoards } from './boards/actions'
import { Board } from './boards/types'
import {
  allocateContainer as allocateContainerAction, createContainer, createPanelProfile, listEquipment, listEquipments, toggleEquipmentLease, patchEquipmentLeaseContract, updateEquipmentStatus, listContainer,
  createEquipmentStatus as createEquipmentStatus_,
  createBoardPairingProfile,
  archiveBoardProfile,
  modifyBoardProfile,
} from './equipment/actions'
import { ContainerBoardPairingProfilePatchInput, ContainerBoardPairingProfilePostInput, ContainerInput, ContainerPanelProfileInput, ContainerSensorsProfileInput, ContractWithLease, DeleteBoardpairingprofileRequest } from './equipment/types'
import { createLease, createLeaseStatus, listLeases } from './lease/actions'
import { OrderStatusEnum, EquipmentLeaseInput } from './lease/types'
import { addAddress, addFacility, addLocation } from './places/actions'
// import { createOrder, createOrderStatus, getOngoingOrders, getOrders } from './equipmentLease/actions'

// export const getContainerStatus = (date: Date): ThunkResult<void> =>
//   (dispatch) => {
//     dispatch(getRecentContainerStatus())
//       .then(() => dispatch(getRecentContainerMovements(date))) // availability 
//       // .then(() => dispatch(getOngoingOrders(date)))
//       .then(() => dispatch(getOrders()))
//   }

// export const getAvailableContainers = (date: Date, depotIds: string[]): ThunkResult<void> =>
//   (dispatch) => {
//     dispatch(getAvailableContainerStatus({ availableDate: date, depotIds }))
//       .then(() => dispatch(getRecentContainerMovements(date))) // availability 
//       .then(() => dispatch(getOngoingOrders(date)))
//   }

const isUniqueTypeError = (errors?: any[]) => {
  if (errors && Array.isArray(errors) && errors.length === 2) {
    if (
      errors.includes('orderId must be unique') &&
      errors.includes('equipmentId must be unique')
    ) return true
  }
  return false
}

export const allocateContainers = (equipmentIds: string[], options: { orderId: string }): any =>
  (dispatch: any /** FIXME */) => {
    const calls = equipmentIds.map(id => allocateContainerAction(id, options))

    return Promise.all(
      calls.map(c => dispatch(c)),
    ).then(
      (c) => {
        let alreadyAllocated = 0
        const nonUniqueErrors: any[] = []
        c?.forEach((resp: { payload?: ContractWithLease, containerId?: string, errors: any[] } | undefined) => {
          if (isUniqueTypeError(resp?.errors)) {
            resp?.containerId && alreadyAllocated++
          } else {
            resp?.errors && nonUniqueErrors.push(resp?.errors)
          }
          if (resp?.payload?.equipmentId) dispatch(listEquipment(resp.payload.equipmentId))
        })
        dispatch(listLeases({})) // FIXME: list single lease that got updated: listLease({orderId})
        const success = c?.map((resp: { payload?: ContractWithLease }) => resp?.payload).filter(notEmpty)
        if (success.length) dispatch(showSuccessSnackbar([`${success.length} / ${equipmentIds.length} container(s) allocated`]))
        if (alreadyAllocated) dispatch(showError([`${alreadyAllocated} container(s) already allocated to order`]))
        if (nonUniqueErrors.length) dispatch(showError(nonUniqueErrors.flat() as string[]))
      },
    )
  }

export const createNewContainer = (container: ContainerInput, panelProfile?: ContainerPanelProfileInput, boardPairingProfiles?: ContainerBoardPairingProfilePostInput[]): ThunkResult<void> =>
  (dispatch) => {
    const containerToCreate = {
      containerId: container.containerId,
      inspectionDate: container.inspectionDate,
      cscCertNo: container.cscCertNo,
      cscCertDate: container.cscCertDate,
      cscCertLink: container.cscCertLink,
      status: container.status,
      depotId: container.depotId,
      depotAvailabilityDatePlanned: container.depotAvailabilityDatePlanned,
      depotAvailabilityDateActual: container.depotAvailabilityDateActual,
      characteristics_size: container.characteristics_size as any,
      characteristics_type: container.characteristics_type as any,
      containerVersion: container.containerVersion,
      characteristics_maxPayload: container.characteristics_maxPayload,
      characteristics_builtYear: container.characteristics_builtYear,
      volume: parseInt(String(container.volume)),
      characteristics_grade: container.characteristics_grade,
      characteristics_tare: parseInt(String(container.characteristics_tare)),
      electronicsCharging: container.electronicsCharging,
      insurance: container.insurance,
      cameraExt: container.cameraExt,
      cameraInt: container.cameraInt,
      doorType: container.doorType,
      floorType: container.floorType,
    }

    dispatch(createContainer(containerToCreate)).then(r => {
      // console.log(r, r?.payload)
      if (r && r.payload) {
        dispatch(listEquipment(r.payload.equipmentId))
        if (panelProfile) dispatch(createPanelProfile(container.containerId, panelProfile))
        if (boardPairingProfiles && boardPairingProfiles?.length > 0) {
          boardPairingProfiles.forEach((boardPairingProfile) => dispatch(createBoardPairingProfile({ body: boardPairingProfile })))
        }
      }
    })
  }

export const createEquipmentStatus = (input: PostEquipmentsEquipmentidStatusRequest): ThunkResult<void> =>
  (dispatch) => {
    dispatch(createEquipmentStatus_(input)).then(r => {
      if (r && r.payload) {
        dispatch(listEquipment(r.payload.equipmentId))
      }
    })
  }

// export const createNewOrder = (order: OrderInput): ThunkResult<void> =>
//   (dispatch) =>
//     dispatch(createOrder({ body: order })).then(
//       () => dispatch(getOrders()),
//     )

// export const markArrived = (container: ContainerStatusInput): ThunkResult<void> =>
//   (dispatch) => {
//     dispatch(createContainerStatus(container))
//       .then(
//         () => dispatch(getContainerStatus(new Date())),
//       )
//   }

// export const markOrderEnded = (orders: PublicOrder[], orderStatus: OrderStatusOrderStatusEnum): ThunkResult<void> =>
//   (dispatch) => {
//     orders.forEach(
//       order => dispatch(createOrderStatus(({
//         id: order.id,
//         orderStatus: orderStatus as any,
//         contractStatus: order.orderStatus?.contractStatus as any,
//       }))).then(() => dispatch(getOrders())),
//     )
//   }

export const createNewLocation = (loc: ExchangeLocationInput, callback: (loc?: string) => any): ThunkResult<void> =>
  (dispatch) =>
    dispatch(addLocation(loc)).then((createdLocation) =>
      callback(createdLocation ? createdLocation.payload.exchangeLocationId : undefined),
    )

export const createOrderWithStatus = (order: EquipmentLeaseInput, orderStatus: OrderStatusEnum): ThunkResult<any> =>
  (dispatch) =>
    dispatch(createLease({
      lease: {
        orderId: order.orderId,
        customerId: order.customerId,
        timePlaced: order.timePlaced,
        pickupLocation: order.pickupLocation,
        dropoffLocation: order.dropoffLocation,
        returnDate: order.returnDate,
        executionDate: order.executionDate,
        units: order.units,
        customersBookingNumber: order.customersBookingNumber,
      },
      status: {
        contractStatus: order.contractStatus,
      },
    })).then(async (resp) => {
      const resp_ = resp && await dispatch(createLeaseStatus(resp.payload.orderId, {
      // contractStatus: (lease.orderStatus as any).contractStatus
        contractStatus: order.contractStatus as any,
        orderStatus: orderStatus as any,
      }))

      return resp_
    })

type Ext = {
  cityId: string;
  countryId: string;
  region: string;
  addressName: string;
  zipCode: string;
}
export const addDepotWithAddress = (input: Partial<FacilityInput & Ext>): ThunkResult<void> =>
  (dispatch) => {
    if (input.name && input.partnershipTypes) {
      if (input.addressId) {
        return dispatch(addFacility({
          name: input.name,
          addressId: input.addressId,
          partnershipTypes: input.partnershipTypes as any,
          type: input.type as any,
          code: input.code?.toUpperCase() || 'XXXX',
        }))
      } else if (input.cityId && input.countryId && input.region) {
        const address = {
          cityId: input.cityId,
          countryId: input.countryId,
          region: input.region as any,
          optional: {
            ...input.addressName && { name: input.addressName },
            ...input.zipCode && { zipCode: input.zipCode },
          },
        }
        return dispatch(addAddress(address)).then((createdAddress) => {
          return createdAddress
            ? dispatch(addFacility({
              name: input.name as string,
              addressId: createdAddress.payload.addressId,
              partnershipTypes: input.partnershipTypes as any,
              type: input.type as any,
              code: input.code?.toUpperCase() || 'XXXX',
            }))
            : dispatch(showError(['Error creating address']))
        })
      } else {
        dispatch(showError(['Missing input']))
      }
    } else {
      dispatch(showError(['Missing input']))
    }
  }

export const toggleLease = (contractId: string, callback?: (...params: any[]) => void): ThunkResult<void> =>
  (dispatch) =>
    dispatch(toggleEquipmentLease(contractId))
      .then((contract) => {
        contract && dispatch(listEquipment(contract.payload.equipmentId))
        if (callback) callback()
      })

export const createBoard = (board: Board, provider: string): ThunkResult<void> =>
  (dispatch) => {
    const newBoard = {
      boardId: board.boardId,
      hasGps: board.hasGps,
      hasShock: board.hasShock,
      hasTempExt: board.hasTempExt,
      hasTempInt: board.hasTempInt,
      hasPressureExt: board.hasPressureExt,
      hasPressureInt: board.hasPressureInt,
      hasGases: board.hasGases,
      hasLightInt: board.hasLightInt,
      hasLightExt: board.hasLightExt,
      hasDoor: board.hasDoor,
      hasRFID: board.hasRFID,
    }
    provider === 'aeler' && dispatch(createAelerBoard(newBoard))
    // provider === 'nexxiot' && dispatch(createNexxiotBoard(newBoard)) // Nexxiot boards are created automatically, no need to create them manually!
    // provider === 'kizy' && dispatch(createKizyBoard(newBoard)) // Kizy boards are created automatically, no need to create them manually!
  }

export const listBoards = (): ThunkResult<void> =>
  (dispatch) => {
    dispatch(listAelerBoards()).then((response) => {
      if (response && response.payload) {
        const ids = response.payload.map(board => board.boardId)
        dispatch(getBoardContainerId(ids, 'aeler'))
      }
    })

    dispatch(listNexxiotBoards()).then((response) => {
      if (response && response.payload) {
        const ids = response.payload.map(board => board.boardId)
        dispatch(getBoardContainerId(ids, 'nexxiot'))
      }
    })

    dispatch(listKizyBoards()).then((response) => {
      if (response && response.payload) {
        const ids = response.payload.map(board => board.boardId)
        dispatch(getBoardContainerId(ids, 'kizy'))
      }
    })

    dispatch(listMostBoards({})).then((response) => {
      if (response && response.payload) {
        const ids = response.payload.map(board => board.boardId)
        dispatch(getBoardContainerId(ids, 'most'))
      }
    })
  }

export const updateEquipmentLeaseContract = (equipmentLeaseContractId: string, input: EquipmentLeaseContractUpdate, callback?: () => void): ThunkResult<void> =>
  (dispatch) =>
    dispatch(patchEquipmentLeaseContract(equipmentLeaseContractId, input)).then(() => {
      callback && callback()
    })

export const updateStatus = (equipmentId: string, statusId: string, newStatus: any, throughLease?: boolean): ThunkResult<void> =>
  (dispatch) => {
    dispatch(updateEquipmentStatus(equipmentId, statusId, newStatus, throughLease)).then(() => {
      dispatch(listEquipment(equipmentId))
    })
  }

/*
FIXME: LEGACY CODE FROM BOARDS V1 -- remove it later
*/
// export const postBoardProfile = (containerId: string, boardProfile: ContainerSensorsProfileInput): ThunkResult<void> =>
//   (dispatch) => {
//     dispatch(createSensorProfile(containerId, boardProfile))
//       .then(() => { dispatch(listContainer(containerId)) })
//   }

export const postBoardProfile = (containerId: string, board: ContainerBoardPairingProfilePostInput): ThunkResult<void> => {
  return (dispatch) => {
    dispatch(createBoardPairingProfile({ body: board }))
      .then(() => {
        dispatch(listContainer(containerId))
      })
  }
}

export const deleteBoardProfile = (containerId: string, body: DeleteBoardpairingprofileRequest): ThunkResult<void> =>
  (dispatch) => {
    dispatch(archiveBoardProfile(body))
      .then(() => {
        dispatch(listContainer(containerId))
      })
  }

export const patchBoardProfile = (containerId: string, boardPairingProfileId: string, board: ContainerBoardPairingProfilePatchInput): ThunkResult<void> =>
  (dispatch) => {
    dispatch(modifyBoardProfile({ body: { boardPairingProfileId: boardPairingProfileId, payload: board } }))
      .then(() => {
        dispatch(listContainer(containerId))
      })
  }

export const createNewOrder = (newOrder: EquipmentLeaseInput, allocatableContainers: string[], callback: () => void): ThunkResult<void> =>
  (dispatch) => {
    dispatch(createOrderWithStatus(newOrder, OrderStatusEnum.Accepted))
      .then((resp: any) => {
        if (resp?.payload?.orderId) {
          dispatch(allocateContainers(allocatableContainers, { orderId: resp?.payload?.orderId }))
        }
      })
      .then(() => {
        callback()
      })
  }
