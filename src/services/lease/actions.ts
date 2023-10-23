import { createActionCreator } from 'deox'

import {
  LeasesApi,
  EquipmentLeaseInput,
  EquipmentLeaseStatusInput,
  // GetLeasesOngoingRequest,
  GetLeasesRequest,
  EquipmentLeasePatchInput,
  // GetLeasesAssignableRequest,
  LeaseVisibilityInput,
  LeaseVisibilityPatchInput,
  EquipmentLeaseContractInput,
} from '../../apis-client'
import { ThunkResult } from '../../frameworks/types'
import { aelerApiFailure } from '../../frameworks/apiUtils'
import { getConfiguration } from '../auth/keycloak'
import { dispatchErrorWithEffect, dispatchSuccessWithEffect } from '../../store/effects'

import { EquipmentLeaseContract, Lease, LeaseStatus, LeaseVisibilityContract } from './types'

export const createLease = Object.assign(
  (params: EquipmentLeaseInput): ThunkResult<Promise<void | { type: 'CREATE_LEASE_SUCCESS'; payload: Lease }>> => {
    return async (dispatch) => {
      dispatch(createLease.next())

      return await new LeasesApi(getConfiguration())
        .postLeases({ body: params })
        .then((response) => dispatchSuccessWithEffect(dispatch, createLease.complete(response as Lease), ['Lease created']))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, createLease.error(error), error)))
    }
  },
  {
    next: createActionCreator('CREATE_LEASE_REQUEST'),
    complete: createActionCreator('CREATE_LEASE_SUCCESS',
      resolve => (lease: Lease) => resolve(lease),
    ),
    error: createActionCreator('CREATE_LEASE_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const createLeaseStatus = Object.assign(
  (orderId: string, params: EquipmentLeaseStatusInput): ThunkResult<Promise<void | { type: 'POST_LEASE_STATUS_SUCCESS'; payload: LeaseStatus }>> => {
    return async (dispatch) => {
      dispatch(createLeaseStatus.next())

      return new LeasesApi(getConfiguration())
        .postLeasesOrderidStatus({
          orderId, body: params,
        })
        .then((response) => dispatch(createLeaseStatus.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, createLeaseStatus.error(error), error)))
    }
  },
  {
    next: createActionCreator('POST_LEASE_STATUS_REQUEST'),
    complete: createActionCreator('POST_LEASE_STATUS_SUCCESS',
      resolve => (status: LeaseStatus) => resolve(status),
    ),
    error: createActionCreator('POST_LEASE_STATUS_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const listLeasesOngoing = Object.assign(
  (params: GetLeasesRequest): ThunkResult<Promise<void | { type: 'GET_LEASES_ONGOING_SUCCESS'; payload: Lease[] }>> => {
    return async (dispatch) => {
      dispatch(listLeasesOngoing.next())

      return new LeasesApi(getConfiguration())
        .getLeases(params)
        .then((response) => dispatch(listLeasesOngoing.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, listLeasesOngoing.error(error), error)))
    }
  },
  {
    next: createActionCreator('GET_LEASES_ONGOING_REQUEST'),
    complete: createActionCreator('GET_LEASES_ONGOING_SUCCESS',
      resolve => (leases: Lease[]) => resolve(leases),
    ),
    error: createActionCreator('GET_LEASES_ONGOING_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const listLeases = Object.assign(
  (params: GetLeasesRequest): ThunkResult<Promise<void | { type: 'GET_LEASES_SUCCESS'; payload: Lease[] }>> => {
    return async (dispatch) => {
      dispatch(listLeases.next())

      return new LeasesApi(getConfiguration())
        .getLeases(params)
        .then((response) => dispatch(listLeases.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, listLeases.error(error), error)))
    }
  },
  {
    next: createActionCreator('GET_LEASES_REQUEST'),
    complete: createActionCreator('GET_LEASES_SUCCESS',
      resolve => (leases: Lease[]) => resolve(leases),
    ),
    error: createActionCreator('GET_LEASES_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const listAssignableLeases = Object.assign(
  (params: GetLeasesRequest): ThunkResult<Promise<void | { type: 'GET_LEASES_ASSIGNABLE_SUCCESS'; payload: Lease[] }>> => {
    return async (dispatch) => {
      dispatch(listAssignableLeases.next())

      return new LeasesApi(getConfiguration())
        .getLeases({
          ...params,
          status: 'ASSIGNABLE',
          // statusAt: new Date().toISOString(),
        })
        .then((response) => dispatch(listAssignableLeases.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, listAssignableLeases.error(error), error)))
    }
  },
  {
    next: createActionCreator('GET_LEASES_ASSIGNABLE_REQUEST'),
    complete: createActionCreator('GET_LEASES_ASSIGNABLE_SUCCESS',
      resolve => (leases: Lease[]) => resolve(leases),
    ),
    error: createActionCreator('GET_LEASES_ASSIGNABLE_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const updateLease = Object.assign(
  (orderId: string, params: EquipmentLeasePatchInput): ThunkResult<Promise<void | { type: 'UPDATE_LEASE_SUCCESS'; payload: Lease }>> => {
    return async (dispatch) => {
      dispatch(updateLease.next())

      return await new LeasesApi(getConfiguration())
        .patchLeasesOrderid({ orderId, body: params })
        .then((response) => dispatchSuccessWithEffect(dispatch, updateLease.complete(response as Lease), ['Lease updated']))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, updateLease.error(error), error)))
    }
  },
  {
    next: createActionCreator('UPDATE_LEASE_REQUEST'),
    complete: createActionCreator('UPDATE_LEASE_SUCCESS',
      resolve => (lease: Lease) => resolve(lease),
    ),
    error: createActionCreator('UPDATE_LEASE_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const deleteLease = Object.assign(
  (orderId: string): ThunkResult<Promise<void | { type: 'DELETE_LEASE_SUCCESS'; payload: {id: EquipmentLeaseContractInput[]} }>> => {
    return async (dispatch) => {
      dispatch(deleteLease.next())

      return new LeasesApi(getConfiguration())
        .deleteLeases({ orderId })
        .then((response) => dispatchSuccessWithEffect(dispatch, deleteLease.complete(response), ['Order archived']))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, deleteLease.error(error), error)))
    }
  },
  {
    next: createActionCreator('DELETE_LEASE_REQUEST'),
    complete: createActionCreator('DELETE_LEASE_SUCCESS',
      resolve => (id: EquipmentLeaseContractInput[]) => resolve(id),
    ),
    error: createActionCreator('DELETE_LEASE_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const listVisibilityContracts = Object.assign(
  (params: {equipmentLeaseContractId?: string, leaseVisibilityContractId?: string}): ThunkResult<Promise<void | { type: 'GET_LEASES_VIZ_CONTRACTS_SUCCESS'; payload: LeaseVisibilityContract[] }>> => {
    return async (dispatch) => {
      dispatch(listVisibilityContracts.next())

      return new LeasesApi(getConfiguration())
        .getLeasesVisibilitycontract(params)
        .then((response) => dispatch(listVisibilityContracts.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, listVisibilityContracts.error(error), error)))
    }
  },
  {
    next: createActionCreator('GET_LEASES_VIZ_CONTRACTS_REQUEST'),
    complete: createActionCreator('GET_LEASES_VIZ_CONTRACTS_SUCCESS',
      resolve => (contracts: LeaseVisibilityContract[]) => resolve(contracts),
    ),
    error: createActionCreator('GET_LEASES_VIZ_CONTRACTS_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const addVisibilityContract = Object.assign(
  (equipmentLeaseContractId: string, body?: LeaseVisibilityInput): ThunkResult<Promise<void | { type: 'POST_LEASES_VIZ_CONTRACTS_SUCCESS'; payload: LeaseVisibilityContract }>> => {
    return async (dispatch) => {
      dispatch(addVisibilityContract.next())

      return new LeasesApi(getConfiguration())
        .postLeasesEquipmentleasecontractidVisibilitycontract({ equipmentLeaseContractId, body })
        .then((response) => dispatch(addVisibilityContract.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, addVisibilityContract.error(error), error)))
    }
  },
  {
    next: createActionCreator('POST_LEASES_VIZ_CONTRACTS_REQUEST'),
    complete: createActionCreator('POST_LEASES_VIZ_CONTRACTS_SUCCESS',
      resolve => (contract: LeaseVisibilityContract) => resolve(contract),
    ),
    error: createActionCreator('POST_LEASES_VIZ_CONTRACTS_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const updateVisibilityContracts = Object.assign(
  (equipmentLeaseContractId: string, leaseVisibilityContractId: string, body?: LeaseVisibilityPatchInput): ThunkResult<Promise<void | { type: 'PATCH_LEASES_VIZ_CONTRACTS_SUCCESS'; payload: LeaseVisibilityContract[] }>> => {
    return async (dispatch) => {
      dispatch(updateVisibilityContracts.next())

      return new LeasesApi(getConfiguration())
        .patchLeasesEquipmentleasecontractidVisibilitycontractLeasevisibilitycontractid({ equipmentLeaseContractId, leaseVisibilityContractId, body })
        .then((response) => dispatchSuccessWithEffect(dispatch, dispatch(updateVisibilityContracts.complete(response)), ['Visibility Contract successfully updated']))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, updateVisibilityContracts.error(error), error)))
    }
  },
  {
    next: createActionCreator('PATCH_LEASES_VIZ_CONTRACTS_REQUEST'),
    complete: createActionCreator('PATCH_LEASES_VIZ_CONTRACTS_SUCCESS',
      resolve => (contracts: LeaseVisibilityContract[]) => resolve(contracts),
    ),
    error: createActionCreator('PATCH_LEASES_VIZ_CONTRACTS_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const sendBookingEmail = Object.assign(
  (orderId: string): ThunkResult<Promise<void | { type: 'POST_LEASE_BOOKING_EMAIL_SUCCESS'; payload: {status: boolean} }>> => {
    return async (dispatch) => {
      dispatch(sendBookingEmail.next())

      return new LeasesApi(getConfiguration())
        .postLeasesOrderidBookingconfirmationemail({ orderId })
        .then((response) => dispatchSuccessWithEffect(dispatch, dispatch(sendBookingEmail.complete(response)), response.status ? ['Sent booking email'] : ['Booking email not sent']))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, sendBookingEmail.error(error), error)))
    }
  },
  {
    next: createActionCreator('POST_LEASE_BOOKING_EMAIL_REQUEST'),
    complete: createActionCreator('POST_LEASE_BOOKING_EMAIL_SUCCESS',
      resolve => (contracts: {status: boolean}) => resolve(contracts),
    ),
    error: createActionCreator('POST_LEASE_BOOKING_EMAIL_ERROR',
      resolve => error => resolve(error),
    ),
  })
