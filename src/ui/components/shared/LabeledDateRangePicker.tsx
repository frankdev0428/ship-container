import * as React from 'react'
import TextField, { TextFieldProps } from '@mui/material/TextField'
import { LocalizationProvider } from '@mui/x-date-pickers-pro'
import { DateRangePicker, DateRange, DateRangePickerProps } from '@mui/x-date-pickers-pro/DateRangePicker'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { MuiTextFieldProps } from '@mui/x-date-pickers/internals'
import { Grid } from '@mui/material'

import { isValidDate } from './utils'

export interface LabeledDateRangePickerProps
  extends Omit<DateRangePickerProps<Date, Date>, 'renderInput'> {
  textFieldProps?: TextFieldProps,
  id?: string,
  labelStart: string;
  labelEnd: string,
  required?: boolean;
}

const LabeledDateRangePicker = ({
  id,
  labelStart,
  labelEnd,
  value,
  textFieldProps,
  required,
  onChange,
  ...restProps
}: LabeledDateRangePickerProps): JSX.Element => {
  const [invalidDateFormat, setInvalidDateFormat] = React.useState(false)

  const handleChange = (value: DateRange<Date>, keyboardInputValue?: string | undefined) => {
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

  const renderInput = (startProps: MuiTextFieldProps, endProps: MuiTextFieldProps) => {
    const fieldStartProps: MuiTextFieldProps = {
      ...startProps,
      margin: 'dense',
      variant: 'outlined',
      ...textFieldProps,
      // ATTENTION: Because default min date is 01-01-1900 and max date 31-12-2099, the date picker may still show an error
      // despite having a valid date due to restParams.error
      error: startProps.error || textFieldProps?.error || invalidDateFormat,
    }

    const fieldEndProps: MuiTextFieldProps = {
      ...endProps,
      margin: 'dense',
      variant: 'outlined',
      ...textFieldProps,
      // ATTENTION: Because default min date is 01-01-1900 and max date 31-12-2099, the date picker may still show an error
      // despite having a valid date due to restParams.error
      error: endProps.error || textFieldProps?.error || invalidDateFormat,
    }
    return (
      <Grid container columnSpacing={2} display='flex' flexDirection='row' alignItems='center'>
        <Grid item xs={6}>
          <TextField
            required={required}
            fullWidth
            id={id || `date-range-picker-${labelStart?.toString().split(' ').join('-')}`}
            size='small'
            {...startProps}
            // sx={{ p: 0 }}
            error={value[0] !== null && !isValidDate(value[0])}
            {...fieldStartProps}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            required={required}
            fullWidth
            id={id || `date-range-picker-${labelEnd?.toString().split(' ').join('-')}`}
            size='small'
            {...endProps}
            // sx={{ p: 0 }}
            error={value[1] !== null && !isValidDate(value[1])}
            {...fieldEndProps}
          />
        </Grid>
      </Grid>
    )
  }

  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      localeText={{ start: labelStart, end: labelEnd }}
    >
      <DateRangePicker
        inputFormat="dd-MM-yyyy"
        value={value}
        onChange={(date, keyboardInputValue) => {
          if ((keyboardInputValue && keyboardInputValue.length !== 10) || (date[0] !== null && !isValidDate(date[0])) || (date[1] !== null && !isValidDate(date[1]))) {
            setInvalidDateFormat(true)
            return
          }

          if (date[0] === null || isValidDate(date[0]) || date[1] === null || isValidDate(date[1])) {
            handleChange(date)
          }
          setInvalidDateFormat(false)
        }}
        renderInput={renderInput}
        {...restProps}
        OpenPickerButtonProps={{ size: 'small', color: 'primary' }}
      />
    </LocalizationProvider>
  )
}

export default LabeledDateRangePicker
