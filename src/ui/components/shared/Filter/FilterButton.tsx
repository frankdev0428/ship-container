import React, { useEffect, useState } from 'react'
import {
  Button,
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  Grid,
  Box,
  IconButton,
  Badge,
  PopperProps,
} from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList'
import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'
import { StringParam, useQueryParams } from 'use-query-params'

import { OrderFilterKey } from '../../Orders/Filter/utils'
import { ContainerFilterKey } from '../../Containers/Filter/utils'
import { BoardFilterKey } from '../../Boards/Filter/utils'
import { getTimeLabel, usePrevious } from '../utils'
import { FacilityFilterKey } from '../../Locations/Filter/utils'
import { BoardProfileFilterKey } from '../../Containers/ContainerCollapsedData/BoardProfile/Filter/utils'

import FilterGridItem from './FilterGridItem'

type PartialRecord<K extends keyof any, T> = Partial<Record<K, T>>

export type FilterKey = OrderFilterKey | ContainerFilterKey | BoardFilterKey | FacilityFilterKey | BoardProfileFilterKey

export type FilterDateRange = [ Date | null, Date | null ]

export type FilterType = 'text' | 'date' | 'date-single' | 'number'

export interface FilterValue {
  value: null | string | number | FilterDateRange;
  type: FilterType
  hidden?: boolean;
  displayValue?: string | number | FilterDateRange;
}

export type Filter = PartialRecord<FilterKey, FilterValue | null>

type FilterOptionsProps = Record<FilterKey, string[]>

export interface FilterValueWithLabel extends FilterValue {
  label: string;
  chipLabelName: string;
}

export type StateFilter = Filter | null

const useOptionsUtils = (options: PartialRecord<FilterKey, FilterValueWithLabel>) => {
  const viewableOptions = makeViewableFilterOptions(options)
  return ({
    filterToType: new Map(typeMapper(options)),
    filterToLabel: new Map(labelMapper(options)),
    filterToChipLabel: new Map(chipLabelMapper(options)),
    emptyFilterOptions: makeEmptyFilterOptions(viewableOptions),
    viewableOptions,
  })
}

const typeMapper = (options: PartialRecord<FilterKey, FilterValueWithLabel>) => {
  const mapper = [[null, 'text']] as [FilterKey | null, FilterType][]
  const optionsKeys = Object.keys(options)
  optionsKeys.forEach((o) => mapper.push([o as FilterKey, (options as Record<FilterKey, FilterValueWithLabel>)[o as FilterKey].type]))
  return mapper
}

const labelMapper = (options: PartialRecord<FilterKey, FilterValueWithLabel>) => {
  const mapper = [[null, 'FIELD']] as [FilterKey | null, string][]
  const optionsKeys = Object.keys(options)
  optionsKeys.forEach((o) => mapper.push([o as FilterKey, (options as Record<FilterKey, FilterValueWithLabel>)[o as FilterKey].label]))
  return mapper
}

const chipLabelMapper = (options: PartialRecord<FilterKey, FilterValueWithLabel>) => {
  const mapper = [] as [FilterKey | null, string][]
  const optionsKeys = Object.keys(options)
  optionsKeys.forEach((o) => mapper.push([o as FilterKey, (options as Record<FilterKey, FilterValueWithLabel>)[o as FilterKey].chipLabelName]))
  return mapper
}

const makeEmptyFilterOptions = (options: PartialRecord<FilterKey, FilterValueWithLabel>): FilterOptionsProps => {
  const opt: any = {}
  const optionsKeys = Object.keys(options)
  optionsKeys.forEach((o) => {
    if (options[o as FilterKey]?.hidden) return
    Object.assign(opt, { [o as FilterKey]: [] as string[] })
  })

  return opt as FilterOptionsProps
}

