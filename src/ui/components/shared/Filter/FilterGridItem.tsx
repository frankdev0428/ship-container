import React from 'react'
import { MenuItem, Grid, TextField, selectClasses } from '@mui/material'
import { styled } from '@mui/material/styles'
import moment from 'moment'

import { LabeledDatePicker } from '../../shared/LabeledDatePicker'

import { Filter, FilterDateRange, FilterKey, FilterType, StateFilter } from './FilterButton'

const StyledTextField = styled(TextField)(({ theme, disabled }) => ({
  [`& .${selectClasses.icon}`]: {
    fill: !disabled ? theme.palette.primary.main : undefined,
  },
}))

interface SelectableInputProps {
  isField?: boolean;
  value: string | number | null;
  options: string[];
  disabled?: boolean;
  noMargin?: boolean;
  filterToLabel: Map<FilterKey | null, string>;

  onChange: (o: string) => void;
}

const SelectableInput: React.FC<SelectableInputProps> = ({ isField, value, options, disabled, noMargin, filterToLabel, onChange }) => {
  const label = isField ? filterToLabel.get(value as FilterKey) : undefined

  return (
    <StyledTextField
      select
      fullWidth
      size='small'
      disabled={disabled}
      margin={noMargin ? 'none' : 'dense'}
      value={value || ''}
      variant='standard'
      onChange={(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => onChange(event.target.value)}
      InputProps={{
        // disableUnderline: true,
        sx: { color: value ? undefined : 'lightgray' },
      }}
      SelectProps={{
        displayEmpty: true,
        renderValue: (v) => (label || (v && v !== '' ? v as string : 'SELECT')) as string,
        MenuProps: {
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
          // getContentAnchorEl: null,
        },
      }}
    >
        {!options.length && <MenuItem value={'No results available'} disabled>No results available</MenuItem>}
        {options.map(op => <MenuItem key={op} value={op} >{isField ? filterToLabel.get(op as FilterKey) : op}</MenuItem>)}
    </StyledTextField>
  )
}

interface FilterGridItemProps {
  filter: Filter | null
  filterKeyOptions: FilterKey[];
  filterOptions: string[];
  filterToType: Map<FilterKey | null, FilterType>;
  filterToLabel: Map<FilterKey | null, string>;

  setFilter: (f: StateFilter) => void;
}

const FilterGridItem: React.FC<FilterGridItemProps> = ({ filter, filterKeyOptions, filterOptions, filterToType, filterToLabel, setFilter }) => {
  const filterKey = filter ? Object.keys(filter)[0] : null
  const type = filter ? filter[filterKey as FilterKey]?.type : 'text'

  const handleOptionSelect = (option: string) => {
    filterKey && setFilter({ [filterKey]: { value: option, type: 'text' } })
  }

  let dateRange: FilterDateRange = [null, null]
  if ((type === 'date' || type === 'date-single') && filter && filterKey) {
    const dr = filter[filterKey as FilterKey]
    if (dr && dr.value && dr.value instanceof Array && dr.value?.length === 2) {
      dateRange = dr.value as FilterDateRange
    }
  }

  return (
    <Grid container spacing={1} >
      <Grid item xs={6}>
        <SelectableInput
          isField
          noMargin
          value={filterKey}
          options={filterKeyOptions}
          onChange={(filterKey) => setFilter({ [filterKey]: { value: null, type: filterToType.get(filterKey as FilterKey) } })}
          filterToLabel={filterToLabel}
        />
      </Grid>
      {
        type === 'date' &&
          <Grid item xs={6} />
      }
      <Grid item xs={6}>
        {
          type === 'text' || type === 'number'
            ? <SelectableInput
              noMargin
              value={(filter && filterKey) ? filter[filterKey as FilterKey]?.value as string || '' : ''}
              options={filterOptions}
              disabled={!filterKey}
              onChange={handleOptionSelect}
              filterToLabel={filterToLabel}
            />
            : <LabeledDatePicker
                value={dateRange[0]}
                label={type === 'date' ? 'FROM' : undefined}
                textFieldProps={{ margin: 'none', variant: 'standard', placeholder: type === 'date-single' ? 'PICK DATE' : undefined }}
                onChange={(date) => filterKey && setFilter({ [filterKey]: { value: [moment(date).startOf('day').toDate(), dateRange[1]], type: type } }) }
              />
        }
      </Grid>
      {
        type === 'date' &&
          <Grid item xs={6}>
            <LabeledDatePicker
              label="TO"
              value={dateRange[1]}
              minDate={dateRange[0] || undefined}
              textFieldProps={{ margin: 'none', variant: 'standard' }}
              onChange={(date) => filterKey && setFilter({ [filterKey]: { value: [dateRange[0], moment(date).endOf('day').toDate()], type: type } }) }
            />
          </Grid>
      }
    </Grid>
  )
}

export default FilterGridItem
