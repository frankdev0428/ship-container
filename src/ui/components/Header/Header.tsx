import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import { AppBar, Toolbar, Box, Button, Switch, FormGroup, FormControlLabel } from '@mui/material'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import LogoutIcon from '../../components/icons/icons-28-settings-log-out.svg'
import { logout } from '../../../services/auth/actions'
import FMLogo from '../../components/assets/FLEETMANAGER.png'
import Config from '../../../config.json'
import NotificationsBell from '../Notifications/NotificationBell'
import { AppState } from '../../../store'
import { setShouldUseBackend } from '../../../services/settings/actions'

import HeaderItem from './HeaderItem'

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'white',
  color: theme.palette.text.primary,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}))

const StyledButton = styled(Button)({
  // color: theme.palette.primary.contrastText,
  textTransform: 'none',
  // fontSize: 13,
  // margin: theme.spacing(0, 2.5),
})

const Header = () => {
  const [selectedHeaderItem, setSelectedHeaderItem] = useState<string>('')
  const location = useLocation()

  const { shouldUseBackend } = useSelector((state: AppState) => state.settings)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setShouldUseBackend(event.target.checked))
  }

  const dispatch = useDispatch()
  const logoutUser = () => {
    dispatch(logout())
  }

  useEffect(() => {
    const root = location.pathname.split('/')[1]
    setSelectedHeaderItem(root)
  }, [location])

  const headerItems = [
    // { primary: 'Dashboard', target: '', disabled: true },
    { primary: 'Containers', target: 'containers', disabled: false },
    { primary: 'Orders', target: 'orders', disabled: false },
    { primary: 'Facilities', target: 'facilities', disabled: false },
    { primary: 'Companies', target: 'companies', disabled: false },
    { primary: 'Boards', target: 'boards', disabled: false },
    { primary: 'Reporting', target: 'reporting', disabled: !(Config.FF_ENABLE_KPIS_TAB !== undefined && Config.FF_ENABLE_KPIS_TAB === 'true') },
    { primary: 'Shipments', target: 'shipments', disabled: true },
    { primary: 'Finances', target: 'reports', disabled: false },
    // { primary: 'Cargo', target: 'cargo', disabled: true },
  ]

  return (
    <StyledAppBar
        // position="fixed"
        position="sticky"
        elevation={2}
      >
        <Toolbar>
          <Box height={64}>
            <img src={FMLogo} style={{ height: '100%' }}/>
            {/* <Typography color='textPrimary'>Flocktilla</Typography> */}
          </Box>
          <Box display='flex' flexGrow={1} >
          {
            headerItems.map((it: any, index: number) => {
              return (
                <HeaderItem
                  key={index}
                  to={it.target}
                  primary={it.primary}
                  selected={selectedHeaderItem === it.target}
                  disabled={it.disabled}
                />
              )
            })
          }
          </Box>
          {
            Config.FF_ENABLE_LOGOUT !== undefined && Config.FF_ENABLE_LOGOUT === 'true' &&
              <StyledButton variant='contained' color='primary' size='small' onClick={() => logoutUser()} startIcon={<img alt={'logout'} src={LogoutIcon} />}>
                Logout
              </StyledButton>
          }
          {
            <FormGroup>
              <FormControlLabel control={
                <Switch
                  checked={shouldUseBackend}
                  onChange={handleChange}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
                }
                label="Engine v2"
              />
            </FormGroup>
          }
          <NotificationsBell />
        </Toolbar>
      </StyledAppBar>
  )
}

export default Header
