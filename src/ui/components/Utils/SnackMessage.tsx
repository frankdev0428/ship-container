import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSnackbar } from 'notistack'

import { AppState } from '../../../store'
import { clearSnackbar } from '../../../store/error/actions'

const SnackMessage = () => {
  const _dispatch = useDispatch()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const { errorMessages, severity } = useSelector((state: AppState) => state.errors)

  const handleClose = () => _dispatch(clearSnackbar())

  useEffect(() => {
    const key = errorMessages && enqueueSnackbar(errorMessages.join(', '), {
      variant: severity, // 'error' | 'warning' | 'success'
      onClick: () => {
        closeSnackbar(key)
      },
    })
  }, [errorMessages])

  return (<React.Fragment></React.Fragment>
  // <Snackbar
  //   open={errorMessages?.length > 0}
  //   anchorOrigin={{
  //     vertical: 'bottom',
  //     horizontal: 'right',
  //   }}
  //   autoHideDuration={5000}
  //   onClose={handleClose}
  // >
  //   <MuiAlert
  //     elevation={6}
  //     variant="filled"
  //     onClose={handleClose}
  //     severity={severity || 'error'}
  //     sx={{ minWidth: '260px' }}
  //   >
  //     {errorMessages && errorMessages.map((err, index) => <Box key={index}>{err}</Box>)}
  //   </MuiAlert>
  // </Snackbar>
  )
}

export default SnackMessage
