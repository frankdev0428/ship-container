import { Box, Divider, styled, Tab, Tabs } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { listAlerts } from '../../services/alerts/actions'
import { AppState } from '../../store'
import NotificationsTable from '../components/Notifications/NotificationsTable'
import Typography from '../components/Utils/Typography'

const StyledNotificationsViewWrapper = styled('section')({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
})

const TypographyBox = styled(Box)({
  paddingTop: 30,
  paddingBottom: 30,
  paddingLeft: 20,
})

const StyledTabsBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingBottom: 20,
  paddingLeft: 20,
})

const StyledTab = styled(Tab)({
  '&.Mui-selected': {
    fontWeight: 'bolder !important',
    color: '#1674D0 !important',
  },
  '&.Mui-disabled': {
    color: '#C4C9D4 !important',
    fontWeight: 'normal !important',
  },
  fontWeight: 'normal !important',
  height: '36px',
  minHeight: '36px',
})

const StyledDivider = styled(Divider)({
  marginBottom: 20,
})

const NotificationsSection = styled(Box)({
  paddingLeft: 20,
  paddingRight: 20,
  paddingBottom: 20,
  height: '100%',
})

const Notifications: React.FunctionComponent<void> = () => {
  const alerts = useSelector((state: AppState) => state.alerts.alerts)

  const [tab, setTab] = useState<'all' | 'read' | 'unread' >('all')

  const handleChange = (event: React.SyntheticEvent<Element, Event>, newValue: 'all' | 'read' | 'unread') => {
    setTab(newValue)
  }

  // const _dispatch = useDispatch()

  // When the BE can filter by status, uncomment the following code and adapt
  // For now, the NotificationBell dispatched the call to get alerts
  // useEffect(() => {
  //   if (tab === 'all') {
  //     _dispatch(listAlerts())
  //   }
  //   if (tab === 'read') {
  //     _dispatch(listAlerts({ }))
  //   }
  //   if (tab === 'unread') {
  //     _dispatch(listAlerts({ includeResolved: 1 }))
  //   }
  // }, [])

  const filteredAlerts = alerts.filter(a => {
    switch (tab) {
      case 'read':
        return !!a.readAt
      case 'unread':
        return !a.readAt
      default:
        return true
    }
  })

  return (
    <StyledNotificationsViewWrapper>
      <TypographyBox>
        <Typography variant='h5'>Notifications</Typography>
      </TypographyBox>
       <StyledTabsBox>
          <Tabs
            value={tab}
            indicatorColor='primary'
            textColor='primary'
            onChange={handleChange}
            aria-label='alerts tabs'
            sx={{ height: '36px', minHeight: '36px' }}
          >
            <StyledTab value='all' label='ALL'/>
            <StyledTab value='read' label='READ' />
            <StyledTab value='unread' label='UNREAD' />
          </Tabs>
        </StyledTabsBox>
        <StyledDivider />
        <NotificationsSection>
          <NotificationsTable alerts={filteredAlerts}/>
        </NotificationsSection>
    </StyledNotificationsViewWrapper>

  )
}

export default Notifications