const makeViewableFilterOptions = (options: PartialRecord<FilterKey, FilterValueWithLabel>): PartialRecord<FilterKey, FilterValueWithLabel> => {
  const opts: PartialRecord<FilterKey, FilterValueWithLabel> = JSON.parse(JSON.stringify(options))
  const optionsKeys = Object.keys(opts)
  optionsKeys.forEach((o) => {
    if (opts[o as FilterKey]?.hidden) delete opts[o as FilterKey]
  })
  return opts
}

const viewableFilters = (filters: StateFilter[]): StateFilter[] => {
  return filters.reduce((vf, sf) => {
    if (sf) {
      const filterKey = Object.keys(sf)[0]
      if (sf[filterKey as FilterKey]?.hidden) return vf
    }
    return vf.concat(sf)
  }, [] as StateFilter[])
}

const isVisible = (filter: StateFilter): boolean => {
  if (filter) {
    const filterKey = Object.keys(filter)[0]
    if (filter[filterKey as FilterKey]?.hidden) return false
  }
  return true
}

const hasValidValue = (sf: StateFilter) => {
  if (sf) {
    const filterValue = Object.values(sf)[0]
    if (filterValue?.type === 'date' && filterValue.value instanceof Array) {
      return (filterValue.value?.length === 2 && ((filterValue.value[0] !== null && !isNaN(filterValue.value[0]?.getTime()) && filterValue.value[0]?.getTime() > 0) || (filterValue.value[1] !== null && !isNaN(filterValue.value[1]?.getTime()) && filterValue.value[1]?.getTime() > 0)))
    }
    if (filterValue?.type === 'date-single' && filterValue.value instanceof Array) {
      return (filterValue.value?.length && (filterValue.value[0] !== null && !isNaN(filterValue.value[0]?.getTime()) && filterValue.value[0]?.getTime() > 0))
    }
    return filterValue?.value != null
  }
  return false
}

const getValidValueOrNull = (sf: StateFilter) => {
  if (sf) {
    const filterValue = Object.values(sf)[0]
    if (filterValue?.type === 'date' && filterValue.value instanceof Array) {
      if (filterValue.value?.length === 2 && ((filterValue.value[0] !== null && !isNaN(filterValue.value[0]?.getTime()) && filterValue.value[0]?.getTime() > 0) || (filterValue.value[1] !== null && !isNaN(filterValue.value[1]?.getTime()) && filterValue.value[1]?.getTime() > 0))) {
        return filterValue.value
      } else return null
    }
    if (filterValue?.type === 'date-single' && filterValue.value instanceof Array) {
      if (filterValue.value?.length && (filterValue.value[0] !== null && !isNaN(filterValue.value[0]?.getTime()) && filterValue.value[0]?.getTime() > 0)) {
        return filterValue.value
      } else return null
    }
    if (filterValue?.value) return filterValue.value
  }
  return null
}

export interface FilterChip {
  type?: 'availability';
  label: string;

  onRemove: () => void;
}

const makeChips = (
  filters: StateFilter[],
  filterToChipLabel: Map<FilterKey | null, string>,
  onRemove: (index: number, filter: StateFilter, newF: StateFilter[]
) => void): FilterChip[] | null => {
  const validFilterVals = filters.map(hasValidValue).filter(Boolean).length

  if (!validFilterVals) return null

  const filterChips: Array<FilterChip | null> = filters.map((sf, index) => {
    if (sf) {
      const filterKey = Object.keys(sf)[0]
      const filterValue = Object.values(sf)[0]
      let label: null | string = null
      if (!(filterValue && filterValue.value)) return null

      if (filterValue.type === 'date' && filterValue.value instanceof Array && filterValue.value.length === 2) {
        if (filterValue.value[0] !== null) {
          if (filterValue.value[1] !== null) {
            label = `${filterToChipLabel.get(filterKey as FilterKey)}: ${getTimeLabel(filterValue.value[0])} - ${getTimeLabel(filterValue.value[1])}`
          } else {
            label = `${filterToChipLabel.get(filterKey as FilterKey)}: After ${getTimeLabel(filterValue.value[0])}`
          }
        } else if (filterValue.value[1] !== null) {
          label = `${filterToChipLabel.get(filterKey as FilterKey)}: Before ${getTimeLabel(filterValue.value[1])}`
        }
      } else if (filterValue.type === 'date-single' && filterValue.value instanceof Array && filterValue.value.length === 2) {
        if (filterValue.value[0] !== null) {
          label = `${filterToChipLabel.get(filterKey as FilterKey)}: ${getTimeLabel(filterValue.value[0])}`
        }
      } else {
        const labelPrefix = filterToChipLabel.get(filterKey as FilterKey)
        const displayValue = (filterValue.displayValue || filterValue.value) as string
        // `${filterToChipLabel.get(filterKey as FilterKey)}: ${moment(filterValue.value[0]).format('DD/MM/YY')}`
        label = labelPrefix
          ? `${filterToChipLabel.get(filterKey as FilterKey)}: ${displayValue}`
          : displayValue
      }

      if (!label) return null

      return ({
        label: label,
        onRemove: () => onRemove(index, sf, filters),
      })
    }
    return null
  })

  return filterChips.filter(Boolean) as FilterChip[]
}

