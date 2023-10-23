import * as React from 'react'
import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Link } from 'react-router-dom'

import Typography from '../Utils/Typography'

const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  marginTop: '0',
  margin: `0 ${theme.spacing()}`,
  fontWeight: 'bold',
  zIndex: 2,
}))

const StyledUnderline = styled('span')(({ theme }) => ({
  position: 'absolute',
  width: `calc(100% - ${theme.spacing(2)})`,
  bottom: '12px',
  height: '8px',
  backgroundColor: '#57E2E5',
  zIndex: -1,
}))

export interface HeaderItemProps {
  to: string;
  primary: string;
  secondary?: string;
  disabled?: boolean;
  selected?: boolean;
}

const HeaderItem: React.FunctionComponent<HeaderItemProps> = (props: HeaderItemProps) => {
  const { to, primary, disabled, selected } = props

  return (
    <Box
      position='relative'
      sx={[
        (theme) => ({
          // height: '100%',
          alignItems: 'flex-end',
          minWidth: '100px',
          textTransform: 'capitalize',
          padding: theme.spacing(1),
          // paddingBottom: theme.spacing(3),
        }),
        (theme) => ({
          ...(disabled
            ? {
                color: theme.palette.disabled?.main,
                paddingLeft: theme.spacing(2),
                paddingRight: theme.spacing(2),
              }
            : {}),
        }),
      ]}
    >
      <StyledBox>
          <Typography
            variant='h6'
            color='textPrimary'
            bold={selected}
            disabled={disabled}
            component={disabled ? undefined : Link}
            to={to}
            sx={{ textDecoration: 'none' }}
          >
            {primary}
          </Typography>
      </StyledBox>
      {selected && <StyledUnderline />}
    </Box>
  )
}

export default HeaderItem
