import { createReducer } from 'deox'

import Config from '../../config.json'
import { FacilityWithLocFromJSON } from '../../apis-client/svc-places'

import { addFacility, addLocation, listAddresses, listCities, listCountries, listFacilities, listDepotsStats, listLocations, archiveFacility, addAddress, modifyFacility, listDepotsInventory, addDepotContact, getDepotContacts, updateDepotContact, removeDepotContact } from './actions'
import * as t from './types'
import mockFacilities from './mock-facilities.json'

const initialState: t.PlacesReducerState = {
  // depots: [],
  facilities: Config.FF_ENABLE_MOCK !== undefined && Config.FF_ENABLE_MOCK === 'true' ? mockFacilities.map(FacilityWithLocFromJSON) : [],
  locations: [],
  countries: [],
  addresses: [],
  cities: [],
  depotsStats: [],
  loadingStatus: false,
  containers: [],
  contacts: [],
}

export const placesReducers = createReducer(initialState, handleAction => [
  // List
  handleAction(listFacilities.next, (state) => ({
    ...state,
    loadingStatus: true,
  })),
  handleAction(listFacilities.complete, (state: t.PlacesReducerState, { payload }) => ({
    ...state,
    facilities: payload,
    loadingStatus: false,
  })),
  handleAction(listFacilities.error, (state) => ({
    ...state,
    loadingStatus: false,
  })),
  // Create depot
  handleAction(addFacility.next, (state) => ({
    ...state,
  })),
  handleAction(addFacility.complete, (state: t.PlacesReducerState, { payload }) => ({
    ...state,
    facilities: [...state.facilities, payload],
  })),
  handleAction(addFacility.error, (state) => ({
    ...state,
  })),
  // List locations
  handleAction(listLocations.next, (state) => ({
    ...state,
  })),
  handleAction(listLocations.complete, (state: t.PlacesReducerState, { payload }) => ({
    ...state,
    locations: payload,
  })),
  handleAction(listLocations.error, (state) => ({
    ...state,
  })),
  // Create location
  handleAction(addLocation.next, (state) => ({
    ...state,
  })),
  handleAction(addLocation.complete, (state: t.PlacesReducerState, { payload }) => ({
    ...state,
    locations: [...state.locations, payload],
  })),
  handleAction(addLocation.error, (state) => ({
    ...state,
  })),
  // List countries
  handleAction(listCountries.next, (state) => ({
    ...state,
  })),
  handleAction(listCountries.complete, (state: t.PlacesReducerState, { payload }) => ({
    ...state,
    countries: payload,
  })),
  handleAction(listCountries.error, (state) => ({
    ...state,
  })),
  // List addresses
  handleAction(listAddresses.next, (state) => ({
    ...state,
  })),
  handleAction(listAddresses.complete, (state: t.PlacesReducerState, { payload }) => ({
    ...state,
    addresses: payload,
  })),
  handleAction(listAddresses.error, (state) => ({
    ...state,
  })),
  // Create addresse
  handleAction(addAddress.next, (state) => ({
    ...state,
  })),
  handleAction(addAddress.complete, (state: t.PlacesReducerState, { payload }) => ({
    ...state,
    addresses: [...state.addresses, payload],
  })),
  handleAction(addAddress.error, (state) => ({
    ...state,
  })),
  // List cities
  handleAction(listCities.next, (state) => ({
    ...state,
  })),
  handleAction(listCities.complete, (state: t.PlacesReducerState, { payload }) => ({
    ...state,
    cities: payload,
  })),
  handleAction(listCities.error, (state) => ({
    ...state,
  })),
  // List cities
  handleAction(listDepotsStats.next, (state) => ({
    ...state,
  })),
  handleAction(listDepotsStats.complete, (state: t.PlacesReducerState, { payload }) => ({
    ...state,
    depotsStats: state.depotsStats.find(d => d.depotId === payload[0].depotId)
      ? state.depotsStats.map(d => d.depotId === payload[0].depotId ? payload[0] : d)
      : [...state.depotsStats, payload[0]],
  })),
  handleAction(listDepotsStats.error, (state) => ({
    ...state,
  })),
  // archiveFacility
  handleAction(archiveFacility.next, (state) => ({
    ...state,
  })),
  handleAction(archiveFacility.complete, (state: t.PlacesReducerState, { payload }) => ({
    ...state,
    facilities: state.facilities.filter(f => f.facilityId !== payload.id),
  })),
  handleAction(archiveFacility.error, (state) => ({
    ...state,
  })),
  // modify Facility
  handleAction(modifyFacility.next, (state) => ({
    ...state,
  })),
  handleAction(modifyFacility.complete, (state: t.PlacesReducerState, { payload }) => ({
    ...state,
    facilities: state.facilities.map(f => f.facilityId === payload.facilityId ? payload : f),
  })),
  handleAction(modifyFacility.error, (state) => ({
    ...state,
  })),
  // depot inv
  handleAction(listDepotsInventory.next, (state) => ({
    ...state,
  })),
  handleAction(listDepotsInventory.complete, (state: t.PlacesReducerState, { payload }) => {
    const previousContainers = state.containers.filter(e => e.depotId !== payload.depotId)
    const updatedContainers = [...previousContainers, payload]

    return ({
      ...state,
      containers: updatedContainers,
    })
  }),
  handleAction(listDepotsInventory.error, (state) => ({
    ...state,
  })),
  /** Depot contacts */
  // Add
  handleAction(addDepotContact.next, (state) => ({
    ...state,
  })),
  handleAction(addDepotContact.complete, (state: t.PlacesReducerState, { payload }) => ({
    ...state,
    contacts: [...state.contacts, payload],
  })),
  handleAction(addDepotContact.error, (state) => ({
    ...state,
  })),
  // Get
  handleAction(getDepotContacts.next, (state) => ({
    ...state,
  })),
  handleAction(getDepotContacts.complete, (state: t.PlacesReducerState, { payload }) => ({
    ...state,
    contacts: [...state.contacts.filter(f => !payload.map(e => e.depotId).includes(f.depotId)), ...payload],
  })),
  handleAction(getDepotContacts.error, (state) => ({
    ...state,
  })),
  // Update
  handleAction(updateDepotContact.next, (state) => ({
    ...state,
  })),
  handleAction(updateDepotContact.complete, (state: t.PlacesReducerState, { payload }) => ({
    ...state,
    contacts: state.contacts.map(c => c.contactId === payload.contactId ? payload : c),
  })),
  handleAction(updateDepotContact.error, (state) => ({
    ...state,
  })),
  // Remove
  handleAction(removeDepotContact.next, (state) => ({
    ...state,
  })),
  handleAction(removeDepotContact.complete, (state: t.PlacesReducerState, { payload }) => ({
    ...state,
    contacts: state.contacts.filter(c => c.contactId !== payload),
  })),
  handleAction(removeDepotContact.error, (state) => ({
    ...state,
  })),
])
