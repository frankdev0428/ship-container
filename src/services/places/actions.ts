import { createActionCreator } from 'deox'

import {
  AddressesApi,
  AddressInput,
  DepotInput,
  DepotsApi, GetDepotsRequest,
  LocationsApi as LocationsApi2,
  LocationInput,
  CountriesApi,
  CitiesApi,
  FacilitiesApi,
  FacilityInput,
  GetFacilitiesRequest,
  PatchFacilityInput,
} from '../../apis-client/svc-places'
import { ThunkResult } from '../../frameworks/types'
import { aelerApiFailure } from '../../frameworks/apiUtils'
import { getConfiguration, getConfiguration3 } from '../auth/keycloak'
import { dispatchErrorWithEffect, dispatchSuccessWithEffect } from '../../store/effects'
import { ExchangeLocationInput, LocationsApi, DepotsApi as DepotsApi2, V2Api, DepotContainer, DepotContactInput, PatchDepotContactInput } from '../../apis-client'

import { Address, City, Country, ExchangeLocation, Location, DepotStats, Facility, DepotContact } from './types'

// export const listDepots = Object.assign(
//   (params: GetDepotsRequest): ThunkResult<Promise<void | { type: 'LIST_DEPOTS_SUCCESS'; payload: Depot[] }>> => {
//     return async (dispatch) => {
//       dispatch(listDepots.next())

//       return new DepotsApi(getConfiguration3() as any)
//         .getDepots(params)
//         .then((response) => dispatch(listDepots.complete(response)))
//         .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, listDepots.error(error), error)))
//     }
//   },
//   {
//     next: createActionCreator('LIST_DEPOTS_REQUEST'),
//     complete: createActionCreator('LIST_DEPOTS_SUCCESS',
//       resolve => (depots: Depot[]) => resolve(depots),
//     ),
//     error: createActionCreator('LIST_DEPOTS_ERROR',
//       resolve => error => resolve(error),
//     ),
//   })

