import { createReducer } from 'deox'

import Config from '../../config.json'
import { ContainerWithProfileFromJSON, PublicEquipmentFromJSON } from '../../apis-client'

import {
  allocateContainer,
  createContainer,
  createEquipmentStatus,
  listEquipments,
  listEquipment,
  listAvailableEquipments,
  markAvailable,
  listEquipmentLeaseContracts,
  toggleEquipmentLease,
  listContainer,
  updateContainer,
  updateEquipmentStatus,
  patchEquipmentLeaseContract,
  modifyBoardProfile,
  archiveBoardProfile,
  createBoardPairingProfile,
} from './actions'
import * as t from './types'
import mockEquipments from './mock-equipments.json'
import mockContainer from './mock_cont1.json'

const initialState: t.EquipmentReducerState = {
  equipments: Config.FF_ENABLE_MOCK !== undefined && Config.FF_ENABLE_MOCK === 'true' ? mockEquipments.map(PublicEquipmentFromJSON) : [],
  equipmentsInDepots: [],
  availableEquipments: [],
  loadingStatus: false,
  allocations: [],
  containers: Config.FF_ENABLE_MOCK !== undefined && Config.FF_ENABLE_MOCK === 'true' ? mockContainer.map(ContainerWithProfileFromJSON) : [],
}

