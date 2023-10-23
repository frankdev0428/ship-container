import React, { useRef } from 'react'
import {
  Box,
  FormControl,
  InputLabel,
  OutlinedInput,
  Input,
  InputAdornment,
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  MenuList,
  MenuItem,
  outlinedInputClasses,
  TextFieldProps,
  InputBaseComponentProps,
} from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'

const StyledOutlinedInput = styled(OutlinedInput)(({ theme }) => ({
  // [`& .${outlinedInputClasses.notchedOutline}`]: {
  //   borderColor: theme.palette.text.unselected,
  // },
}))

interface SelectOption { value:string | null; label: string, disabled?: boolean }

export type SelectPopperProps = Omit<TextFieldProps, 'onChange'> & {
    label?: string;
    value?: number | string | null;
    options: SelectOption[];
    InputProps?: any;
    isStandardInput?: boolean;
    overlayText?: string;

    onChange: (v: string | null) => void;
}

const SelectPopper = ({ disabled, required, label, value, options, onChange, isStandardInput, InputProps, overlayText, ...restProps }: SelectPopperProps) => {
  const [open, setOpen] = React.useState(false)
  const anchorRef = useRef<any>(null)

  const theme = useTheme()

  // const executeScroll = () => anchorRef?.current?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' })

  const handleToggle = () => {
    !disabled && setOpen((prevOpen) => !prevOpen)
  }

  const handleClose = (event: MouseEvent | TouchEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return
    }
    setOpen(false)
  }

  const InputComponent = isStandardInput ? Input : StyledOutlinedInput

  const inputProps: InputBaseComponentProps = {
    style: {
      color: 'transparent',
      textShadow: `0 0 0 ${theme.palette.text.primary}`,
    },
  }

  return (
    <>
      <FormControl ref={anchorRef} variant="outlined" size='small' margin='dense' style={{ ...restProps.style }} fullWidth required={required} disabled={disabled}>
        <InputLabel htmlFor='display-name' { ...overlayText && { shrink: true }} >{label}</InputLabel>
        <InputComponent
          fullWidth
          // readOnly
          sx={{ padding: 0, paddingRight: '6px', width: '100%', backgroundColor: 'white' }}
          // inputProps={{
          //   style: { padding: '10.5px 0 10.5px 10.5px' },
          // }}
          value={options.find((o) => o.value === value)?.label || ''}
          label={label}
          onClick={handleToggle}
          endAdornment={<InputAdornment position='end' >
            {open
              ? <ArrowDropUpIcon color={disabled ? 'disabled' : 'primary'} fontSize='medium' />
              : <ArrowDropDownIcon color={disabled ? 'disabled' : 'primary'} fontSize='medium' />}
          </InputAdornment>}
          inputProps={{ ...inputProps }}
          {...overlayText && {
            inputProps: { ...inputProps, ...restProps.inputProps, value: '', placeholder: overlayText },
            notched: true,
            // displayEmpty: true,
          }}
          { ...InputProps}
        />
      <Popper open={disabled ? false : open} anchorEl={anchorRef.current} role={undefined} transition placement="bottom" sx={{ width: anchorRef.current?.offsetWidth, zIndex: 1300 }} >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} timeout={100} /* onEntered={executeScroll} */>
            <Paper
              elevation={8}
              sx={{ maxHeight: '50vh', display: 'flex', flexDirection: 'column' }}
              // It should be safe to stop event bubbling here because this is a popup window, it should never trigger any side effects elsewhere
              // Whenever we click inside this element, opening the popper should have triggered any click side effects on other components
              onClick={e => e.stopPropagation()}
              onMouseDown={e => e.stopPropagation()}
            >
              <ClickAwayListener onClickAway={handleClose} >
                <MenuList
                  id="split-button-menu"
                  sx={{ overflowY: 'auto' }}
                >
                  {options.map((option, index) => (
                    <MenuItem
                      key={option.value}
                      disabled={option.disabled}
                      selected={option.value === value}
                      onClick={() => {
                        onChange(option.value)
                        setOpen(false)
                      }}
                    >
                      {option.value ? option.label : <em>None</em>}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
      </FormControl>
    </>
  )
}

export default SelectPopper
