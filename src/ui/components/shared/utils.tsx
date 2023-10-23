import { useRef, useEffect } from 'react'
import { format, isValid } from 'date-fns'
import moment from 'moment'
import { GridInitialStatePro } from '@mui/x-data-grid-pro/models/gridStatePro'

import Config from '../../../config.json'

export const mapActivityToMapLocationType = (activity: string) => {
  // UnknownEvent = 'unknown-event',
  // ContainerVesselArrived = 'container-vessel-arrived',
  // ContainerVesselDeparted = 'container-vessel-departed',
  // ContainerLoadedBoat = 'container-loaded-boat',
  // ContainerUnloadedBoat = 'container-unloaded-boat',
  // ContainerGateIn = 'container-gate-in',
  // ContainerGateOut = 'container-gate-out',
  // ContainerGateOutEmpty = 'container-gate-out-empty',
  // EmptyContainerDispatched = 'empty-container-dispatched'
  switch (activity) {
    case 'fixme1':
    case 'container-gate-out':
      return 'warehouse'
      break
    case 'fixme2':
      return 'truck'
      break
    case 'container-gate-out-empty':
    case 'container-gate-in':
    case 'container-unloaded-boat':
      return 'port'
      break
    case 'container-loaded-boat':
    case 'container-vessel-arrived':
    case 'container-vessel-departed':
      return 'vessel'
      break
    default:
      return 'container'
      break
  }
}

export function stableSort<T>(array: T[], comparator: (a: T, b: T) => number): T[] {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}

export function descendingComparator<T>(a: T, b: T, orderBy: keyof T, invert: number): number {
  const valueA = a[orderBy]
  const valueB = b[orderBy]

  if (!(valueA || valueB)) return 0
  if (!valueA) return 1
  if (!valueB) return -1

  if ((valueA instanceof Date && valueB instanceof Date)) {
    const dateA = moment(a[orderBy] as Date, 'DD/MM/YYYY')
    const dateB = moment(b[orderBy] as Date, 'DD/MM/YYYY')
    if (dateB.isSameOrBefore(dateA)) {
      return invert * -1
    }
    if (dateB.isAfter(dateA)) {
      return invert * 1
    }
    return 0
  }

  if ((valueA instanceof Array && valueB instanceof Array)) {
    if (!valueA?.length && !valueB?.length) {
      return 0
    }
    if (!valueA?.length) return 1
    if (!valueB?.length) return -1
  }

  // let nest
  // if (typeof orderBy === 'string') {
  //   nest = orderBy.split('.')
  //   // valueA = nest.reduce((acc: T[keyof T], l) => {
  //   //   return acc[l as keyof T]
  //   // }, a[orderBy])

  //   let i = 0
  //   while (i < nest.length) { valueA = a[nest[i] as keyof T]; valueB = b[nest[i] as keyof T]; i++ }
  // }

  if (typeof valueA === 'string' && typeof valueB === 'string') {
    if (valueB.toLowerCase() < valueA.toLowerCase()) return invert * -1
    if (valueB.toLowerCase() > valueA.toLowerCase()) return invert * 1
    return 0
  }

  if (valueB < valueA) {
    return invert * -1
  }
  if (valueB > valueA) {
    return invert * 1
  }
  return 0
}

type Order = 'asc' | 'desc';

export function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy, 1)
    : (a, b) => descendingComparator(a, b, orderBy, -1)
}

// export const locationLabelFromLocation = (location: LocationAPI): string | undefined => {
//   const countryCode = location?.country?.code
//   const cityCode = location?.city?.code
//   if (countryCode && countryCode !== '' && cityCode && cityCode !== '') {
//     return countryCode + ', ' + cityCode
//   }
//   const cityName = location?.city?.name
//   if (countryCode && countryCode !== '' && cityName && cityName !== '') {
//     return countryCode + ', ' + cityName
//   }
//   const countryName = location?.country?.name
//   if (countryName && countryName !== '' && cityName && cityName !== '') {
//     return countryName + ', ' + cityName
//   }

