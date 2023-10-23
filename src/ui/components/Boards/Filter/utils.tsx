
import { BoardRowDataProps } from '../BoardRow'
import { Filter, FilterValueWithLabel } from '../../shared/Filter/FilterButton'

type BoardTextFilterKey = 'id' | 'containerId' | 'provider'
export type BoardFilterKey = BoardTextFilterKey

export const boardOptions: Record<BoardFilterKey, FilterValueWithLabel> = {
  id: { value: null, type: 'text', label: 'Board Nº', chipLabelName: '' },
  containerId: { value: null, type: 'text', label: 'Container Nº', chipLabelName: '' },
  provider: { value: null, type: 'text', label: 'Provider', chipLabelName: '' },

}

export const filterBoards = (boards: BoardRowDataProps[], filter: string) => (
  boards.filter((o: BoardRowDataProps) => {
    // Don't filter on empty filter
    if (filter.trim().length === 0) { return true }

    // Add attributes to be used in filter
    const attributeList = [
      o.id,
      o.provider,
      ...o.containerIds, // ? o.containerIds.map(ids => ids) : [undefined],
    ].map(e => e != null ? e.toLowerCase() : '')

    for (const attribute of attributeList) {
      if (attribute.includes(filter.toLowerCase())) {
        return true
      }
    }
    return false
  }))

export const getBoardOptions = (boards: BoardRowDataProps[], filter: Filter): string[] => {
  const filterKey = Object.keys(filter)[0]
  switch (filterKey) {
    case 'containerId':
      return [...new Set(boards.map(b => b.containerIds).flat().filter(x => x !== undefined) as string[])]
    default:
      return [...new Set(boards.map(b => (b as any)[filterKey]).filter(x => x !== undefined) as string[])]
  }
}

const exclusions = ['hasGps', 'hasShock', 'hasTempExt', 'hasTempInt', 'hasPressureExt', 'hasPressureInt', 'hasGases', 'healthGps', 'healthSensors', 'hasRFID', 'hasDoor', 'hasHumInt', 'hasHumExt', 'hasLightExt', 'hasLightInt']

export const boardFilter = (board: BoardRowDataProps, filtDic: Filter): boolean => {
  const shouldFilter = Object.entries(board).reduce((res, cur) => {
    if (exclusions.includes(cur[0])) return res
    const currFilter = filtDic[cur[0] as 'id']
    if (currFilter != null && currFilter.value != null) {
      return res && (filtDic[cur[0] as 'id'] as any).value === cur[1]
    }
    return res
  }, true)

  return (
    // shouldFilter &&
    (filtDic.id?.value
      ? board.id === filtDic.id?.value
      : true) &&
    (filtDic.provider?.value
      ? board.provider === filtDic.provider?.value
      : true) &&
    (filtDic.containerId?.value && filtDic.containerId.value !== undefined
      ? board.containerIds?.findIndex(id => id === filtDic.containerId?.value) !== -1
      : true)
  )
}
