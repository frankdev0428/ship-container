// import { Model20, Model23 } from '../../apis-client'
export type OrderStatus = any // FIXME
export type ContainerStatus = any // FIXME

export interface ReportingReducerState {
  // SINGLE CONTAINER
  containerPctIdle: {
    equipmentId: string,
    pctIdle: number,
    startDate: string,
    endDate: string,
  }[];
  containerPctUsage: {
    equipmentId: string,
    pctUtilization: number,
    startDate: string,
    endDate: string,
  }[];
  containerPctMnr: {
    equipmentId: string,
    pctMnr: number,
    startDate: string,
    endDate: string,
  }[];

  // CONTAINERS:
  containersStatusCounts: {
    statusCounts: any,
  }[];
  containersTotalStatusCounts: {
    totalAv: any,
  }[];
  containersAvailStatusCounts: string | undefined,
  containersIdleCost: {
    idleCost: string[][],
    startDate: string,
    endDate: string
  }[];
  containersAllocDays: string[][];
  containersIdleDays: string[][];
  containersUsageAvPct: string[][];
  containersIdleAvPct: {
    avPctIdle: number,
    startDate: string,
    endDate: string
  }[];
  containersAvPctMnr: {
    avPctMnr: number,
    startDate: string,
    endDate: string,
    activeOnly: string
  }[];
  // ORDERS
  ordersStatusCounts: {
    statusCounts: any,
  }[];
  orderStartsTimeseries: {
    orderStartsTimeseries: string[][],
    startDate: string,
    endDate: string
  }[];
  // orderStartsBins: {
  //   orderStartsBins: string[][],
  //   startDate: string,
  //   endDate: string
  // }[];
  orderStartsBins: string[][];
  orderStarts:{
    orderStarts: number,
    startDate: string,
    endDate: string
  }[],
  orderEndsTimeseries: {
    orderEndsTimeseries: string[][],
    startDate: string,
    endDate: string
  }[],
  orderEndsBins: string[][];
  orderEnds:{
    orderEnds: number,
    startDate: string,
    endDate: string
  }[],
  loadingStatus: boolean;
  ordersTotalBins: any[];
  ordersOngoing: any;
  ordersAcceptedAndReady: any;
  ordersByCustomers: {
    customerId: string;
    ordersTotal: string;
  }[]
  ordersAcceptedNotReady: string[][],
}
