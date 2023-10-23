import moment from 'moment'

import { Filter, FilterValueWithLabel } from '../../../shared/Filter/FilterButton'
import { getTimeLabel } from '../../../shared/utils'
import { ContainerRowDataProps } from '../../AllocationRow'

type ContainerAllocTextFilterKey = 'operationalStatus' | 'orderId' | 'customer' | 'currentLocation' | 'destinationLocation' | 'containerId' | 'containerVersion' | 'containerDoorType' | 'containerFloorType'
type ContainerAllocDateFilterKey = 'availableFrom' | 'availableTo' | 'containerCertificateDate' | 'createdAt' // | 'bookingDate'
export type ContainerFilterKey = ContainerAllocTextFilterKey | ContainerAllocDateFilterKey

export const containerAllocOptions: Record<ContainerFilterKey, FilterValueWithLabel> = {
  operationalStatus: { value: null, type: 'text', label: 'Status', chipLabelName: '' },
  createdAt: { value: null, type: 'date', label: 'Created at', chipLabelName: 'Created at' },
  availableFrom: { value: null, type: 'date-single', label: 'Avail. from', chipLabelName: 'Avail. from' },
  availableTo: { value: null, type: 'date-single', label: 'Avail. until', chipLabelName: 'Avail. until' },
  containerId: { value: null, type: 'text', label: 'Container ID', chipLabelName: '' },
  orderId: { value: null, type: 'text', label: 'Order', chipLabelName: '' },
  customer: { value: null, type: 'text', label: 'Customer', chipLabelName: '' },
  currentLocation: { value: null, type: 'text', label: 'Location', chipLabelName: '' },
  destinationLocation: { value: null, type: 'text', label: 'Destination', chipLabelName: '' },
  containerVersion: { value: null, type: 'text', label: 'Version', chipLabelName: '' },
  containerCertificateDate: { value: null, type: 'date-single', label: 'Cert. Date', chipLabelName: '' },
  containerDoorType: { value: null, type: 'text', label: 'TIR locking plate', chipLabelName: '' },
  containerFloorType: { value: null, type: 'text', label: 'Floor insulation', chipLabelName: '' },
}

export const filterContainerAllocs = (containerAllocs: ContainerRowDataProps[], filter: string) => (
  containerAllocs.filter((c: ContainerRowDataProps) => {
    // Don't filter on empty filter
    if (filter.trim().length === 0) { return true }

    // Add attributes to be used in filter
    const attributeList = [
      c.id,
      c.operationalStatus,
      // c.allocationStatus,
      c.orderId,
      c.customer,
      c.currentLocation,
      c.destinationLocation,
      // c.equipmentId,
      c.containerVersion,
      c.containerDoorType,
      c.containerFloorType,
      c.availableFrom ? getTimeLabel(c.availableFrom) : undefined,
      c.availableTo ? getTimeLabel(c.availableTo) : undefined,
      c.containerCertificateDate ? getTimeLabel(c.containerCertificateDate) : undefined,
    ].map(e => e != null ? e.toLowerCase() : '')

    for (const attribute of attributeList) {
      if (attribute.includes(filter.toLowerCase())) {
        return true
      }
    }
    return false
  }))

export const getContainerAllocOptions = (containersAllocs: ContainerRowDataProps[], filter: Filter): string[] => {
  const filterKey = Object.keys(filter)[0]
  switch (filterKey) {
    case 'availableFrom':
    case 'availableTo':
    case 'containerCertificateDate':
    case 'createdAt':
      return []
    case 'containerId':
      return [...new Set(containersAllocs.map(o => (o as any).id).filter(x => x !== undefined) as string[])]
    case 'containerDoorType':
      return [...new Set(containersAllocs.map(c => c.containerDoorType === undefined ? 'Unknown' : (c as any).containerDoorType) as string[])]
    case 'containerFloorType':
      return [...new Set(containersAllocs.map(c => c.containerFloorType === undefined ? 'Unknown' : (c as any).containerFloorType) as string[])]
    default:
      return [...new Set(containersAllocs.map(c => (c as any)[filterKey]).filter(x => x !== undefined) as string[])]
  }
}

export const containerAllocsFilter = (containerAlloc: ContainerRowDataProps, filtDic: Filter): boolean => {
  const exclusions = ['availableFrom', 'availableTo', 'containerCertificateDate', 'containerId', 'createdAt', 'containerDoorType', 'containerFloorType']

  const shouldFilter = Object.entries(containerAlloc).reduce((res, cur) => {
    if (exclusions.includes(cur[0])) return res
    const currFilter = filtDic[cur[0] as 'id']
    if (currFilter != null && currFilter.value != null) {
      return res && (filtDic[cur[0] as 'id'] as any).value === cur[1]
    }
    return res
  }, true)

  return (
    shouldFilter &&
    (filtDic.containerId?.value
      ? containerAlloc.id === filtDic.containerId?.value
      : true) &&
    (filtDic.containerDoorType?.value
      ? containerAlloc.containerDoorType === filtDic.containerDoorType?.value || (!containerAlloc.containerDoorType && filtDic.containerDoorType?.value === 'Unknown')
      : true) &&
    (filtDic.containerFloorType?.value
      ? containerAlloc.containerFloorType === filtDic.containerFloorType?.value || (!containerAlloc.containerFloorType && filtDic.containerFloorType?.value === 'Unknown')
      : true) &&
    (
      (filtDic.availableFrom?.value && filtDic.availableFrom?.value instanceof Array && filtDic.availableFrom?.value.length)
        ? (filtDic.availableFrom.value[0]
            ? containerAlloc.availableFrom ? moment(containerAlloc.availableFrom).isSameOrAfter(moment(filtDic.availableFrom.value[0]), 'day') : false
            : true)
        : true
    ) &&
    (
      (filtDic.availableTo?.value && filtDic.availableTo?.value instanceof Array && filtDic.availableTo?.value.length)
        ? (filtDic.availableTo.value[0]
            ? containerAlloc.availableTo ? moment(containerAlloc.availableTo).isSameOrAfter(moment(filtDic.availableTo.value[0]), 'day') : true // Very important to return true is there if no limiting availableTo date
            : true)
        : true
    ) &&
    (
      (filtDic.containerCertificateDate?.value && filtDic.containerCertificateDate?.value instanceof Array && filtDic.containerCertificateDate?.value.length)
        ? (filtDic.containerCertificateDate.value[0]
            ? containerAlloc.containerCertificateDate ? moment(containerAlloc.containerCertificateDate).isSameOrAfter(moment(filtDic.containerCertificateDate.value[0]), 'day') : true // Very important to return true is there if no limiting containerCertificateDate date
            : true)
        : true
    )

  )
}
