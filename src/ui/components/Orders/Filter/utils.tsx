import moment from 'moment'

import { Filter, FilterValueWithLabel } from '../../shared/Filter/FilterButton'
import { getTimeLabel } from '../../shared/utils'
import { OrderRowDataProps } from '../OrderRow'

type OrderTextFilterKey = 'id' | 'orderStatus' | 'customer' | 'contractStatus' | 'origin' | 'destination' | 'units'
type OrderDateFilterKey = 'returnDate' | 'executionDate' | 'createdAt'
export type OrderFilterKey = OrderTextFilterKey | OrderDateFilterKey

export const orderOptions: Record<OrderFilterKey, FilterValueWithLabel> = {
  id: { value: null, type: 'text', label: 'Order Nº', chipLabelName: '' },
  createdAt: { value: null, type: 'date', label: 'Created at', chipLabelName: 'Created at' },
  orderStatus: { value: null, type: 'text', label: 'Status', chipLabelName: '' },
  customer: { value: null, type: 'text', label: 'Customer', chipLabelName: '' },
  contractStatus: { value: null, type: 'text', label: 'Lease type', chipLabelName: '' },
  origin: { value: null, type: 'text', label: 'Collection Location', chipLabelName: '' },
  executionDate: { value: null, type: 'date', label: 'Collection Date', chipLabelName: '' },
  destination: { value: null, type: 'text', label: 'Return Location', chipLabelName: '' },
  returnDate: { value: null, type: 'date', label: 'Return Date', chipLabelName: '' },
  units: { value: null, type: 'number', label: 'Units', chipLabelName: '' },
}

export const filterOrders = (orders: OrderRowDataProps[], filter: string) => (
  orders.filter((o: OrderRowDataProps) => {
    // Don't filter on empty filter
    if (filter.trim().length === 0) { return true }

    // Add attributes to be used in filter
    const attributeList = [
      o.id,
      o.orderStatus,
      o.customer,
      o.contractStatus,
      o.origin,
      o.destination,
      `${o.units}`,
      o.executionDate ? getTimeLabel(o.executionDate) : undefined,
      o.returnDate ? getTimeLabel(o.returnDate) : undefined,
      o.createdAt ? getTimeLabel(o.createdAt) : undefined,
    ].map(e => e != null ? e.toLowerCase() : '')

    for (const attribute of attributeList) {
      if (attribute.includes(filter.toLowerCase())) {
        return true
      }
    }
    return false
  }))

export const getOrderOptions = (orders: OrderRowDataProps[], filter: Filter): string[] => {
  const filterKey = Object.keys(filter)[0]
  switch (filterKey) {
    case 'orderStatus':
      return [...new Set(orders.map(o => o.orderStatus).filter(x => x !== undefined) as string[])]
    default:
      return [...new Set(orders.map(o => (o as any)[filterKey]).filter(x => x !== undefined) as string[])]
  }
}

export const orderFilter = (order: OrderRowDataProps, filtDic: Filter): boolean => {
  const exclusions = ['executionDate', 'returnDate', 'createdAt']

  const shouldFilter = Object.entries(order).reduce((res, cur) => {
    if (exclusions.includes(cur[0])) return res
    const currFilter = filtDic[cur[0] as 'id']
    if (currFilter != null && currFilter.value != null) {
      return res && (filtDic[cur[0] as 'id'] as any).value === cur[1]
    }
    return res
  }, true)

  return (
    shouldFilter &&
    (
      (filtDic.executionDate?.value && filtDic.executionDate?.value instanceof Array && filtDic.executionDate?.value.length === 2)
        ? (filtDic.executionDate.value[0]
            ? order.executionDate ? moment(order.executionDate).isSameOrAfter(moment(filtDic.executionDate.value[0])) : false
            : true) &&
                (filtDic.executionDate.value[1]
                  ? order.executionDate ? moment(order.executionDate).isSameOrBefore(moment(filtDic.executionDate.value[1]), 'day') : false // order.executionDate < (filtDic.executionDate.value[1] as Date) : false
                  : true)
        : true
    ) &&
    (
      (filtDic.returnDate?.value && filtDic.returnDate?.value instanceof Array && filtDic.returnDate?.value.length === 2)
        ? (filtDic.returnDate.value[0]
            ? order.returnDate ? moment(order.returnDate).isSameOrAfter(moment(filtDic.returnDate.value[0])) : false
            : true) &&
          (filtDic.returnDate.value[1]
            ? order.returnDate ? moment(order.returnDate).isSameOrBefore(moment(filtDic.returnDate.value[1]), 'day') : false
            : true)
        : true
    ) &&
    (
      (filtDic.createdAt?.value && filtDic.createdAt?.value instanceof Array && filtDic.createdAt?.value.length === 2)
        ? (filtDic.createdAt.value[0]
            ? order.createdAt ? moment(order.createdAt).isSameOrAfter(moment(filtDic.createdAt.value[0])) : false
            : true) &&
          (filtDic.createdAt.value[1]
            ? order.createdAt ? moment(order.createdAt).isSameOrBefore(moment(filtDic.createdAt.value[1]), 'day') : false
            : true)
        : true
    )
  )
}
