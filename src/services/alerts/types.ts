import { PublicAlertState, PublicAlertStateEntityTypeEnum } from '../../apis-client'
import { VisibilityState } from '../../apis-client/svc-notifs'

export type Alert = {
  entityId: any;
  message: any;
  expiresAt: any;
  priority: any;
}

export type EntityTypeEnum = PublicAlertStateEntityTypeEnum
export type PublicAlert = PublicAlertState

export type PublicVisibilityState = VisibilityState

export interface AlertsReducerState {
  alerts: PublicAlert[]
  statuses: PublicVisibilityState[]
  loadingStatus: boolean
  loadingAlertStatus: boolean
}
