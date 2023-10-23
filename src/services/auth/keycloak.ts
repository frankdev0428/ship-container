import Keycloak, { KeycloakInitOptions } from 'keycloak-js'
import KeycloakAuthorization from 'keycloak-js/dist/keycloak-authz'

import { Configuration } from '../../apis-client'
import { Configuration as Configuration2 } from '../../apis-client/svc-boards-aeler'
import { Configuration as Configuration3 } from '../../apis-client/svc-boards-nexxiot'
import { Configuration as ConfigurationKizy } from '../../apis-client/svc-boards-kizy'
import { Configuration as ConfigurationMost } from '../../apis-client/svc-boards-most'
import { Configuration as ConfigurationNotifs } from '../../apis-client/svc-notifs'
import Config from '../../config.json'

export const keycloak = Keycloak({
  realm: Config.AELER_AUTH_REALM || '',
  url: Config.AELER_AUTH_URL || '',
  clientId: Config.AELER_AUTH_CLIENTID || '',
})

export const initOptions: KeycloakInitOptions = {
  ...Config.FF_ENABLE_AUTH && { onLoad: 'login-required' },
  ...window.location.hostname === 'localhost' && { checkLoginIframe: false }, // to prevent infinite loop in recent Firefox versions
}

export const KEYCLOAK_REFRESH_DELAY = 60 // s
export const KEYCLOAK_UPDATE_TOKEN_DELAY = KEYCLOAK_REFRESH_DELAY + 1 // s

export const getConfiguration = (): Configuration => {
  const token = localStorage.getItem('access-token') || ''
  return new Configuration({ basePath: Config.AELER_API_URL, apiKey: `Bearer ${token}` })
}

export const getConfiguration2 = (): Configuration => {
  const token = localStorage.getItem('access-token') || ''
  return new Configuration({ basePath: Config.CUSTOMERS_API_URL, apiKey: `Bearer ${token}` })
}

export const getConfiguration3 = (): Configuration => {
  const token = localStorage.getItem('access-token') || ''
  return new Configuration({ basePath: Config.PLACES_API_URL, apiKey: `Bearer ${token}` })
}

export const getConfiguration4 = (): Configuration2 => {
  const token = localStorage.getItem('access-token') || ''
  return new Configuration2({ basePath: Config.AELER_BOARDS_API_URL, apiKey: `Bearer ${token}` })
}

export const getConfiguration5 = (): Configuration3 => {
  const token = localStorage.getItem('access-token') || ''
  return new Configuration3({ basePath: Config.NEXXIOT_BOARDS_API_URL, apiKey: `Bearer ${token}` })
}

export const getConfigurationKizy = (): ConfigurationKizy => {
  const token = localStorage.getItem('access-token') || ''
  return new ConfigurationKizy({ basePath: Config.KIZY_BOARDS_API_URL, apiKey: `Bearer ${token}` })
}

export const getConfigurationMost = (): ConfigurationMost => {
  const token = localStorage.getItem('access-token') || ''
  return new ConfigurationMost({ basePath: Config.MOST_BOARDS_API_URL, apiKey: `Bearer ${token}` })
}

export const getConfigurationNotifs = (): ConfigurationNotifs => {
  const token = localStorage.getItem('access-token') || ''
  return new ConfigurationNotifs({ basePath: Config.NOTIFS_API_URL, apiKey: `Bearer ${token}` })
}

// export const getConfiguration5 = (): Configuration => {
//   const token = localStorage.getItem('access-token') || ''
//   return new Configuration({ basePath: Config.PLACES_API_URL, apiKey: `Bearer ${token}` })
// }

/**
 * Token expired callback
 * Try to refresh access token, and use it to get a new rpt
 */
keycloak.onTokenExpired = () => {
  keycloak.updateToken(KEYCLOAK_UPDATE_TOKEN_DELAY)
    .then(async refreshed => {
      if (refreshed) {
        console.debug('Token refreshed')

        await retrieveToken(keycloak)
      } else {
        console.warn('Token not refreshed')
      }
    })
    .catch(error => {
      console.error('Failed to refresh token', error)
    })
}

export const retrieveToken = async (keycloak: Keycloak.KeycloakInstance): Promise<void> => {
  localStorage.setItem('access-token', keycloak.token || 'ERR')
}
