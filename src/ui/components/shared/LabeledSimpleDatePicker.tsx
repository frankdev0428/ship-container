import React from 'react'
import { TextField, TextFieldProps } from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker, DatePickerProps, LocalizationProvider } from '@mui/x-date-pickers'

export interface LabeledSimpleDatePickerProps
  extends Omit<DatePickerProps<Date, Date>, 'renderInput'> {
  textFieldProps?: TextFieldProps
}

export const LabeledSimpleDatePicker: React.FC<
  LabeledSimpleDatePickerProps
> = ({
  label,
  textFieldProps,
  onChange,
  ...restProps
}) => {
  const handleChange = (value: Date | null) => {
    /*
     *
     * See https://github.com/mui-org/material-ui-pickers/issues/1358#issuecomment-628015527
     *
     * @material-ui/pickers operate on a Date, but we really want a String.
     * DateUtils let @material-ui/pickers pick dates in the local
     * timezone ... but they ensure outside callers only see ISO8601 Strings.
     */

    /**
     * To ensure the date picked is the same point in time for everyone
     * we remove/add the offset to the UTC to the time
     * This way the UTC time should be midnight when send to as iso formatted string, e.g. JSON Rest API.
     *
     * Why? Because material-ui selects dates in local time, not in UTC. If we
     * were to run date.toISOString(), that would convert to UTC and then
     * convert to String; but if we convert to UTC, that changes the date.
     */
    if (value instanceof Date) {
      // move the time away from midnight, opposite direction of utc offset
      const offset = -value.getTimezoneOffset()
      value.setHours(Math.trunc(offset / 60), offset % 60)
      // using  trunc() because there could be negative offsets, too.
    }
    onChange(value)
  }

  const renderInput = ({ inputProps, ...restParams }: TextFieldProps) => {
    const fieldProps: TextFieldProps = {
      ...restParams,
      margin: 'dense',
      variant: 'outlined',
      ...textFieldProps,
    }
    return (
      <TextField
        id={`date-picker-${label}`}
        size='small'
        inputProps={{
          ...inputProps,
          placeholder: textFieldProps?.placeholder,
        }}
        sx={{ p: 0 }}
        {...fieldProps}
      />
    )
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label={label}
        onChange={handleChange}
        inputFormat="dd-MM-yyyy"
        renderInput={renderInput}
        {...restProps}
      />
    </LocalizationProvider>
  )
}
