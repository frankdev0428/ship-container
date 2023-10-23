import React, { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import {
  Box,
  CssBaseline,
  LinearProgress,
} from '@mui/material'
// import { ThemeProvider as Emotion10ThemeProvider } from 'emotion-theming'
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import { QueryParamProvider } from 'use-query-params'
import { SnackbarProvider } from 'notistack'
import { LicenseInfo } from '@mui/x-license-pro'

import usePageTracking from '../utils/usePageTracking'
import { ga } from '../ga'
import { login } from '../services/auth/actions'
import { AppState } from '../store'
import Config from '../config.json'
import { setDatagridState } from '../store/ui/actions'

import Header from './components/Header/Header'
import theme from './styles/coriolis-theme'
import SnackMessage from './components/Utils/SnackMessage'

Config.MUI_LICENSE_KEY !== undefined && typeof Config.MUI_LICENSE_KEY === 'string' &&
  LicenseInfo.setLicenseKey(Config.MUI_LICENSE_KEY)

const Cargo = lazy(() => import('./views/Cargo'))
const Containers = lazy(() => import('./views/Containers'))
const Dashboard = lazy(() => import('./views/Dashboard'))
const Orders = lazy(() => import('./views/Orders'))
const Shipments = lazy(() => import('./views/Shipments'))
const Reports = lazy(() => import('./views/Reports'))
const Users = lazy(() => import('./views/Users'))
const Depots = lazy(() => import('./views/Depots'))
const Boards = lazy(() => import('./views/Boards'))
const Reporting = lazy(() => import('./views/Reporting'))
const Notifications = lazy(() => import('./views/Notifications'))

const Main = () => {
  usePageTracking(ga)()

  return (
    <Box id='flocktilla-main' display='flex' flexDirection='column' overflow='hidden' height='100vh'>
      <Header />
      <Box id='flocktilla-main' display='flex' justifyContent="center" height={'100%'} overflow='hidden' p={2} pt={0}>
        <Suspense fallback={<LinearProgress />}>
          <Switch>
            {/* <Route exact path="/" component={Dashboard}></Route> */}
            <Route path="/cargo" component={Cargo}></Route>
            <Route path="/containers" component={Containers}></Route>
            <Route path="/orders" component={Orders}></Route>
            <Route path="/shipments" component={Shipments}></Route>
            <Route path="/companies" component={Users}></Route>
            <Route path="/facilities" component={Depots}></Route>
            <Route path="/boards" component={Boards}></Route>
            <Route path="/reporting" component={Reporting}></Route>
            <Route path="/reports" component={Reports}></Route>
            <Route path="/notifications" component={Notifications}></Route>
            <Redirect to={'/containers'} />
          </Switch>
        </Suspense>
      </Box>
    </Box>
  )
}

const App = () => {
  // process.env.NODE_ENV !== 'development' && initAuth() // change this if developing with access to auth server
  const _dispatch = useDispatch()

  const user = useSelector((state: AppState) => state.user.user)
  const datagridState = localStorage.getItem('datagridState')

  useEffect(() => {
    _dispatch(login())
    if (datagridState) {
      _dispatch(setDatagridState(JSON.parse(datagridState)))
    }
  }, [])

  /* Dispatcher for data should not be callend in App, it should be called as close as possible to the component that needs data */
  /* useEffect(() => {
    if (user.userName) {
      _dispatch(getShipmentsList())
    }
  }, [user]) */

  if (!user.authenticated) return <LinearProgress />

  // const generateClassName = createGenerateClassName({
  //   productionPrefix: 'flocktilla',
  //   seed: 'flocktilla',
  // })

  return (
    <SnackbarProvider
      maxSnack={5}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Suspense fallback={<LinearProgress />}>
        <BrowserRouter basename={'/ecosystem/fleet-management'}>
          <QueryParamProvider ReactRouterRoute={Route}>
            <StyledEngineProvider injectFirst>
              {/* <Emotion10ThemeProvider theme={theme}> */}
                <ThemeProvider theme={theme}>
                  <CssBaseline />
                  <Main />
                </ThemeProvider>
              {/* </Emotion10ThemeProvider> */}
            </StyledEngineProvider>
          </QueryParamProvider>
        </BrowserRouter>
        <SnackMessage />
      </Suspense>
    </SnackbarProvider>
  )
}

export default App