export const applyFilter = (data: any[], filters: StateFilter[], dataFilter: (d: any, filtDic: Filter) => boolean, sort?: boolean) => {
  const filtDic: Filter = {}
  filters.filter(Boolean).forEach(f => Object.assign(filtDic, f))

  let newData: any[] = []
  if (filters.length && filters.map(hasValidValue).filter(Boolean).length) {
    newData = data.filter(d => dataFilter(d, filtDic))
  } else {
    newData = [...data]
  }
  return newData
}

interface FilterButtonProps {
  icon?: boolean;
  data: any[];
  disabled?: boolean;
  options: PartialRecord<FilterKey, FilterValueWithLabel>;

  getOptions: (data: any[], filter: Filter) => string[];
  onFilter: (s: any[], chips: FilterChip[] | null, sort?: boolean) => void;
  dataFilter: (d: any, filtDic: Filter) => boolean

  filters: StateFilter[];
  setFilters: (filters: StateFilter[]) => (dispatch: () => void) => void

  PopperProps?: Partial<PopperProps>
}

const FilterButton = React.memo(({ icon, data, disabled, options, getOptions, onFilter: setCallback, dataFilter, filters, setFilters, PopperProps }: FilterButtonProps): JSX.Element => {
  const [open, setOpen] = React.useState(false)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [queryParams, setQueryParams] = useQueryParams({
    orderId: StringParam,
    containerId: StringParam,
  })

  const prevFilters = usePrevious(filters) as StateFilter[]
  const { filterToType, filterToLabel, emptyFilterOptions, filterToChipLabel, viewableOptions } = useOptionsUtils(options)
  const [filterOptions, setFilterOptions] = useState<FilterOptionsProps>(emptyFilterOptions)
  const [filteredData, setFilteredData] = useState<any[]>([])

  const updateFilterOptions = (filters: StateFilter[], prevFilters: StateFilter[] | undefined, force?: boolean) => {
    const prevFiltersNum = prevFilters?.filter(Boolean).length || 0
    const newFiltersNum = filters.filter(Boolean).length

    const prevFilterKeys = prevFilters?.map(f => f ? Object.keys(f)[0] : null)
    const newFiltersKeys = filters.map(f => f ? Object.keys(f)[0] : null)

    const newFilters: Record<FilterKey, FilterValue | null>[] = []

    newFiltersKeys.forEach((nf, index) => {
      if (force || (!prevFilterKeys || (prevFilterKeys[index] ? nf !== prevFilterKeys[index] : true))) {
        newFilters.push(filters[index] as Record<FilterKey, FilterValue | null>)
      }
    })

    if (force || (newFiltersNum > prevFiltersNum) || newFilters.length) {
      const validFilters = newFilters.filter(Boolean) as Record<FilterKey, FilterValue | null>[]
      const newFilterOptions: FilterOptionsProps = { ...filterOptions }
      validFilters.forEach(filter => {
        const filterKey = Object.keys(filter)[0] as FilterKey
        newFilterOptions[filterKey] = getOptions(data || [], filter)
      })

      setFilterOptions(newFilterOptions)
    }
  }

  // Update filters when fetching data finishes
  useEffect(() => {
    let shouldFilter = false
    // call updateFilterOptions if you want to limit filter options to those present in the displayed list
    // updateFilterOptions(filters, prevFilters, true)
    const currValNum = filters.map(hasValidValue).filter(Boolean).length
    const prevValNum = prevFilters?.map(hasValidValue).filter(Boolean).length || 0

    if (currValNum !== prevValNum) {
      shouldFilter = true
    } else {
      const JSONFilters2 = JSON.stringify(filters.map(getValidValueOrNull).filter(Boolean))
      const JSONPrevFilters2 = prevFilters ? JSON.stringify(prevFilters.map(getValidValueOrNull).filter(Boolean)) : ''

      if (JSONFilters2 === JSONPrevFilters2) {
        shouldFilter = false
      } else {
        shouldFilter = true
      }
    }

    if (shouldFilter) {
      const fData = applyFilter(data, filters, dataFilter)
      setFilteredData(fData)
      setCallback(fData, makeChips(filters, filterToChipLabel, handleRemoveFilter))
    }
  }, [filters])

  useEffect(() => {
    const fData = applyFilter(data, filters, dataFilter)
    setFilteredData(fData)
    setCallback(fData, makeChips(filters, filterToChipLabel, handleRemoveFilter))
  }, [data])

  useEffect(() => {
    const newFilters: StateFilter[] = []
    if (queryParams.orderId) {
      newFilters.push({ id: { value: queryParams.orderId, type: 'text' as FilterType } })
    }

    if (queryParams.containerId) {
      newFilters.push({ containerId: { value: queryParams.containerId, type: 'text' as FilterType } })
    }

    if (newFilters.length) {
      newFilters.push(null)
      setFilters(newFilters)
      updateFilterOptions(newFilters, prevFilters, true)
      handleFilter(data, newFilters)
    }
  }, [queryParams])

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    setOpen((previousOpen) => !previousOpen)
  }

  const handleClose = (event: any /* React.MouseEvent<Document, MouseEvent> */) => {
    event.target?.localName !== 'body' && setOpen(false)
  }

  const handleAddFilter = () => {
    filters.length < Object.keys(viewableOptions).length && setFilters([...filters, null])
  }

  const handleRemoveFilter = (index: number, filter: StateFilter, newfilters?: StateFilter[]) => {
    let newFilters = newfilters ? [...newfilters] : [...filters]
    newFilters.splice(index, 1)
    if (newFilters.length === 0) {
      newFilters = [null]
    }

    // Clear query params
    const f = filter && Object.keys(filter)[0]
    if (f === 'id') setQueryParams({ ...queryParams, orderId: undefined })
    if (f === 'containerId') setQueryParams({ ...queryParams, containerId: undefined })

    setFilters(newFilters)
    filter && hasValidValue(filter) && handleFilter(data, newFilters, true)
  }

  const handleClearFilters = () => {
    setFilters([null])
    setQueryParams({ orderId: undefined, containerId: undefined })
    setCallback(data, null)
  }

  const handleFilter = (
    data: any[],
    filters: StateFilter[],
    sort?: boolean,
  ) => {
    const filtDic: Filter = {}
    filters.filter(Boolean).forEach(f => Object.assign(filtDic, f))

    let newData: any[] = []
    if (filters.length && filters.map(hasValidValue).filter(Boolean).length) {
      newData = data.filter(d => dataFilter(d, filtDic))
    } else {
      newData = [...data]
    }
    setCallback(newData, makeChips(filters, filterToChipLabel, handleRemoveFilter), sort)
  }

  const handleFilterChange = (index: number, filter: StateFilter) => {
    const newFilters = [...filters]
    newFilters[index] = filter
    const prevValNum = filters.map(hasValidValue).filter(Boolean).length
    const newValNum = newFilters.map(hasValidValue).filter(Boolean).length
    if (newValNum > prevValNum) {
      // add filter --> filter through filtered
      handleFilter(filteredData, newFilters)
    } else {
      if (filters[index] != null && hasValidValue(filters[index]) /* Object.values(filters[index] as Filter)[0]?.value */) {
        // a filter key that had a value has changed
        handleFilter(data, newFilters)
        updateFilterOptions(filters, filters)
      }
      updateFilterOptions(newFilters, filters)
    }

    setFilters(newFilters)
  }

  const pickableFilters = viewableFilters(filters)
  const currentFilters = pickableFilters.map(f => f ? Object.keys(f)[0] : undefined).filter(x => x)
  const additionalOptions = Object.keys(viewableOptions).filter(o => !currentFilters.includes(o)) as FilterKey[]
  const filterCount = pickableFilters.map(hasValidValue).filter(Boolean).length

  return (
    <Box /* {...boxProps} */>
      { icon
        ? <Badge color='primary' overlap="circular" anchorOrigin={{ vertical: 'top', horizontal: 'left' }} badgeContent={filterCount}>
              <IconButton
                color='primary'
                disabled={disabled}
                onClick={handleClick} /* size='small' */
                size="large">
                <FilterListIcon fontSize={'small'} />
              </IconButton>
            </Badge>
        : <Button variant="outlined" color="primary" size='small' disabled={disabled} onClick={handleClick}
          startIcon={<Badge color='primary' overlap="circular" anchorOrigin={{ vertical: 'top', horizontal: 'left' }} badgeContent={filterCount}>
              <FilterListIcon fontSize={'small'} />
            </Badge>}
        >
          Filters
        </Button>
      }
      {
        !disabled &&
          <Popper placement='bottom-end' open={open} anchorEl={anchorEl} role={undefined} transition sx={{ zIndex: 1200 }} {...PopperProps}>
          {({ TransitionProps }) => (
            <ClickAwayListener onClickAway={handleClose}>
            <Grow {...TransitionProps} >
                <Paper elevation={8} >
                  <Box>
                    <Box pt={1} pr={1} display='flex' justifyContent='flex-end' >
                      <IconButton size='small' color='primary' onClick={handleClose} ><CloseIcon/></IconButton>
                    </Box>
                    <Box width={450} maxWidth={'90vw'}>
                      <Grid container sx={{ maxHeight: '40vh', overflowY: 'auto', overflowX: 'hidden', padding: '0 8px' }}>
                      {
                        // We cannot simply filter the filters by hidden because we need to preserve
                        // the indexes of all elements
                        filters.map((filter, index) => (
                          isVisible(filter)
                            ? <Box key={index} mt={1} mb={1} width='100%' display='flex' alignItems='flex-start'>
                              <IconButton size='small' color='primary' onClick={() => handleRemoveFilter(index, filter)} sx={{ marginTop: '4px', marginRight: '4px' }}>
                                <CloseIcon sx={{ width: '16px', height: '16px' }}/>
                              </IconButton>
                              <FilterGridItem
                                filter={filter}
                                filterKeyOptions={additionalOptions}
                                filterOptions={filter ? filterOptions[Object.keys(filter)[0] as FilterKey] : []}
                                setFilter={(filter: StateFilter) => handleFilterChange(index, filter)}
                                filterToLabel={filterToLabel}
                                filterToType={filterToType}
                              />
                            </Box>
                            : null
                        ),
                        )
                      }
                      </Grid>
                      <Box display='flex' justifyContent='space-between' p={1}>
                        <Button color='primary' disabled={additionalOptions.length === 0} onClick={handleAddFilter} startIcon={<AddIcon/>}>Add Filter</Button>
                        <Button color='primary' onClick={handleClearFilters}> Clear All Filters</Button>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
            </Grow>
              </ClickAwayListener>
          )}
        </Popper>
      }
      </Box>
  )
})
FilterButton.displayName = 'FilterButton'

export default FilterButton
