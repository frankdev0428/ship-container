import { ReactNode } from 'react'
import {
  TextFieldProps,
  AutocompleteProps,
  createFilterOptions,
  Chip,
  styled,
} from '@mui/material'
import { FilterOptionsState } from '@mui/material/useAutocomplete'

export type OptionType = {
  value: string | null
  label: string
  inputValue?: string
  addNew?: boolean
  disabled?: boolean
  customProps?: any
}

/**
 * Generic Autocomplete type declaration
 * 
 * @param {boolean} canAddNew (optional)
 * Allows adding new values in the form of simple strings based on the text input
 * 
 * @param {string} addNewLabel (optional)
 * When defined, the list of options will include an option as "Add new <addNewLabel>" that  when clicked on
 * will open a dialog for adding the new value
 * 
 * Note: Needs canAddNew set to true
 * 
 * @param {function} NewForm (optional)
 * This form will be rendered whenever a new value is to be added by:
 *  - clicking "Add new <addNewLabel>" or
 *  - inputting text and clicking on "Add new <text input>"
 * 
 * Note: If NewForm is undefined and addNewLabel is defined, a simple form for adding a string value will be rendered
 * 
 */
export interface AutoCompleteField<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
> extends Omit<AutocompleteProps<OptionType, Multiple, DisableClearable, FreeSolo>, 'onChange' | 'value' > {
  label?: string
  loading?: boolean
  canAddNew?: boolean
  addNewLabel?: string
  value?: string | undefined | null | string[]
  margin?: TextFieldProps['margin']
  error?: boolean
  overlayText?: string
  TextFieldProps?: {
    onFocus?: () => void
    onBlur?: () => void
    helperText?: ReactNode
    required?: boolean
  }
  dispatch?: (value: string) => void
  onChange: (newValue: any /* (string | null | undefined) | (string | null)[] */) => void
  preProcessNew?: (value: string) => string
  NewForm?: (value: string, onClose: () => void, callback: (o: OptionType) => void) => JSX.Element
  // hasDefaultAdd?: boolean
}

const filter = createFilterOptions<OptionType>({
  ignoreAccents: true,
  ignoreCase: true,
  matchFrom: 'any',
  stringify: (option) => option.label?.replace(/\s/g, ''),
  trim: true,
})

export const filterOptionsNoWhiteSpace = (canAddNew?: boolean, addNewLabel?: string, preProcessNew?: (value: string) => string) => (
  options: OptionType[],
  params: FilterOptionsState<OptionType>,
) : OptionType[] => {
  const filtered = filter(options, { ...params, inputValue: params.inputValue.replace(/\s/g, '') })
  const matchedOptions = options.filter((o) => o.label.localeCompare(params.inputValue, 'en', { sensitivity: 'base', ignorePunctuation: true }) === 0)
  const inputValue_ = params.inputValue !== '' && preProcessNew ? preProcessNew(params.inputValue) : params.inputValue
  if (canAddNew && inputValue_ !== '' && matchedOptions.length === 0) {
    filtered.push({
      value: inputValue_,
      inputValue: inputValue_,
      label: `Add "${inputValue_}"`,
    })
  }
  if (canAddNew && addNewLabel && inputValue_ === '') {
    filtered.splice(0, 0, { value: null, label: `Add new ${addNewLabel}`, addNew: true })
  }
  return filtered
}

export const StyledChip = styled(Chip)(({ theme }) => ({
  backgroundColor: `${theme.palette.primary.main}1a`, // for opacity
  border: 'none',
  height: 24,
}))
