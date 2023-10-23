import {
  PublicCompany,
} from '../../apis-client/svc-customers'

export type Company = PublicCompany

export interface CompanyReducerState {
  companies: Company[];
  loadingStatus: boolean;
}
