import React from 'react'
import { Box, styled } from '@mui/material'
import WarningIcon from '@mui/icons-material/Warning'

import Typography from '../../Utils/Typography'

const StyledBox = styled(Box)({
  width: '100%',
  padding: '16px',
  background: '#FCDDD8',
  display: 'flex',
  flexDirection: 'row',
  gap: '10px',
})

interface FormWarningMessageProps {
  value: string;
}
const FormWarningMessage = ({ value }: FormWarningMessageProps): JSX.Element => {
  return (
    <StyledBox>
      <WarningIcon sx={{ color: '#9E0D0A' }}/>
      <Typography color='#9E0D0A' variant='body2'>
        {value}
      </Typography>
    </StyledBox>
  )
}

export default FormWarningMessage
