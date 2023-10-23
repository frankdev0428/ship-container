import {
// FakeCustomer as FakeCustomerAPI,
} from '../../apis-client'
// import { ExtendedOrder } from '../order/types'

export type FakeCustomer = string; // FakeCustomerAPI

export interface AutocompleteReducerState {
  customers: FakeCustomer[];
  contractStatus: any;
  orderStatus: any;
  depots: string[];
  loading: boolean;
}
