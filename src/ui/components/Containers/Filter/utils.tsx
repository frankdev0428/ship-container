import moment from 'moment'

import { Filter, FilterValueWithLabel } from '../../shared/Filter/FilterButton'
import { getTimeLabel } from '../../shared/utils'
import { ContainerRowDataProps } from '../ContainerRow'

type ContainerTextFilterKey = 'operationalStatus' | 'orderId' | 'customer' | 'currentLocation' | 'destinationLocation' | 'containerId' | 'containerVersion' | 'containerDoorType' | 'containerFloorType'
type ContainerDateFilterKey = 'availableFrom' | 'availableTo' | 'containerCertificateDate' | 'createdAt' // | 'bookingDate'
export type ContainerFilterKey = ContainerTextFilterKey | ContainerDateFilterKey

export const containerOptions: Record<ContainerFilterKey, FilterValueWithLabel> = {
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
  // destinationDate: { value: null, type: 'date', label: 'Destination Date', chipLabelName: 'Destination Date' },
}

export const filterContainers = (containers: ContainerRowDataProps[], filter: string) => (
  containers.filter((c: ContainerRowDataProps) => {
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
      c.createdAt ? getTimeLabel(c.createdAt) : undefined,
    ].map(e => e != null ? e.toLowerCase() : '')

    for (const attribute of attributeList) {
      if (attribute.includes(filter.toLowerCase())) {
        return true
      }
    }
    return false
  }))

export const getContainerOptions = (containers: ContainerRowDataProps[], filter: Filter): string[] => {
  const filterKey = Object.keys(filter)[0]
  switch (filterKey) {
    case 'availableFrom':
    case 'availableTo':
    case 'containerCertificateDate':
    case 'createdAt':
      return []
    case 'containerId':
      return [...new Set(containers.map(o => (o as any).id).filter(x => x !== undefined) as string[])]
    case 'containerDoorType':
      return [...new Set(containers.map(c => c.containerDoorType === undefined ? 'Unknown' : (c as any).containerDoorType) as string[])]
    case 'containerFloorType':
      return [...new Set(containers.map(c => c.containerFloorType === undefined ? 'Unknown' : (c as any).containerFloorType) as string[])]
    default:
      return [...new Set(containers.map(c => (c as any)[filterKey]).filter(x => x !== undefined) as string[])]
  }
}

export const containerFilter = (container: ContainerRowDataProps, filtDic: Filter): boolean => {
  const exclusions = ['availableFrom', 'availableTo', 'containerCertificateDate', 'containerId', 'createdAt', 'containerDoorType', 'containerFloorType']

  const shouldFilter = Object.entries(container).reduce((res, cur) => {
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
      ? container.id === filtDic.containerId?.value
      : true) &&
    (filtDic.containerDoorType?.value
      ? container.containerDoorType === filtDic.containerDoorType?.value || (!container.containerDoorType && filtDic.containerDoorType?.value === 'Unknown')
      : true) &&
    (filtDic.containerFloorType?.value
      ? container.containerFloorType === filtDic.containerFloorType?.value || (!container.containerFloorType && filtDic.containerFloorType?.value === 'Unknown')
      : true) &&
    (
      (filtDic.availableFrom?.value && filtDic.availableFrom?.value instanceof Array && filtDic.availableFrom?.value.length)
        ? (filtDic.availableFrom.value[0]
            ? container.availableFrom ? moment(container.availableFrom).isSameOrAfter(moment(filtDic.availableFrom.value[0]), 'day') : false
            : true)
        : true
    ) &&
    (
      (filtDic.availableTo?.value && filtDic.availableTo?.value instanceof Array && filtDic.availableTo?.value.length)
        ? (filtDic.availableTo.value[0]
            ? container.availableTo ? moment(container.availableTo).isSameOrAfter(moment(filtDic.availableTo.value[0]), 'day') : true // Very important to return true is there if no limiting availableTo date
            : true)
        : true
    ) &&
    (
      (filtDic.containerCertificateDate?.value && filtDic.containerCertificateDate?.value instanceof Array && filtDic.containerCertificateDate?.value.length)
        ? (filtDic.containerCertificateDate.value[0]
            ? container.containerCertificateDate ? moment(container.containerCertificateDate).isSameOrAfter(moment(filtDic.containerCertificateDate.value[0]), 'day') : true // Very important to return true is there if no limiting containerCertificateDate date
            : true)
        : true
    ) &&
    (
      (filtDic.createdAt?.value && filtDic.createdAt?.value instanceof Array && filtDic.createdAt?.value.length === 2)
        ? (filtDic.createdAt.value[0]
            ? container.createdAt ? moment(container.createdAt).isSameOrAfter(moment(filtDic.createdAt.value[0])) : false
            : true) &&
          (filtDic.createdAt.value[1]
            ? container.createdAt ? moment(container.createdAt).isSameOrBefore(moment(filtDic.createdAt.value[1]), 'day') : false
            : true)
        : true
    )
  )
}
