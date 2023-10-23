import moment from 'moment'

import { Filter, FilterValueWithLabel } from '../../../../shared/Filter/FilterButton'
import { getTimeLabel } from '../../../../shared/utils'
import { BoardProfileRowDataProps } from '../BoardProfileRow'

type BoardProfileTextFilterKey = 'id' | 'containerId' | 'boardId' | 'boardSource' | 'installComments' | 'removalComments' | 'installTechnicianId' | 'removalTechnicianId' | 'installLocationId' | 'removalLocationId' | 'installLocationName' | 'removalLocationName'
type BoardProfileDateFilterKey = 'createdAt' | 'updatedAt' | 'installDate' | 'removalDate'
export type BoardProfileFilterKey = BoardProfileTextFilterKey | BoardProfileDateFilterKey

export const boardProfileOptions: Record<BoardProfileFilterKey, FilterValueWithLabel> = {
  id: { value: null, type: 'text', label: 'Id', chipLabelName: '', hidden: true },
  containerId: { value: null, type: 'text', label: 'Container id', chipLabelName: '' },
  boardId: { value: null, type: 'text', label: 'Board Id', chipLabelName: '' },
  boardSource: { value: null, type: 'text', label: 'Board source', chipLabelName: '' },
  createdAt: { value: null, type: 'date-single', label: 'Created at', chipLabelName: '' },
  updatedAt: { value: null, type: 'date-single', label: 'Updated at', chipLabelName: '' },
  installDate: { value: null, type: 'date-single', label: 'Install date', chipLabelName: '' },
  removalDate: { value: null, type: 'date-single', label: 'Removal Date', chipLabelName: '' },
  installComments: { value: null, type: 'text', label: 'Install Comments', chipLabelName: '' },
  removalComments: { value: null, type: 'text', label: 'Removal Comments', chipLabelName: '' },
  installTechnicianId: { value: null, type: 'text', label: 'Install Technician id', chipLabelName: '' },
  removalTechnicianId: { value: null, type: 'text', label: 'Removall Technician id', chipLabelName: '' },
  installLocationId: { value: null, type: 'text', label: 'Install location id', chipLabelName: '' },
  removalLocationId: { value: null, type: 'text', label: 'Removal location id', chipLabelName: '' },
  installLocationName: { value: null, type: 'text', label: 'Install location name', chipLabelName: '' },
  removalLocationName: { value: null, type: 'text', label: 'Install location name', chipLabelName: '' },

}

export const filterBoardsProfile = (boards: BoardProfileRowDataProps[], filter: string) => (
  boards.filter((b: BoardProfileRowDataProps) => {
    // Don't filter on empty filter
    if (filter.trim().length === 0) { return true }

    // Add attributes to be used in filter
    const attributeList = [
      b.id,
      b.containerId,
      b.boardId,
      b.boardSource,
      b.installComments,
      b.removalComments,
      b.installTechnicianId,
      b.removalTechnicianId,
      b.installLocationId,
      b.removalLocationId,
      b.installLocationName,
      b.removalLocationName,
      b.createdAt ? getTimeLabel(b.createdAt) : undefined,
      b.updatedAt ? getTimeLabel(b.updatedAt) : undefined,
      b.installDate ? getTimeLabel(b.installDate) : undefined,
      b.removalDate ? getTimeLabel(b.removalDate) : undefined,

    ].map(e => e != null ? e.toLowerCase() : '')

    for (const attribute of attributeList) {
      if (attribute.includes(filter.toLowerCase())) {
        return true
      }
    }
    return false
  }))

const exclusions = ['removalDate', 'installDate', 'updatedAt', 'createdAt']

export const getBoardsProfileOptions = (boards: BoardProfileRowDataProps[], filter: Filter): string[] => {
  const filterKey = Object.keys(filter)[0]
  switch (filterKey) {
    // case 'containersArriving':
    // case 'containersDeparting':
    // case 'containersAtDepot':
    // case 'containersOverIdleLimit':
    // case 'containersBlocked':
    // case 'daysidle':
    case 'createdAt':
      return []
    default:
      return [...new Set(boards.map(b => (b as any)[filterKey]).filter(x => x !== undefined) as string[])]
  }
}

export const boardProfileFilter = (board: BoardProfileRowDataProps, filtDic: Filter): boolean => {
  const shouldFilter = Object.entries(board).reduce((res, cur) => {
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
      ? board.id === filtDic.id?.value
      : true) &&
      (
        (filtDic.createdAt?.value && filtDic.createdAt?.value instanceof Array && filtDic.createdAt?.value.length)
          ? (filtDic.createdAt.value[0]
              ? board.createdAt ? moment(board.createdAt).isSameOrAfter(moment(filtDic.createdAt.value[0]), 'day') : true
              : true)
          : true
      ) &&
      (
        (filtDic.updatedAt?.value && filtDic.updatedAt?.value instanceof Array && filtDic.updatedAt?.value.length)
          ? (filtDic.updatedAt.value[0]
              ? board.updatedAt ? moment(board.updatedAt).isSameOrAfter(moment(filtDic.updatedAt.value[0]), 'day') : true
              : true)
          : true
      ) &&
      (
        (filtDic.installDate?.value && filtDic.installDate?.value instanceof Array && filtDic.installDate?.value.length)
          ? (filtDic.installDate.value[0]
              ? board.installDate ? moment(board.installDate).isSameOrAfter(moment(filtDic.installDate.value[0]), 'day') : true
              : true)
          : true
      ) &&
      (
        (filtDic.removalDate?.value && filtDic.removalDate?.value instanceof Array && filtDic.removalDate?.value.length)
          ? (filtDic.removalDate.value[0]
              ? board.removalDate ? moment(board.removalDate).isSameOrAfter(moment(filtDic.removalDate.value[0]), 'day') : true
              : true)
          : true
      )
  )
}
