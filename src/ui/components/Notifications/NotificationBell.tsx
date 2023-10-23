import React, { useEffect } from 'react'
import { IconButton, Badge } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import NotificationsIcon from '@mui/icons-material/Notifications'

import { listAlerts } from '../../../services/alerts/actions'
import { AppState } from '../../../store'

const NotificationsBell = () => {
  const alerts = useSelector((state: AppState) => state.alerts.alerts)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(listAlerts())
  }, [])

  const unreadCount = alerts.filter(a => !a.readAt).length

  return (
    <Badge showZero badgeContent={unreadCount} overlap='circular' color="primary">
      <IconButton component={Link} to={'notifications'} color='primary'>
        <NotificationsIcon/>
      </IconButton>
    </Badge>
  )
}

export default NotificationsBell
