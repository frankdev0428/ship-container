import React, { useState } from 'react'
import { TextField, TextFieldProps } from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker, DatePickerProps, LocalizationProvider } from '@mui/x-date-pickers'

import { isValidDate } from './utils'
export interface LabeledDatePickerProps
  extends Omit<DatePickerProps<Date, Date>, 'renderInput'> {
  textFieldProps?: TextFieldProps,
  id?: string,
}

export const LabeledDatePicker: React.FC<LabeledDatePickerProps> = ({
  id,
  label,
  value,
  textFieldProps,
  onChange,
  ...restProps
}) => {
  const [invalidDateFormat, setInvalidDateFormat] = useState(false)

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
    if (value instanceof Date && value?.getTime() > 0) {
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
      // ATTENTION: Because default min date is 01-01-1900 and max date 31-12-2099, the date picker may still show an error
      // despite having a valid date due to restParams.error
      error: restParams.error || textFieldProps?.error || invalidDateFormat,
    }
    return (
      <TextField
        id={id || `date-picker-${label?.toString().split(' ').join('-')}`}
        size='small'
        inputProps={{
          ...inputProps,
          placeholder: textFieldProps?.placeholder,
        }}
        sx={{ p: 0 }}
        error={value !== null && !isValidDate(value)}
        {...fieldProps}
      />
    )
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label={label}
        value={value}
        inputFormat="dd-MM-yyyy"
        // onChange={handleChange}
        onChange={(date, keyboardDate) => {
          if ((keyboardDate && keyboardDate.length !== 10) || (date !== null && !isValidDate(date))) {
            setInvalidDateFormat(true)
            return
          }

          if (date === null || isValidDate(date)) handleChange(date)
          setInvalidDateFormat(false)
        }}
        renderInput={renderInput}
        {...restProps}
        OpenPickerButtonProps={{ size: 'small', color: 'primary' }}
      />
    </LocalizationProvider>
  )
}
