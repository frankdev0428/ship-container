import React from 'react'
import { Box, IconButton, InputAdornment, TextField, StandardTextFieldProps, useTheme } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import SearchIcon from '@mui/icons-material/Search'

interface SearchbarProps extends StandardTextFieldProps {
    filter: string;
    setFilter: (text: string) => void;
    clearAll: () => void;
}

const Searchbar = ({ filter, setFilter, clearAll, ...restProps }: SearchbarProps): JSX.Element => {
  const theme = useTheme()

  return (
    <TextField
      // disabled
      variant='outlined'
      size='small'
      margin='none'
      placeholder={restProps.placeholder}
      value={filter}
      onChange={(e) => setFilter(e.target.value)}
      InputProps={{
        style: {
          fontSize: theme.typography.body1.fontSize,
          color: theme.palette.text.primary,
          fontFamily: theme.typography.body1.fontFamily,
        },
        startAdornment: <InputAdornment position='start'>
          <SearchIcon />
          {/* <img alt={''} src={SearchIcon} /> */}
        </InputAdornment>,
        endAdornment: <InputAdornment position='end'>
          {
            filter.length
              ? <IconButton
                size='small'
                color='primary'
                onClick={() => setFilter('')}
              >
                <ClearIcon />
              </IconButton>
              : <Box width={30}/>
          }
        </InputAdornment>,
      }}
      {...restProps}
    />
  )
}

export default Searchbar