//   if (countryName && countryName !== '') {
//     return countryName
//   }

//   if (cityName && cityName !== '') {
//     return cityName
//   }
//   return undefined
// }

export type TimeFormat = 'yearFistDate' | 'dayMonthFormat' |'dateHourFormat'| 'dateHourWithoutDay' | 'dateHourWithTz' | 'AbbrYearAndTz' | 'weekDayAndTz'| 'dateHourwithoutYear';

export const getTimeLabel = (time: Date, timeFormat?: TimeFormat): string => {
  if (timeFormat === 'AbbrYearAndTz') {
    return format(time, 'dd-MM-yy HH:mm z')
  } else if (timeFormat === 'dateHourWithTz') {
    return format(time, 'dd-MM-yyyy HH:mm z')
  } else if (timeFormat === 'weekDayAndTz') {
    return format(time, 'eee, dd-MM-yyyy HH:mm z')
  } else if (timeFormat === 'dateHourwithoutYear') {
    return format(time, 'dd/MM-HH:mm')
  } else if (timeFormat === 'dateHourFormat') {
    return format(time, 'dd-MM-yy HH:mm')
  } else if (timeFormat === 'dateHourWithoutDay') {
    return format(time, 'dd MMM - HH:mm')
  } else if (timeFormat === 'dayMonthFormat') {
    return format(time, 'dd/MM')
  } else if (timeFormat === 'yearFistDate') {
    return format(time, 'yy-MM-dd')
  } else {
    return format(time, 'dd-MM-yy')
  }
}

// custom hook for getting previous value 
export function usePrevious(value: any) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current as any
}

export const getStatusButtonMinWidth = (status: string) => {
  return status === 'upcoming' ? '103px' : status === 'completed' ? '113px' : '60px'
}

export const LAST_UPDATED_DELAY = 48
export const isValidDate = (value: Date | null | undefined): boolean => {
  if (value instanceof Date && !isNaN(+value) && isValid(value)) {
    return true
  } else return false
}

export const delay = (date?: Date): number | undefined => date && isValidDate(date) ? (new Date().getTime() - date.getTime()) : undefined
export const isDateOutdated = (date?: Date): boolean => delay(date) ? moment.duration(delay(date)).asHours() > LAST_UPDATED_DELAY : false
export const humanDelayLabel = (date?: Date): string | undefined => isValidDate(date) ? moment.duration(delay(date)).humanize() : undefined
export const updatedDateLabel = (date: Date): string => `${humanDelayLabel(date)} ago`

export function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  if (value === null || value === undefined) return false
  return true
}

const decodeAdminGroups = (json?: string) => {
  let parsedJson = ['/aeler/aeler-admin', 'aeler/aeler-iot-fleet-managers']
  if (json !== undefined && typeof json === 'string') {
    try { parsedJson = JSON.parse(json) } catch (err) { }
  }
  return parsedJson
}

export const ADMIN_GROUPS = decodeAdminGroups(Config.ADMIN_GROUPS)
export const CAN_PAIR_BOARDS_IN_BULK_CONTAINER_CREATION = Config.FF_CAN_PAIR_BOARDS_IN_BULK_CONTAINER_CREATION != null && Config.FF_CAN_PAIR_BOARDS_IN_BULK_CONTAINER_CREATION === 'true'
export const ENABLED_BOARD_EDITING_FLOW = Config.FF_ENABLE_BOARD_EDITING_FLOW != null && Config.FF_ENABLE_BOARD_EDITING_FLOW === 'true'

export const ENABLED_NEW_ORDER_DIALOG_REFACTORED = Config.FF_ENABLE_NEW_ORDER_DIALOG_REFACTORED != null && Config.FF_ENABLE_NEW_ORDER_DIALOG_REFACTORED === 'true'

export const setDefaultsDataGridState = (state: GridInitialStatePro): GridInitialStatePro => {
  return ({
    ...state,
    preferencePanel: {
      ...state.preferencePanel,
      open: false,
    },
  })
}
