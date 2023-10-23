import moment from 'moment'

import { Equipment } from '../../services/equipment/types'
import { Company } from '../../services/customer/types'
import { Facility } from '../../services/places/types'
import { StorageRate, LeaseRate } from '../../services/financials/types'

import { getCurrencySymbol } from './shared/currencySymbols'

export const computeEquipmentStatus = (container: Equipment, companies: Company[], depots: Facility[], storage?: StorageRate[], lease?: LeaseRate[]) => {
  const loc1 = container.currentStatus?.status === 'ALLOCATED' ? container.currentLease?.dropoffLocation : container.currentLocation?.locationId

  const allocationStatus = container.currentLease
  const operationalStatus = container.currentStatus?.status as any // FIXME

  const status = allocationStatus
    ? (operationalStatus === 'ALLOCATED'
        ? 'ALLOCATED'
        : (
            (operationalStatus as any) === 'AVAILABLE' ? 'ALA' : 'BLA'
          ))
    : operationalStatus

  const customerId = status === 'ALLOCATED'
    ? container.currentLease?.customerId
    : operationalStatus === 'PRODUCTION' ? undefined : 'Aeler'

  const customer = status === 'ALLOCATED'
    ? companies.find(c => container.currentLease?.customerId === c.companyId)?.name || container.currentLease?.customerId
    : operationalStatus === 'PRODUCTION' ? undefined : 'Aeler'

  const nextStatus = container.futureStatuses && container.futureStatuses?.length > 0 ? container.futureStatuses[0] : undefined
  const availableFrom = ['AVAILABLE', 'ALA'].includes(status)
    ? container.currentStatus?.validFromActual
    : container.currentStatus?.validToActual || container.currentStatus?.validToPlanned || container.currentLease?.returnDate

  const availableTo = nextStatus?.validFromActual || nextStatus?.validFromPlanned // ['AVAILABLE', 'ALA'].includes(status) ? container.currentLease?.executionDate : nextStatus?.validFromPlanned

  const availabilityLocation = depots.find(c => c.facilityId === loc1)?.name || loc1
  const currentLocation = status === 'ALLOCATED' ? 'IN TRANSIT' : availabilityLocation
  const destinationLocation = status === 'ALLOCATED' ? availabilityLocation : undefined

  const idleDays = ['AVAILABLE', 'ALA'].includes(status) ? moment().diff(moment(availableFrom), 'days') + 1 : undefined
  const idleDaysForecast = ['AVAILABLE', 'ALA'].includes(status) ? moment(availableTo).diff(moment(availableFrom), 'days') : undefined

  const depotStorage = storage?.find(s => s.depotId === loc1)
  const idleCost = (idleDays && depotStorage) ? ((idleDays * depotStorage.dailyRate.rate).toFixed(1) + getCurrencySymbol(depotStorage.currency)) : undefined
  const idleCostForecast = (idleDaysForecast && depotStorage) ? ((idleDaysForecast * depotStorage.dailyRate.rate).toFixed(1) + getCurrencySymbol(depotStorage.currency)) : undefined

  const leaseDays = (container.currentLease && ['ALLOCATED'].includes(status)) ? moment().diff(moment(container.currentLease.executionDate), 'days') + 1 : undefined
  const leaseDaysForecast = (container.currentLease && ['ALLOCATED'].includes(status)) ? moment(container.currentLease.returnDate).diff(moment(container.currentLease.executionDate), 'days') + 1 : undefined

  const customerLeaseRate = lease?.find(s => s.customerId === customerId)
  const leaseRevenue = (leaseDays && customerLeaseRate) ? ((leaseDays * customerLeaseRate.dailyRate).toFixed(1) + getCurrencySymbol(customerLeaseRate.currency)) : undefined
  const leaseRevenueForecast = (leaseDaysForecast && customerLeaseRate) ? ((leaseDaysForecast * customerLeaseRate.dailyRate).toFixed(1) + getCurrencySymbol(customerLeaseRate.currency)) : undefined

  const daysOverdue = (container.currentLease && ['ALLOCATED'].includes(status))
    ? moment().diff(moment(container.currentLease.returnDate), 'days')
    : 0

  const orderId = container.currentLease?.orderId

  return {
    loc1,
    allocationStatus,
    operationalStatus,
    status,
    customerId,
    customer,
    nextStatus,
    availableFrom,
    availableTo,
    availabilityLocation,
    currentLocation,
    destinationLocation,
    idleDays,
    idleDaysForecast,
    depotStorage,
    idleCost,
    idleCostForecast,
    leaseDays,
    leaseDaysForecast,
    customerLeaseRate,
    leaseRevenue,
    leaseRevenueForecast,
    daysOverdue,
    orderId,
  }
}