export const listFacilities = Object.assign(
  (params: GetFacilitiesRequest): ThunkResult<Promise<void | { type: 'LIST_FACILITIES_SUCCESS'; payload: Facility[] }>> => {
    return async (dispatch) => {
      dispatch(listFacilities.next())

      return new FacilitiesApi(getConfiguration3() as any)
        .getFacilities(params)
        .then((response) => dispatch(listFacilities.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, listFacilities.error(error), error)))
    }
  },
  {
    next: createActionCreator('LIST_FACILITIES_REQUEST'),
    complete: createActionCreator('LIST_FACILITIES_SUCCESS',
      resolve => (depots: Facility[]) => resolve(depots),
    ),
    error: createActionCreator('LIST_FACILITIES_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const addLocation = Object.assign(
  (params: ExchangeLocationInput): ThunkResult<Promise<void | { type: 'ADD_LOCATION_SUCCESS'; payload: ExchangeLocation }>> => {
    return async (dispatch) => {
      dispatch(addLocation.next())

      return await new LocationsApi(getConfiguration())
        .postLocations({ body: params })
        .then((response) => dispatch(addLocation.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, addLocation.error(error), error)))
    }
  },
  {
    next: createActionCreator('ADD_LOCATION_REQUEST'),
    complete: createActionCreator('ADD_LOCATION_SUCCESS',
      resolve => (depots: ExchangeLocation) => resolve(depots),
    ),
    error: createActionCreator('ADD_LOCATION_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const listLocations = Object.assign(
  (nameStartsWith?: string): ThunkResult<Promise<void | { type: 'LIST_LOCATIONS_SUCCESS'; payload: ExchangeLocation[] }>> => {
    return async (dispatch) => {
      dispatch(listLocations.next())

      return new LocationsApi(getConfiguration())
        .getLocations({ nameStartsWith })
        .then((response) => dispatch(listLocations.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, listLocations.error(error), error)))
    }
  },
  {
    next: createActionCreator('LIST_LOCATIONS_REQUEST'),
    complete: createActionCreator('LIST_LOCATIONS_SUCCESS',
      resolve => (depots: ExchangeLocation[]) => resolve(depots),
    ),
    error: createActionCreator('LIST_LOCATIONS_ERROR',
      resolve => error => resolve(error),
    ),
  })

// export const addDepot = Object.assign(
//   (params: DepotInput): ThunkResult<Promise<void | { type: 'ADD_DEPOT_SUCCESS'; payload: Depot }>> => {
//     return async (dispatch) => {
//       dispatch(addDepot.next())

//       return new DepotsApi(getConfiguration3() as any)
//         .postDepots({ body: params })
//         .then((response) => dispatch(addDepot.complete(response)))
//         .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, addDepot.error(error), error)))
//     }
//   },
//   {
//     next: createActionCreator('ADD_DEPOT_REQUEST'),
//     complete: createActionCreator('ADD_DEPOT_SUCCESS',
//       resolve => (depots: Depot) => resolve(depots),
//     ),
//     error: createActionCreator('ADD_DEPOT_ERROR',
//       resolve => error => resolve(error),
//     ),
//   })

export const addFacility = Object.assign(
  (params: FacilityInput): ThunkResult<Promise<void | { type: 'ADD_FACILITY_SUCCESS'; payload: Facility }>> => {
    return async (dispatch) => {
      dispatch(addFacility.next())

      return new FacilitiesApi(getConfiguration3() as any)
        .postFacilities({ body: params })
        .then((response) => dispatchSuccessWithEffect(dispatch, addFacility.complete(response), ['Facility created']))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, addFacility.error(error), error)))
    }
  },
  {
    next: createActionCreator('ADD_FACILITY_REQUEST'),
    complete: createActionCreator('ADD_FACILITY_SUCCESS',
      resolve => (depots: Facility) => resolve(depots),
    ),
    error: createActionCreator('ADD_FACILITY_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const addPlaceLocation = Object.assign(
  (params: LocationInput): ThunkResult<Promise<void | { type: 'ADD_PLACE_LOCATION_SUCCESS'; payload: Location }>> => {
    return async (dispatch) => {
      dispatch(addPlaceLocation.next())

      return new LocationsApi2(getConfiguration3() as any)
        .postLocations({ body: params })
        .then((response) => dispatch(addPlaceLocation.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, addPlaceLocation.error(error), error)))
    }
  },
  {
    next: createActionCreator('ADD_PLACE_LOCATION_REQUEST'),
    complete: createActionCreator('ADD_PLACE_LOCATION_SUCCESS',
      resolve => (depots: Location) => resolve(depots),
    ),
    error: createActionCreator('ADD_PLACE_LOCATION_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const addAddress = Object.assign(
  (params: AddressInput): ThunkResult<Promise<void | { type: 'ADD_ADDRESS_SUCCESS'; payload: Address }>> => {
    return async (dispatch) => {
      dispatch(addAddress.next())

      return await new AddressesApi(getConfiguration3() as any)
        .postAddresses({ body: params })
        .then((response) => dispatch(addAddress.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, addAddress.error(error), error)))
    }
  },
  {
    next: createActionCreator('ADD_ADDRESS_REQUEST'),
    complete: createActionCreator('ADD_ADDRESS_SUCCESS',
      resolve => (depots: Address) => resolve(depots),
    ),
    error: createActionCreator('ADD_ADDRESS_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const listCountries = Object.assign(
  (): ThunkResult<Promise<void | { type: 'LIST_COUNTRIES_SUCCESS'; payload: Country[] }>> => {
    return async (dispatch) => {
      dispatch(listCountries.next())

      return new CountriesApi(getConfiguration3() as any)
        .getCountries({})
        .then((response) => dispatch(listCountries.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, listCountries.error(error), error)))
    }
  },
  {
    next: createActionCreator('LIST_COUNTRIES_REQUEST'),
    complete: createActionCreator('LIST_COUNTRIES_SUCCESS',
      resolve => (depots: Country[]) => resolve(depots),
    ),
    error: createActionCreator('LIST_COUNTRIES_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const listCities = Object.assign(
  (nameStartsWith?: string, countryId?: string, cityId?: string): ThunkResult<Promise<void | { type: 'LIST_CITIES_SUCCESS'; payload: City[] }>> => {
    return async (dispatch) => {
      dispatch(listCities.next())

      return await new CitiesApi(getConfiguration3() as any)
        .getCities({
          nameStartsWith,
          countryId,
          cityId,
        })
        .then((response) => dispatch(listCities.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, listCities.error(error), error)))
    }
  },
  {
    next: createActionCreator('LIST_CITIES_REQUEST'),
    complete: createActionCreator('LIST_CITIES_SUCCESS',
      resolve => (depots: City[]) => resolve(depots),
    ),
    error: createActionCreator('LIST_CITIES_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const listAddresses = Object.assign(
  (): ThunkResult<Promise<void | { type: 'LIST_ADDRESSES_SUCCESS'; payload: Address[] }>> => {
    return async (dispatch) => {
      dispatch(listAddresses.next())

      return new AddressesApi(getConfiguration3() as any)
        .getAddresses({})
        .then((response) => dispatch(listAddresses.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, listAddresses.error(error), error)))
    }
  },
  {
    next: createActionCreator('LIST_ADDRESSES_REQUEST'),
    complete: createActionCreator('LIST_ADDRESSES_SUCCESS',
      resolve => (depots: Address[]) => resolve(depots),
    ),
    error: createActionCreator('LIST_ADDRESSES_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const listDepotsStats = Object.assign(
  (depotId: string, usev2?: boolean): ThunkResult<Promise<void | { type: 'LIST_DEPOTS_STATS_SUCCESS'; payload: DepotStats[] }>> => {
    return async (dispatch) => {
      dispatch(listDepotsStats.next())

      if (usev2) {
        return new V2Api(getConfiguration())
          .getV2DepotsStats({ depotId })
          .then((response) => dispatch(listDepotsStats.complete(response)))
          .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, listDepotsStats.error(error), error)))
      } else {
        return new DepotsApi2(getConfiguration())
          .getDepotsStats({ depotId })
          .then((response) => dispatch(listDepotsStats.complete(response)))
          .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, listDepotsStats.error(error), error)))
      }
    }
  },
  {
    next: createActionCreator('LIST_DEPOTS_STATS_REQUEST'),
    complete: createActionCreator('LIST_DEPOTS_STATS_SUCCESS',
      resolve => (depots: DepotStats[]) => resolve(depots),
    ),
    error: createActionCreator('LIST_DEPOTS_STATS_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const listDepotsInventory = Object.assign(
  (depotId: string, usev2?: boolean): ThunkResult<Promise<void | { type: 'LIST_DEPOTS_INV_SUCCESS'; payload: {containers: DepotContainer[]; depotId: string} }>> => {
    return async (dispatch) => {
      dispatch(listDepotsInventory.next())

      if (usev2) {
        return new V2Api(getConfiguration())
          .getV2DepotsInventory({ depotId })
          .then((response) => dispatch(listDepotsInventory.complete(response, depotId)))
          .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, listDepotsInventory.error(error), error)))
      } else {
        return new DepotsApi2(getConfiguration())
          .getDepotsInventory({ depotId })
          .then((response) => dispatch(listDepotsInventory.complete(response, depotId)))
          .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, listDepotsInventory.error(error), error)))
      }
    }
  },
  {
    next: createActionCreator('LIST_DEPOTS_INV_REQUEST'),
    complete: createActionCreator('LIST_DEPOTS_INV_SUCCESS',
      resolve => (containers: DepotContainer[], depotId) => resolve({ containers, depotId }),
    ),
    error: createActionCreator('LIST_DEPOTS_INV_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const archiveFacility = Object.assign(
  (facilityId: string): ThunkResult<Promise<void | { type: 'DELETE_FACILITY_SUCCESS'; payload: {id: string} }>> => {
    return async (dispatch) => {
      dispatch(archiveFacility.next())

      return new FacilitiesApi(getConfiguration3() as any)
        .deleteFacilitiesFacilityid({ facilityId })
        .then((response) => dispatchSuccessWithEffect(dispatch, archiveFacility.complete(response), ['Facility archived']))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, archiveFacility.error(error), error)))
    }
  },
  {
    next: createActionCreator('DELETE_FACILITY_REQUEST'),
    complete: createActionCreator('DELETE_FACILITY_SUCCESS',
      resolve => (res: {id: string}) => resolve(res),
    ),
    error: createActionCreator('DELETE_FACILITY_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const modifyFacility = Object.assign(
  (facilityId: string, payload: PatchFacilityInput): ThunkResult<Promise<void | { type: 'PATCH_FACILITY_SUCCESS'; payload: Facility }>> => {
    return async (dispatch) => {
      dispatch(modifyFacility.next())

      return new FacilitiesApi(getConfiguration3() as any)
        .patchFacilitiesFacilityid({ facilityId, body: payload })
        .then((response) => dispatchSuccessWithEffect(dispatch, modifyFacility.complete(response)))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, modifyFacility.error(error), error)))
    }
  },
  {
    next: createActionCreator('PATCH_FACILITY_REQUEST'),
    complete: createActionCreator('PATCH_FACILITY_SUCCESS',
      resolve => (res: Facility) => resolve(res),
    ),
    error: createActionCreator('PATCH_FACILITY_ERROR',
      resolve => error => resolve(error),
    ),
  })

