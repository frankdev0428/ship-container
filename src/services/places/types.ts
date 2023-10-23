import {
  // DepotWithLoc as _Depot,
  Address as _Address,
  Location as _Location,
  Country as _Country,
  City as _City,
  FacilityWithLoc as _Facility,
  FacilityInput as _FacilityInput,
  PatchFacilityInput as _PatchFacilityInput,
} from '../../apis-client/svc-places'
import {
  ExchangeLocation as _ExchangeLocation,
  ExchangeLocationInput as _ExchangeLocationInput,
  DepotStats as _DepotStats,
  DepotContainer as _DepotContainer,
  PublicDepotContact as _Contact,
} from '../../apis-client'

// export type Depot = _Depot
export type Address = _Address
export type Location = _Location
export type Country = _Country
export type City = _City
export type Facility = _Facility

export type ExchangeLocation = _ExchangeLocation
export type ExchangeLocationInput = _ExchangeLocationInput
export type DepotStats = _DepotStats
export type DepotContainer = _DepotContainer

export type FacilityInput = _FacilityInput
export type PatchFacilityInput = _PatchFacilityInput

export type DepotContact = _Contact

export interface PlacesReducerState {
  // depots: Depot[];
  facilities: Facility[];
  depotsStats: DepotStats[];
  locations: ExchangeLocation[];
  countries: Country[];
  addresses: Address[];
  cities: City[];
  // depots: string[];
  loadingStatus: boolean;
  containers: {
    depotId: string;
    containers: DepotContainer[];
  }[];
  contacts: DepotContact[];
}
