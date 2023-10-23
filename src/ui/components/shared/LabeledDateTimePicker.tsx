import React from 'react'
import { format } from 'date-fns'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { TextField, InputAdornment, TextFieldProps } from '@mui/material'
import { DateTimePicker, DateTimePickerProps, LocalizationProvider } from '@mui/x-date-pickers'

export interface LabeledDateTimePickerProps
  extends Omit<DateTimePickerProps<Date, Date>, 'renderInput'> {
  textFieldProps?: TextFieldProps
}

const LabeledDateTimePicker: React.FC<LabeledDateTimePickerProps> = ({
  label,
  InputProps,
  textFieldProps,
  ...restProps
}) => {
  const tz = format(new Date().getTime(), 'dd-MM-yyyy HH:mm z').substring(17)

  const renderInput = ({ inputProps, ...restParams }: TextFieldProps) => {
    const fieldProps: TextFieldProps = {
      ...restParams,
      size: 'small',
      margin: 'dense',
      variant: 'outlined',
      ...textFieldProps,
    }
    return (
      <TextField
        id={`date-picker-${label}`}
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
      <DateTimePicker
        ampm={false}
        label={label}
        inputFormat="dd-MM-yyyy HH:mm"
        InputProps={{
          ...InputProps,
          startAdornment: <InputAdornment position="start"> {tz} </InputAdornment>,
        }}
        renderInput={renderInput}
        OpenPickerButtonProps={{ size: 'small', color: 'primary' }}
        {...restProps}
      />
    </LocalizationProvider>
  )
}

export default LabeledDateTimePicker
