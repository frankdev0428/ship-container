import React, { useEffect, useState, MouseEvent as ReactMouseEvent, useCallback } from 'react'
import {
  TextField,
  Autocomplete,
  Box,
} from '@mui/material'

import { AutoCompleteField, filterOptionsNoWhiteSpace, OptionType, StyledChip } from './utils'
import NewValueDialog from './NewValueDialog'

const stopP = (e: ReactMouseEvent<HTMLSpanElement, MouseEvent>) => e.stopPropagation()

function AutoCompleteFieldControlled<T, Multiple extends boolean | undefined, DisableClearable extends boolean | undefined, FreeSolo extends boolean | undefined>(
  props: Omit<AutoCompleteField<OptionType, Multiple, DisableClearable, FreeSolo>, 'renderInput'>,
): JSX.Element {
  const {
    error,
    loading,
    disabled,
    multiple,
    canAddNew,
    addNewLabel,
    value,
    overlayText,
    options,
    renderOption,
    label,
    margin,
    onChange,
    dispatch,
    TextFieldProps,
    preProcessNew,
    // hasDefaultAdd,
    NewForm,
    ...restProps
  } = props

  let defaultVal: OptionType | OptionType[] = {
    value: null as any,
    label: '',
  }

  if (typeof value === 'string') {
    defaultVal = {
      value: value,
      label: options.find((o) => o.value === value)?.label || '',
    }
  }

  if (multiple && value instanceof Array && !value.find((v) => v === null)) {
    defaultVal = options.filter((o) => o.value && value?.includes(o.value))
  }

  const [value_, setValue] = useState< OptionType | OptionType[] | null >(defaultVal)
  const [dialogProps, setDialogProps] = useState({ open: false, inputValue: '' })
  const [overlayText_, setOverlayText] = useState<string | undefined>(overlayText)

  useEffect(() => {
    if (!value) {
      setValue(defaultVal)
      return
    }

    let compVal2 = defaultVal
    if (typeof value === 'string') {
      compVal2 = { value: value, label: options.find((o) => o.value === value)?.label || value }
    } else {
      const filteredOptions = options.filter((o) => o.value && value?.includes(o.value))
      if (filteredOptions.length === 0) {
        compVal2 = value.map(v => ({
          value: v,
          label: v,
        })) as OptionType[]
      } else {
        compVal2 = [
          ...filteredOptions,
          ...value
            .filter((o) => o && !options.map((e) => e.value)?.includes(o))
            .map(
              (e) =>
                ({
                  value: e,
                  inputValue: e,
                  label: `Add "${preProcessNew ? preProcessNew(e) : e}"`,
                } as OptionType),
            ),
        ]
      }
    }
    setValue(compVal2)
  }, [value])

  useEffect(() => { setOverlayText(overlayText) }, [overlayText])

  const handleCloseDialog = () => setDialogProps({ open: false, inputValue: '' })

  const handleNewDialogCreate = useCallback((value: string) => {
    multiple && Array.isArray(value_)
      ? onChange([...value_, { value: value, inputValue: value }])
      : onChange({ value: value, inputValue: value })
    handleCloseDialog()
  }, [value_])

  const setCallback = (option: OptionType) => {
    setValue(Array.isArray(value_) ? [...value_, option] : option)
  }

  const filterOptions = useCallback(filterOptionsNoWhiteSpace(canAddNew, addNewLabel, preProcessNew), [canAddNew, addNewLabel])

  const renderOption_: typeof renderOption = useCallback((props, option, state) => renderOption && !option.addNew
    ? renderOption(props, option, state)
    : (<Box component='li' {...props} key={option.value} {...option.addNew && { style: { fontStyle: 'italic' } }} >{option.label}</Box>)
  , [])

  return (
    <>
      <Autocomplete
        size="small"
        value={value_ as any}
        clearOnBlur
        handleHomeEndKeys
        selectOnFocus
        // freeSolo
        multiple={multiple}
        disabled={disabled}
        loading={loading}
        options={options}
        filterOptions={filterOptions}
        getOptionLabel={(option) => {
          if (!option) return ''
          // e.g value selected with enter, right from the input
          if (typeof option === 'string') {
            return option
          }
          if (option.inputValue) {
            return preProcessNew
              ? preProcessNew(option.inputValue)
              : option.inputValue
          }
          return option.label
        }}
        isOptionEqualToValue={(option, selVal) => {
          return selVal.value != null && option.value === selVal.value
        }}
        renderOption={renderOption_}
        renderInput={(params) => (
          <TextField
            {...params}
            error={error}
            margin={margin || 'dense'}
            type="text"
            label={label}
            variant="outlined"
            inputProps={{
              ...params.inputProps,
              ...multiple && { required: Array.isArray(value_) && value_.length === 0 },
              ...overlayText_ && { value: '', placeholder: overlayText_ },
            }}
            {...overlayText_ && {
              // inputProps: {
              //   ...params.inputProps,
              //   value: '',
              //   placeholder: overlayText_,
              // },
              InputLabelProps: { shrink: true },
            }}

            {...TextFieldProps}
          />
        )}
        { ...multiple && {
          renderTags: (tagValue, getTagProps) =>
            tagValue.map((option, index) => (
              // eslint-disable-next-line react/jsx-key
              <StyledChip
                color='primary'
                size='small'
                variant='outlined'
                {...getTagProps({ index })}
                label={option.label}
              />)),
        }}
        {...(dispatch && {
          onInputChange: (event, newInputValue) => {
            setOverlayText(newInputValue !== '' ? undefined : overlayText)
            event?.type === 'change' && dispatch(preProcessNew ? preProcessNew(newInputValue) : newInputValue)
          },
        })}
        onChange={(event, newValue) => {
          event.stopPropagation()
          if (typeof newValue === 'string') {
            // timeout to avoid instant validation of the dialog's form.
            NewForm && setTimeout(() => { setDialogProps({ open: true, inputValue: newValue }) })
            return
          } else {
            if (newValue) {
              // If multiple values
              if (Array.isArray(newValue)) {
                // If user clicked on the "Add new" option
                if (newValue.find(nv => nv.addNew)) {
                  setDialogProps({ open: true, inputValue: '' })
                  return
                } else {
                  // If user input
                  const newVal = newValue.find(nv => nv.inputValue)
                  if (newVal && newVal.inputValue && NewForm) {
                    setDialogProps({ open: true, inputValue: newVal.inputValue })
                    return
                  }
                }
              } else { // If single value
                // If user clicked on the "Add new" option
                if (newValue.addNew) {
                  setDialogProps({ open: true, inputValue: '' })
                  return
                } else {
                  // If user input
                  if (newValue.inputValue && NewForm) {
                    setDialogProps({ open: true, inputValue: newValue.inputValue })
                    return
                  }
                }
              }
            }
          }

          return newValue && multiple && Array.isArray(newValue)
            ? onChange(newValue as OptionType[] /* .map(e => e.value) */)
            : onChange(newValue ? (newValue as unknown as OptionType) /* .value  */ : { value: null, label: '' })
        }}
        noOptionsText={'No matching options'}
        // It should be safe to stop event bubbling here because this is a popup window, it should never trigger any side effects elsewhere
        // Whenever we click inside this popper element, previously opening the popper should have triggered any click side effects on other components
        componentsProps={{ popper: { onClick: stopP, onMouseDown: stopP } }}
        // {...restProps}
      />
      {dialogProps.open && (
        NewForm
          ? NewForm(dialogProps.inputValue, handleCloseDialog, setCallback)
          : addNewLabel && <NewValueDialog
            title={addNewLabel}
            onClose={handleCloseDialog}
            onCreate={handleNewDialogCreate}
          />
      )}
    </>
  )
}

export default AutoCompleteFieldControlled
