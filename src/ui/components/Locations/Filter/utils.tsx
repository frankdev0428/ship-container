import { Filter, FilterValueWithLabel } from '../../shared/Filter/FilterButton'
import { notEmpty } from '../../shared/utils'
import { DepotRowDataProps } from '../DepotRow'

type FacilityTextFilterKey = 'id' | 'code' | 'type' | 'depotId' | 'name' | 'city' | 'countryName' | 'region' | 'containersAtDepot'
// type FacilityDateFilterKey = 
export type FacilityFilterKey = FacilityTextFilterKey // | FacilityDateFilterKey

export const facilityOptions: Record<FacilityFilterKey, FilterValueWithLabel> = {
  id: { value: null, type: 'text', label: 'Facilty Id', chipLabelName: '', hidden: true },
  code: { value: null, type: 'text', label: 'Code', chipLabelName: '' },
  type: { value: null, type: 'text', label: 'Type', chipLabelName: '' },
  depotId: { value: null, type: 'text', label: 'Depot Id', chipLabelName: '', hidden: true },
  name: { value: null, type: 'text', label: 'Name', chipLabelName: '' },
  city: { value: null, type: 'text', label: 'City', chipLabelName: '' },
  countryName: { value: null, type: 'text', label: 'Country', chipLabelName: '' },
  region: { value: null, type: 'text', label: 'Region', chipLabelName: '' },
  containersAtDepot: { value: null, type: 'text', label: 'Container Id', chipLabelName: '' },
}

export const filterFacilities = (facilities: DepotRowDataProps[], filter: string) => (
  facilities.filter((f: DepotRowDataProps) => {
    // Don't filter on empty filter
    if (filter.trim().length === 0) { return true }

    // Add attributes to be used in filter
    const attributeList = [
      f.id,
      f.code,
      // f.type, // searching for POTE, INTE seems odd
      f.city,
      f.countryName,
      f.region,
      f.storageRate,
      ...(f.containersAtDepot ? f.containersAtDepot.map(depot => depot) : [undefined]),
    ].map(e => e != null ? e.toLowerCase() : '')

    for (const attribute of attributeList) {
      if (attribute.includes(filter.toLowerCase())) {
        return true
      }
    }
    return false
  }))

const exclusions = [
  'containersArriving',
  'containersDeparting',
  'containersAtDepot',
  'containersOverIdleLimit',
  'containersBlocked',
  'daysidle',
  'storageRate',
  'depotId',
]

export const getFacilityOptions = (facilities: DepotRowDataProps[], filter: Filter): string[] => {
  const filterKey = Object.keys(filter)[0]
  switch (filterKey) {
    case 'containersArriving':
    case 'containersDeparting':
    case 'containersOverIdleLimit':
    case 'containersBlocked':
    case 'daysidle':
    case 'storageRate':
      return []
    case 'containersAtDepot':
      return [...new Set(facilities.flatMap(f => f.containersAtDepot).filter(notEmpty))]
    default:
      return [...new Set(facilities.map(f => (f as any)[filterKey]).filter(notEmpty))]
  }
}

export const facilityFilter = (facility: DepotRowDataProps, filtDic: Filter): boolean => {
  const shouldFilter = Object.entries(facility).reduce((res, cur) => {
    if (exclusions.includes(cur[0])) return res
    const currFilter = filtDic[cur[0] as 'id']
    if (currFilter != null && currFilter.value != null) {
      return res && (filtDic[cur[0] as 'id'] as any).value === cur[1]
    }
    return res
  }, true)

  return (
    shouldFilter &&
    (filtDic.id?.value
      ? facility.id === filtDic.id?.value
      : true) &&
    (filtDic.code?.value
      ? facility.code === filtDic.code?.value
      : true) &&
    (filtDic.countryName?.value
      ? facility.countryName === filtDic.countryName?.value
      : true) &&
    (filtDic.region?.value
      ? facility.region === filtDic.region?.value
      : true) &&
    (filtDic.city?.value
      ? facility.city === filtDic.city?.value
      : true) &&
    // (filtDic.depotId?.value
    //   ? facility.depotId === filtDic.depotId?.value
    //   : true) &&
    (filtDic.type?.value
      ? facility.type === filtDic.type?.value
      : true) &&
    (filtDic.containersAtDepot?.value && typeof filtDic.containersAtDepot.value === 'string'
      ? facility.containersAtDepot?.includes(filtDic.containersAtDepot.value) || false
      : true)
  )
}
