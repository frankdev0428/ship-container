import ReactGA from 'react-ga4'

import Config from './config.json'

export const initGa = (): typeof ReactGA => {
  ReactGA.initialize(Config.AELER_REACT_GA_ID)
  return ReactGA
}

export const ga = initGa()