export const equipmentReducers = createReducer(initialState, handleAction => [
  // Create Equipment
  handleAction(createContainer.next, (state) => ({
    ...state,
  })),
  handleAction(createContainer.complete, (state: t.EquipmentReducerState, { payload }) => ({
    ...state,
    equipments: [
      ...state.equipments,
      { equipmentId: payload.equipmentId, isNewlyInserted: true },
    ],
    // Equipment: state.equipments.map(cs => cs.equipmentId === (payload as any).equipmentId /** FIXME */ ? payload : cs),
  })),
  handleAction(createContainer.error, (state) => ({
    ...state,
  })),
  // Create Equipment Status
  handleAction(createEquipmentStatus.next, (state) => ({
    ...state,
  })),
  handleAction(createEquipmentStatus.complete, (state: t.EquipmentReducerState, { payload }) => ({
    ...state,
    equipments: state.equipments.map(eq => eq.equipmentId === payload.equipmentId
      ? {
          ...eq,
          status: payload.status as any,
        }
      : eq),
    // EquipmentStatus: state.equipments.filter(cs => cs.equipmentId === payload.equipmentId ? payload : cs),
  })),
  handleAction(createEquipmentStatus.error, (state) => ({
    ...state,
  })),
  // List
  handleAction(listEquipments.next, (state) => ({
    ...state,
    loadingStatus: true,
  })),
  handleAction(listEquipments.complete, (state: t.EquipmentReducerState, { payload }) => ({
    ...state,
    equipments: payload,
    loadingStatus: false,
  })),
  handleAction(listEquipments.error, (state) => ({
    ...state,
    loadingStatus: false,
  })),
  // List available
  handleAction(listAvailableEquipments.next, (state) => ({
    ...state,
    loadingStatus: true,
  })),
  handleAction(listAvailableEquipments.complete, (state: t.EquipmentReducerState, { payload }) => ({
    ...state,
    availableEquipments: payload,
    loadingStatus: false,
  })),
  handleAction(listAvailableEquipments.error, (state) => ({
    ...state,
    loadingStatus: false,
  })),
  // List one
  handleAction(listEquipment.next, (state) => ({
    ...state,
    loadingStatus: true,
  })),
  handleAction(listEquipment.complete, (state: t.EquipmentReducerState, { payload }) => {
    const existingEq = state.equipments.find(e => e.equipmentId === payload.equipmentId)
    const updatedEquipments = existingEq !== undefined
      ? state.equipments.map(eq => eq.equipmentId === payload.equipmentId ? { ...payload, isNewlyInserted: eq.isNewlyInserted } : eq)
      : [...state.equipments, payload]
    return ({
      ...state,
      equipments: updatedEquipments,
      loadingStatus: false,
    })
  }),
  handleAction(listEquipment.error, (state) => ({
    ...state,
    loadingStatus: false,
  })),
  // List available
  // handleAction(listAvailableEquipments.next, (state) => ({
  //   ...state,
  // })),
  // handleAction(listAvailableEquipments.complete, (state: t.EquipmentReducerState, { payload }) => ({
  //   ...state,
  //   availableEquipments: payload, // state.equipments.filter(e => payload.map(pe => pe.equipmentId).includes(e.equipmentId)),
  // })),
  // handleAction(listAvailableEquipments.error, (state) => ({
  //   ...state,
  // })),
  // Mark available
  handleAction(markAvailable.next, (state) => ({
    ...state,
  })),
  handleAction(markAvailable.complete, (state: t.EquipmentReducerState, { payload }) => ({
    ...state,
    equipments: state.equipments.map(eq => eq.equipmentId === payload.equipmentId ? payload : eq),
    // availableEquipments: payload,
    // FIXME
  })),
  handleAction(markAvailable.error, (state) => ({
    ...state,
  })),
  // Contracts
  handleAction(allocateContainer.next, (state) => ({
    ...state,
  })),
  handleAction(allocateContainer.complete, (state: t.EquipmentReducerState, { payload }) => ({
    ...state,
    allocations: [...state.allocations, payload],
    equipments: state.equipments.map(eq => eq.equipmentId === payload.equipmentId
      ? { ...eq, ...payload }
      : eq),
  })),
  handleAction(allocateContainer.error, (state) => ({
    ...state,
  })),
  handleAction(listEquipmentLeaseContracts.next, (state) => ({
    ...state,
  })),
  handleAction(listEquipmentLeaseContracts.complete, (state: t.EquipmentReducerState, { payload }) => {
    const previousAllocations = payload?.length ? state.allocations.filter(e => e.equipmentId !== payload[0].equipmentId) : state.allocations
    const updatedAllocations = [...(previousAllocations || []), ...payload]

    return ({
      ...state,
      allocations: updatedAllocations,
    })
  }),
  handleAction(listEquipmentLeaseContracts.error, (state) => ({
    ...state,
  })),
  handleAction(patchEquipmentLeaseContract.next, (state) => ({
    ...state,
  })),
  handleAction(patchEquipmentLeaseContract.complete, (state: t.EquipmentReducerState, { payload }) => {
    return ({
      ...state,
      allocations: state.allocations.map(a => a.equipmentLeaseContractId === payload.equipmentLeaseContractId
        ? ({ ...a, payload })
        : a,
      ),
      equipments: state.equipments.map(e => e.currentStatus?.equipmentLeaseContractId === payload.equipmentLeaseContractId
        ? ({ ...e, equipmentstatus: payload })
        : e,
      ),
    })
  }),
  handleAction(patchEquipmentLeaseContract.error, (state) => ({
    ...state,
  })),
  // Toggle Lease
  handleAction(toggleEquipmentLease.next, (state) => ({
    ...state,
  })),
  handleAction(toggleEquipmentLease.complete, (state: t.EquipmentReducerState, { payload }) => ({
    ...state,
    allocations: state.allocations.map(al => al.equipmentLeaseContractId === payload.equipmentLeaseContractId ? { ...al, active: payload.active } : al),
    // lease: state.leases.map(cs => cs.equipmentId === (payload as any).equipmentId /** FIXME */ ? payload : cs),
  })),
  handleAction(toggleEquipmentLease.error, (state) => ({
    ...state,
  })),
  // List container details
  handleAction(listContainer.next, (state) => ({
    ...state,
    loadingStatus: true,
  })),
  handleAction(listContainer.complete, (state: t.EquipmentReducerState, { payload }) => {
    const existingCont = state.containers.find(e => e.containerId === payload.containerId)
    const updatedContainers = existingCont !== undefined
      ? state.containers.map(eq => eq.containerId === payload.containerId ? payload : eq)
      : [...state.containers, payload]

    return ({
      ...state,
      containers: updatedContainers,
      loadingStatus: false,
    })
  }),
  handleAction(listContainer.error, (state) => ({
    ...state,
    loadingStatus: false,
  })),
  // Update container details
  handleAction(updateContainer.next, (state) => ({
    ...state,
  })),
  handleAction(updateContainer.complete, (state: t.EquipmentReducerState, { payload }) => {
    const existingCont = state.containers.find(e => e.containerId === payload.containerId)
    const updatedContainers = existingCont !== undefined
      ? state.containers.map(eq => eq.containerId === payload.containerId ? payload : eq)
      : [...state.containers, payload]

    const updatedEquipments = state.equipments.map((e) => e.aelerContainerId === payload.containerId
      ? { ...e, container: payload }
      : e)

    return ({
      ...state,
      containers: updatedContainers,
      equipments: updatedEquipments,
    })
  }),
  handleAction(updateContainer.error, (state) => ({
    ...state,
  })),
  // Update Equipment Status
  handleAction(updateEquipmentStatus.next, (state) => ({
    ...state,
  })),
  handleAction(updateEquipmentStatus.complete, (state: t.EquipmentReducerState, { payload }) => ({
    ...state,
    // equipments: state.equipments.map(eq => eq.equipmentId === payload.equipmentId
    //   ? {
    //       ...eq,
    //       currentStatus: payload.status as any, // FIXME: this is wrong
    //     }
    //   : eq),
    // EquipmentStatus: state.equipments.filter(cs => cs.equipmentId === payload.equipmentId ? payload : cs),
  })),
  handleAction(updateEquipmentStatus.error, (state) => ({
    ...state,
  })),
  // Create Board
  handleAction(createBoardPairingProfile.next, (state) => ({
    ...state,
  })),
  handleAction(createBoardPairingProfile.complete, (state: t.EquipmentReducerState, { payload }) => ({
    ...state,
  })),
  handleAction(createBoardPairingProfile.error, (state) => ({
    ...state,
  })),
  // Update Board
  handleAction(modifyBoardProfile.next, (state) => ({
    ...state,
  })),
  handleAction(modifyBoardProfile.complete, (state: t.EquipmentReducerState, { payload }) => ({
    ...state,
  })),
  handleAction(modifyBoardProfile.error, (state) => ({
    ...state,
  })),
  // Archive Board
  handleAction(archiveBoardProfile.next, (state) => ({
    ...state,
  })),
  handleAction(archiveBoardProfile.complete, (state: t.EquipmentReducerState, response) => ({
    ...state,
  })),
  handleAction(archiveBoardProfile.error, (state) => ({
    ...state,
  })),

  // Get Equipments in Facility
  // handleAction(getEquipmentsInventory.next, (state) => ({
  //   ...state,
  // })),
  // handleAction(getEquipmentsInventory.complete, (state: t.EquipmentReducerState, { payload }) => {
  //   const containerIdx = state.equipmentsInDepots.findIndex(({ depotId }) => depotId === payload.depotId)

  //   const depotInventory = containerIdx !== -1
  //     ? state.equipmentsInDepots.map(equipments => equipments.depotId === payload.depotId ? payload : equipments)
  //     : state.equipmentsInDepots

  //   if (containerIdx === -1) depotInventory.push(payload)
  //   return ({
  //     ...state,
  //     equipmentsInDepots: depotInventory,
  //     // loadingSensors: state.loadingSensors.filter(id => id !== payload.isoCode),
  //   })
  // }),
  // handleAction(getEquipmentsInventory.error, (state) => ({
  //   ...state,
  // })),
])
