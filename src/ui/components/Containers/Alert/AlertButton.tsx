import React, { Fragment, useState } from 'react'
import { Button } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'

import { Alert } from '../../../../services/alerts/types'
import Typography from '../../Utils/Typography'

import AlertDialog from './AlertDialog'

interface AlertButtonProps {
  alerts: Alert[]

  disabled?: boolean;

  onDismiss: (alerts: Alert[]) => void
}

const AlertButton = ({ alerts, disabled, onDismiss }: AlertButtonProps) => {
  const [open, setOpen] = useState(false)
  const theme = useTheme()

  const handleOpen = (event: any) => {
    event.stopPropagation()
    event.preventDefault()
    setOpen(true)
  }

  const handleDismiss = (alerts: Alert[]) => {
    onDismiss(alerts)
  }

  return (
    <Fragment>
      {/* <Box display='flex' alignItems='center'>
        <Box pl={'2px'} display='flex' alignItems='center' sx={{ border: `1px solid ${theme.palette.error.dark}`, borderRadius: '4px', backgroundColor: theme.palette.error.dark }}>
          <Typography variant='overline' sx={{ color: theme.palette.getContrastText(theme.palette.error.dark) }}>
            {alert.message}
          </Typography>
          <Box pl={2}>
            <IconButton size='small' onClick={(event: any) => {
              event.preventDefault()
              event.stopPropagation()
            }}><CloseIcon sx={{ color: theme.palette.getContrastText(theme.palette.error.dark) }}/></IconButton>
          </Box>
        </Box>
      </Box> */}

      <Button
        variant='outlined'
        size='small'
        color='primary'
        sx={{ maxWidth: '140px', textTransform: 'none', color: 'white', backgroundColor: 'red', border: '1px solid red' }}
        onClick={handleOpen}
        endIcon={<CloseIcon sx={{ color: theme.palette.getContrastText(theme.palette.error.dark) }}/>}
      >
        <Typography variant='caption' sx={{ color: theme.palette.getContrastText(theme.palette.error.dark) }}>
            {alerts[0].message}
        </Typography>
      </Button>
      { open && <AlertDialog alerts={alerts} handleClose={() => setOpen(false)} handleDismiss={handleDismiss} />}
    </Fragment>
  )
}

export default AlertButton
