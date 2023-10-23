import React, { Fragment } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Divider,
} from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'

import Typography from '../../Utils/Typography'
import { Alert } from '../../../../services/alerts/types'
import { getTimeLabel } from '../../shared/utils'

interface AlertDialogProps {
  alerts: Alert[];

  handleClose: () => void;
  handleDismiss: (alerts: Alert[]) => void;
}

const AlertDialog = ({ alerts, handleClose, handleDismiss }: AlertDialogProps): any => {
  return (
    <Dialog open={true} maxWidth={'sm'} fullWidth onClose={handleClose} onClick={event => { event.stopPropagation(); event.preventDefault() }} >
      <DialogTitle>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography variant={'h6'}>{`Alert | Container ${alerts[0].entityId}`}</Typography>
          {/* { loadingDepots && <CircularProgress sx={{ marginLeft: '16px' }} size={20} /> } */}
          <Box justifyContent={'flex-end'}>
            <IconButton size='small' onClick={handleClose}><ClearIcon/></IconButton>
          </Box>
        </Box>
        </DialogTitle>
        <DialogContent>
          { alerts.map((alert, index) => (
            <Box key={index}>
              <Box display='flex' mt={1} mb={1}>
                <Box flexGrow={1}>
                  <Typography >Alert Message</Typography>
                  <Typography paragraph variant='subtitle1' >{alert.message}</Typography>
                  <Typography>Expires At</Typography>
                  <Typography paragraph variant='subtitle1' >{getTimeLabel(alert.expiresAt, 'dateHourFormat')}</Typography>
                  <Typography>Priority</Typography>
                  <Typography paragraph variant='subtitle1' >{alert.priority}</Typography>
                </Box>
                <Box display='flex' alignItems='flex-end'>
                  <Button color='primary' size='small' variant='contained' onClick={() => handleDismiss([alert])} >Dismiss</Button>
                </Box>
              </Box>
              <Divider/>
            </Box>),
          )}
        </DialogContent>
        <DialogActions>
          {/* <Button color='primary' onClick={handleClose}>Close</Button> */}
          <Button color='primary' variant='contained' onClick={() => handleDismiss(alerts)} >Dismiss All</Button>
        </DialogActions>
    </Dialog>
  )
}

export default AlertDialog
