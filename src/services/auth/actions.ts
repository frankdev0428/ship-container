import { createActionCreator } from 'deox'

import { ThunkResult } from '../../frameworks/types'
import Config from '../../config.json'

import { keycloak, initOptions, KEYCLOAK_UPDATE_TOKEN_DELAY, KEYCLOAK_REFRESH_DELAY, retrieveToken } from './keycloak'
import { UserData } from './types'

export const logout = Object.assign(
  (): ThunkResult<void> => {
    return async (dispatch) => {
      dispatch(logout.next())

      await keycloak
        .logout()
        .then(() => dispatch(logout.complete()))
        .catch(error => { console.log(error); throw error })
        .catch(error => dispatch(logout.error(error)))
    }
  },
  {
    next: createActionCreator('LOGOUT_REQUEST'),
    complete: createActionCreator('LOGOUT_SUCCESS',
      resolve => () => {
        localStorage.removeItem('access-token')
        localStorage.removeItem('refresh-token')
        return resolve()
      },
    ),
    error: createActionCreator('LOGOUT_ERROR',
      resolve => error => resolve(error),
    ),
  })

export const login = Object.assign(
  (): ThunkResult<Promise<void | { type: 'LOGIN_SUCCESS'; payload: UserData }>> => {
    return async (dispatch) => {
      dispatch(login.next())

      await keycloak.init(initOptions)
        .then(async auth => {
          if (!auth) {
            if (Config.FF_ENABLE_AUTH === 'true') {
              window.location.reload()
            } else {
              return 0
            }
          } else {
            console.info('Authenticated')
          }

          await retrieveToken(keycloak)
          localStorage.setItem('refresh-token', keycloak.refreshToken || 'ERR')

          setTimeout(() => {
            keycloak.updateToken(KEYCLOAK_UPDATE_TOKEN_DELAY)
              .then(refreshed => {
                if (refreshed) {
                  console.debug('Token refreshed')
                  localStorage.setItem('access-token', keycloak.token || 'ERR')
                } else {
                  console.warn('Token not refreshed')
                }
              })
              .catch(() => {
                console.error('Failed to refresh token')
              })
          }, KEYCLOAK_REFRESH_DELAY * 1000)

          return keycloak.loadUserInfo()
        })
        .then((userProfile: any) => {
          console.log(userProfile)
          const user: UserData = {
            userName: userProfile.preferred_username,
            firstName: userProfile.given_name,
            lastName: userProfile.family_name,
            email: userProfile.email,
            groups: userProfile.groups,
          }
          dispatch(login.complete(user))
        })
        .catch((error) => {
          console.error('Authenticated Failed')
          dispatch(login.error(error))
        })
    }
  },
  {
    next: createActionCreator('LOGIN_REQUEST'),
    complete: createActionCreator('LOGIN_SUCCESS',
      resolve => (user: UserData) => resolve(user),
    ),
    error: createActionCreator('LOGIN_ERROR',
      resolve => error => resolve(error),
    ),
  })
