import { combineReducers, applyMiddleware, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'

import { equipmentReducers } from '../services/equipment/reducers'
import { EquipmentReducerState } from '../services/equipment/types'
// import { shipmentReducers } from '../services/shipment/reducers'
// import { ShipmentReducerState } from '../services/shipment/types'
import { authReducers } from '../services/auth/reducers'
import { AuthReducerState } from '../services/auth/types'
import { autocompleteReducer } from '../services/autocomplete/reducers'
import { AutocompleteReducerState } from '../services/autocomplete/types'
import { leaseReducers } from '../services/lease/reducers'
import { LeaseReducerState } from '../services/lease/types'
import { companyReducers } from '../services/customer/reducers'
import { CompanyReducerState } from '../services/customer/types'
import { PlacesReducerState } from '../services/places/types'
import { placesReducers } from '../services/places/reducers'
import { MoveReducerState } from '../services/move/types'
import { moveReducers } from '../services/move/reducers'
import { FinancialsReducerState } from '../services/financials/types'
import { financialsReducers } from '../services/financials/reducers'
import { BoardsReducerState } from '../services/boards/types'
import { boardsReducers } from '../services/boards/reducers'
import { ReportingReducerState } from '../services/reporting/types'
import { reportingReducers } from '../services/reporting/reducers'
import { alertsReducers } from '../services/alerts/reducers'
import { AlertsReducerState } from '../services/alerts/types'
import { settingsReducers } from '../services/settings/reducers'
import { SettingsReducerState } from '../services/settings/types'

import errorReducer from './error/reducers'
import uiReducer from './ui/reducers'
import { ErrorsReducerState } from './error/types'
import { UIReducerState } from './ui/types'
import { logger } from './logger'

const rootReducer = combineReducers({
  equipment: equipmentReducers,
  lease: leaseReducers,
  company: companyReducers,
  user: authReducers,
  autocomplete: autocompleteReducer,
  places: placesReducers,
  moves: moveReducers,
  errors: errorReducer,
  ui: uiReducer,
  financials: financialsReducers,
  boards: boardsReducers,
  reporting: reportingReducers,
  alerts: alertsReducers,
  settings: settingsReducers,
})

export type AppState = {
  equipment: EquipmentReducerState;
  lease: LeaseReducerState;
  company: CompanyReducerState;
  user: AuthReducerState;
  autocomplete: AutocompleteReducerState,
  places: PlacesReducerState;
  moves: MoveReducerState;
  errors: ErrorsReducerState;
  ui: UIReducerState;
  financials: FinancialsReducerState;
  boards: BoardsReducerState;
  reporting: ReportingReducerState
  alerts: AlertsReducerState;
  settings: SettingsReducerState;
}

export function configureStore() {
  const middlewares = process.env.NODE_ENV === 'development' ? [thunkMiddleware, logger] : [thunkMiddleware]

  const middleWareEnhancer = applyMiddleware(...middlewares)

  const store = createStore(
    rootReducer,
    middleWareEnhancer,
  )

  return store
}