/** Contacts */
export const addDepotContact = Object.assign(
  (payload: DepotContactInput): ThunkResult<Promise<void | { type: 'ADD_CONTACT_SUCCESS'; payload: DepotContact }>> => {
    return async (dispatch) => {
      dispatch(addDepotContact.next())

      return new DepotsApi2(getConfiguration())
        .postDepotsContacts({ body: payload })
        .then((response) => dispatchSuccessWithEffect(dispatch, addDepotContact.complete(response), ['Contact created']))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, addDepotContact.error(error), error)))
    }
  },
  {
    next: createActionCreator('ADD_CONTACT_REQUEST'),
    complete: createActionCreator('ADD_CONTACT_SUCCESS',
      resolve => (res: DepotContact) => resolve(res),
    ),
    error: createActionCreator('ADD_CONTACT_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const getDepotContacts = Object.assign(
  (depotId: string): ThunkResult<Promise<void | { type: 'GET_CONTACTS_SUCCESS'; payload: DepotContact[] }>> => {
    return async (dispatch) => {
      dispatch(getDepotContacts.next())

      return new DepotsApi2(getConfiguration())
        .getDepotsContacts({ depotId: depotId })
        .then((response) => dispatchSuccessWithEffect(dispatch, getDepotContacts.complete(response), ['Contacts listed']))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, getDepotContacts.error(error), error)))
    }
  },
  {
    next: createActionCreator('GET_CONTACTS_REQUEST'),
    complete: createActionCreator('GET_CONTACTS_SUCCESS',
      resolve => (res: DepotContact[]) => resolve(res),
    ),
    error: createActionCreator('GET_CONTACTS_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const updateDepotContact = Object.assign(
  (depotId: string,
    contactId: string,
    body?: PatchDepotContactInput): ThunkResult<Promise<void | { type: 'PATCH_CONTACT_SUCCESS'; payload: DepotContact }>> => {
    return async (dispatch) => {
      dispatch(updateDepotContact.next())

      return new DepotsApi2(getConfiguration())
        .patchDepotsDepotidContactsContactid({ depotId, contactId, body })
        .then((response) => dispatchSuccessWithEffect(dispatch, updateDepotContact.complete(response), ['Contact updated']))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, updateDepotContact.error(error), error)))
    }
  },
  {
    next: createActionCreator('PATCH_CONTACT_REQUEST'),
    complete: createActionCreator('PATCH_CONTACT_SUCCESS',
      resolve => (res: DepotContact) => resolve(res),
    ),
    error: createActionCreator('PATCH_CONTACT_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const removeDepotContact = Object.assign(
  (depotId: string, contactId: string): ThunkResult<Promise<void | { type: 'REMOVE_CONTACT_SUCCESS'; payload: string }>> => {
    return async (dispatch) => {
      dispatch(removeDepotContact.next())

      return new DepotsApi2(getConfiguration())
        .deleteDepotsDepotidContactsContactid({ depotId, contactId })
        .then((response) => dispatchSuccessWithEffect(dispatch, removeDepotContact.complete(contactId), ['Contact removed']))
        .catch(aelerApiFailure((error) => dispatchErrorWithEffect(dispatch, removeDepotContact.error(error), error)))
    }
  },
  {
    next: createActionCreator('REMOVE_CONTACT_REQUEST'),
    complete: createActionCreator('REMOVE_CONTACT_SUCCESS',
      resolve => (res: string) => resolve(res),
    ),
    error: createActionCreator('REMOVE_CONTACT_ERROR',
      resolve => error => resolve(error),
    ),
  })
