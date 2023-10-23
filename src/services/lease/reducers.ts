import { createReducer } from 'deox'

import Config from '../../config.json'
import { EquipmentLeasesPublicFromJSON, LeaseVisibilityContractFromJSON } from '../../apis-client'

import {
  createLease, createLeaseStatus, listLeasesOngoing, listLeases, listAssignableLeases, updateLease,
  addVisibilityContract,
  listVisibilityContracts,
  updateVisibilityContracts,
  sendBookingEmail,
  deleteLease,
} from './actions'
import * as t from './types'
import mockLeases from './mock-leases.json'
import mockVizContracts from './mock-visibility.json'

const initialState: t.LeaseReducerState = {
  // set isNewlyInsertedFlag on a lease for testing purposes
  leases: Config.FF_ENABLE_MOCK !== undefined && Config.FF_ENABLE_MOCK === 'true'
    ? mockLeases.map(EquipmentLeasesPublicFromJSON).map((item, Index) => Index === 5 ? { ...item, isNewlyInserted: true } : item)
    : [],
  assignableLeases: [],
  loadingStatus: false,
  isCreatingLease: false,
  vizContracts: Config.FF_ENABLE_MOCK !== undefined && Config.FF_ENABLE_MOCK === 'true'
    ? mockVizContracts.map(LeaseVisibilityContractFromJSON)
    : [],
}

export const leaseReducers = createReducer(initialState, handleAction => [
  // Create Lease
  handleAction(createLease.next, (state) => ({
    ...state,
    isCreatingLease: true,
  })),
  handleAction(createLease.complete, (state: t.LeaseReducerState, { payload }) => ({
    ...state,
    leases: [
      ...state.leases,
      { ...payload, isNewlyInserted: true },
    ],
    isCreatingLease: false,
    // lease: state.leases.map(cs => cs.equipmentId === (payload as any).equipmentId /** FIXME */ ? payload : cs),
  })),
  handleAction(createLease.error, (state) => ({
    ...state,
    isCreatingLease: false,
  })),
  // delete lease
  handleAction(deleteLease.next, (state) => ({
    ...state,
  })),
  handleAction(deleteLease.complete, (state: t.LeaseReducerState, { payload }) => {
    const orderId = payload[0].orderId
    return ({
      ...state,
      leases: state.leases.filter(l => l.orderId !== orderId),
    })
  }),
  handleAction(deleteLease.error, (state) => ({
    ...state,
  })),
  // Create Lease Status
  handleAction(createLeaseStatus.next, (state) => ({
    ...state,
  })),
  handleAction(createLeaseStatus.complete, (state: t.LeaseReducerState, { payload }) => ({
    ...state,
    leases: state.leases.map(lease => {
      return lease.orderId === payload.orderId
        ? {
            ...lease,
            equipmentleasestatuses: [payload],
          }
        : lease
    }),
    // leaseStatus: state.leases.filter(cs => cs.equipmentId === payload.equipmentId ? payload : cs),
  })),
  handleAction(createLeaseStatus.error, (state) => ({
    ...state,
  })),
  // List ongoing
  handleAction(listLeasesOngoing.next, (state) => ({
    ...state,
  })),
  handleAction(listLeasesOngoing.complete, (state: t.LeaseReducerState, { payload }) => ({
    ...state,
    leases: payload,
  })),
  handleAction(listLeasesOngoing.error, (state) => ({
    ...state,
  })),
  // List
  handleAction(listLeases.next, (state) => ({
    ...state,
    loadingStatus: true,
  })),
  handleAction(listLeases.complete, (state: t.LeaseReducerState, { payload }) => ({
    ...state,
    leases: payload,
    loadingStatus: false,
  })),
  handleAction(listLeases.error, (state) => ({
    ...state,
    loadingStatus: false,
  })),
  // List assignable
  handleAction(listAssignableLeases.next, (state) => ({
    ...state,
  })),
  handleAction(listAssignableLeases.complete, (state: t.LeaseReducerState, { payload }) => ({
    ...state,
    assignableLeases: payload,
  })),
  handleAction(listAssignableLeases.error, (state) => ({
    ...state,
  })),
  // List assignable
  handleAction(updateLease.next, (state) => ({
    ...state,
  })),
  handleAction(updateLease.complete, (state: t.LeaseReducerState, { payload }) => ({
    ...state,
    leases: state.leases.map(l => l.orderId === payload.orderId ? payload : l),
  })),
  handleAction(updateLease.error, (state) => ({
    ...state,
  })),
  /** VIZ CONTRACTS */
  // Create
  handleAction(addVisibilityContract.next, (state) => ({
    ...state,
  })),
  handleAction(addVisibilityContract.complete, (state: t.LeaseReducerState, { payload }) => ({
    ...state,
    vizContracts: [
      ...state.vizContracts,
      { ...payload },
    ],
  })),
  handleAction(addVisibilityContract.error, (state) => ({
    ...state,
  })),
  // List
  handleAction(listVisibilityContracts.next, (state) => ({
    ...state,
  })),
  handleAction(listVisibilityContracts.complete, (state: t.LeaseReducerState, { payload }) => ({
    ...state,
    vizContracts: [
      ...state.vizContracts,
      ...payload.filter(e => !state.vizContracts.map(ei => ei.leaseVisibilityContractId).includes(e.leaseVisibilityContractId)),
    ],
  })),
  handleAction(listVisibilityContracts.error, (state) => ({
    ...state,
  })),
  // Update
  handleAction(updateVisibilityContracts.next, (state) => ({
    ...state,
  })),
  handleAction(updateVisibilityContracts.complete, (state: t.LeaseReducerState, { payload }) => ({
    ...state,
    vizContracts: state.vizContracts.map(vc => payload.map(e => e.leaseVisibilityContractId).includes(vc.leaseVisibilityContractId) ? payload : vc).flat(),
  })),
  handleAction(updateVisibilityContracts.error, (state) => ({
    ...state,
  })),
  // Send booking email
  handleAction(sendBookingEmail.next, (state) => ({
    ...state,
  })),
  handleAction(sendBookingEmail.complete, (state: t.LeaseReducerState, { payload }) => ({
    ...state,
  })),
  handleAction(sendBookingEmail.error, (state) => ({
    ...state,
  })),
])
