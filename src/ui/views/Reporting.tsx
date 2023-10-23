import { Box, styled, useTheme } from '@mui/material'
import { differenceInDays, eachDayOfInterval, format, formatDistance, isAfter } from 'date-fns'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { listCompanies } from '../../services/customer/actions'
import {
  listContainersAvPctIdle,
  listContainersAvPctMnr,
  listContainersAvPctUsage,
  listKpiAllocatedDays,
  listKpiContainersTotalStatCounts,
  listKpiContainersStatusCounts,
  listKpiIdleCost,
  listKpiOrderEnds,
  listKpiOrderEndsBins,
  listKpiOrderEndstimeseries,
  listKpiOrderStarts,
  listKpiOrderStartsBins,
  listKpiOrderStartsTimeseries,
  listKpiOrderStatusCounts,
  listKpiOrderTotal,
  listKpiContainersAvailStatCounts,
  listKpiIdleDays,
  listKpiOrdersAcceptedNotReady,
  listKpiOrderByCustomer,
  listKpiOngoingOrders,
  listKpiAcceptedAndReady,
} from '../../services/reporting/actions'
import { AppState } from '../../store'
import BarChartWidget from '../components/Reporting/Containers/BarChart'
import Breakdown from '../components/Reporting/Containers/Breakdown'
import ReportsList from '../components/Reporting/Containers/ReportsList'
import OrdersByCustomerTable from '../components/Reporting/Orders/OrdersByCustomerTable'
import { FilterValueWithLabel } from '../components/shared/Filter/FilterButton'
import { LabeledDatePicker } from '../components/shared/LabeledDatePicker'
import Typography from '../components/Utils/Typography'

const StyledViewWrapper = styled('section')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  width: '100%',
  height: '100%',
  overflow: 'auto',
})

const OrdersMainSection = styled('section')({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  width: '100%',
  gap: 25,
})

const ContainersMainSection = styled('section')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  width: '100%',
  paddingBottom: 10,
})

const OrdersBarCharts = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  gap: 25,
})

const ColumnBoxWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: 25,
  justifyContent: 'flex-start',
})

const RowBoxWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing(3),
}))

const StyledReportRow = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  width: '100%',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
}))

const DateBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'flex-end',
  width: '100%',
  gap: theme.spacing(1),
  padding: theme.spacing(1),
}))

export const reportingOptions: Record<'reportingDates', FilterValueWithLabel> = {
  reportingDates: { value: null, type: 'date', label: 'Reporting dates', chipLabelName: 'Reporting dates' },
}

export const compareDates = (objStartDate: string, objEndDate: string, inputStartDate: Date, inputEndDate: Date): boolean => {
  const inputStartDateFormatedString = format(inputStartDate, 'dd-MM-yyyy')
  const inputEndDateFormatedString = format(inputEndDate, 'dd-MM-yyyy')
  const objStartDateFormatedString = format(new Date(objStartDate), 'dd-MM-yyyy')
  const objEndDateFormatedString = format(new Date(objEndDate), 'dd-MM-yyyy')

  return inputStartDateFormatedString === objStartDateFormatedString && inputEndDateFormatedString === objEndDateFormatedString
}

const Reporting: React.FunctionComponent<void> = () => {
  const containerStatusCounts = useSelector((state: AppState) => state.reporting.containersStatusCounts)
  const containerTotalStatusCounts = useSelector((state: AppState) => state.reporting.containersTotalStatusCounts)
  const containerAvailStatusCounts = useSelector((state: AppState) => state.reporting.containersAvailStatusCounts)
  const containersAllocDays = useSelector((state: AppState) => state.reporting.containersAllocDays)
  const containersIdleDays = useSelector((state: AppState) => state.reporting.containersIdleDays)
  const containersAvPctMnr = useSelector((state: AppState) => state.reporting.containersAvPctMnr)
  const containersIdleAvPct = useSelector((state: AppState) => state.reporting.containersIdleAvPct)
  const containersIdleCost = useSelector((state: AppState) => state.reporting.containersIdleCost)
  const containersUsageAvPct = useSelector((state: AppState) => state.reporting.containersUsageAvPct)

  const ordersStatusCounts = useSelector((state: AppState) => state.reporting.ordersStatusCounts)
  const orderEnds = useSelector((state: AppState) => state.reporting.orderEnds)
  const orderEndsBins = useSelector((state: AppState) => state.reporting.orderEndsBins)
  const orderEndsTimeseries = useSelector((state: AppState) => state.reporting.orderEndsTimeseries)
  const orderStarts = useSelector((state: AppState) => state.reporting.orderStarts)
  const orderStartsBins = useSelector((state: AppState) => state.reporting.orderStartsBins)
  const orderStartsTimeseries = useSelector((state: AppState) => state.reporting.orderStartsTimeseries)
  const ordersTotalBins = useSelector((state: AppState) => state.reporting.ordersTotalBins)
  const ordersOngoing = useSelector((state: AppState) => state.reporting.ordersOngoing)
  const ordersAcceptedAndReady = useSelector((state: AppState) => state.reporting.ordersAcceptedAndReady)
  const ordersByCustomers = useSelector((state: AppState) => state.reporting.ordersByCustomers)
  const ordersAcceptedNotReady = useSelector((state: AppState) => state.reporting.ordersAcceptedNotReady)

  const d = new Date()
  d.setDate(d.getDate() - 30)
  const [startDate, setStartDate] = useState<Date | null>(d)
  const [endDate, setEndDate] = useState<Date | null>(new Date())

  const dispatch = useDispatch()
  const theme = useTheme()

  useEffect(() => {
    if (startDate && endDate) {
      dispatch(listKpiContainersStatusCounts({ startDate, endDate }))
      dispatch(listKpiContainersTotalStatCounts({ startDate, endDate }))
      dispatch(listKpiContainersAvailStatCounts({ startDate, endDate }))
      dispatch(listKpiAllocatedDays({ startDate, endDate }))
      dispatch(listKpiIdleDays({ startDate, endDate }))

      // dispatch(listContainersAvPctMnr({ startDate: startDate.toString(), endDate: endDate.toString(), activeOnly: '' }))
      // dispatch(listContainersAvPctIdle({ startDate: startDate.toString(), endDate: endDate.toString(), activeOnly: '' }))
      // dispatch(listKpiIdleCost({ startDate: startDate.toString(), endDate: endDate.toString() }))
      dispatch(listContainersAvPctUsage({ startDate, endDate, activeOnly: '' }))

      dispatch(listKpiOrderStatusCounts({ startDate, endDate }))
      // dispatch(listKpiOrderStatusCounts({ startDate: startDate.toString(), endDate: endDate.toString() }))
      // dispatch(listKpiOrderEnds({ startDate: startDate.toString(), endDate: endDate.toString() }))
      dispatch(listKpiOrderEndsBins({ startDate, endDate }))
      // dispatch(listKpiOrderEndstimeseries({ startDate: startDate.toString(), endDate: endDate.toString() }))
      // dispatch(listKpiOrderStarts({ startDate: startDate.toString(), endDate: endDate.toString() }))
      dispatch(listKpiOrderStartsBins({ startDate: startDate, endDate: endDate }))
      // dispatch(listKpiOrderStartsTimeseries({ startDate: startDate.toString(), endDate: endDate.toString() }))
      dispatch(listKpiOrderTotal({ startDate: startDate, endDate: endDate }))
      dispatch(listKpiOngoingOrders({ startDate, endDate }))
      dispatch(listKpiAcceptedAndReady({ startDate, endDate }))
      dispatch(listKpiOrderByCustomer({ startDate: startDate, endDate: endDate }))
      dispatch(listKpiOrdersAcceptedNotReady({ startDate: startDate, endDate: endDate }))
    }
  }, [startDate, endDate])

  useEffect(() => {
    dispatch(listCompanies({}))
  }, [])

  // const reportListOrders = ordersStatusCounts.filter((o) => startDate && endDate && compareDates(o.startDate, o.endDate, startDate, endDate))
  // const reportListContainers = containerStatusCounts.filter((c) => startDate && endDate && compareDates(c.startDate, c.endDate, startDate, endDate))
  // const containerBreakdownTotal = containerStatusCounts.length && Object.values(containerStatusCounts[0].statusCounts).reduce((a, b) => a + b, 0)
  // const containerBreakdownAvail = containerBreakdownTotal && containerBreakdownTotal - (containerStatusCounts[0].statusCounts.BLOCKED + containerStatusCounts[0].statusCounts.ALLOCATED)

  const dateInterval = startDate && endDate && isAfter(endDate, startDate)
    ? differenceInDays(endDate, startDate)
    : undefined

  const ordersStatus = {
    ...ordersStatusCounts,
    ...(ordersOngoing && { ONGOING: ordersOngoing?.totalOrders }),
    ...(ordersAcceptedAndReady && { READY: ordersAcceptedAndReady?.totalOrders }),
  }

  return (
    <StyledViewWrapper>
      <DateBox>
        <LabeledDatePicker
          label="Start date"
          value={startDate}
          onChange={setStartDate}
          textFieldProps={{ size: 'small' }}
          maxDate={endDate || undefined}
        />
        <LabeledDatePicker
          label="End date"
          value={endDate}
          onChange={setEndDate}
          minDate={startDate || undefined}
          textFieldProps={{ size: 'small' }}
        />
      </DateBox>
      <Box mt={2} mb={2}>
        <Typography bold variant='h6' sx={{ color: theme.palette.primary.highlight }}>ORDERS</Typography>
      </Box>
      <OrdersMainSection>
        <ColumnBoxWrapper>
          <OrdersBarCharts>
            <BarChartWidget
              data={ordersTotalBins.map(e => ({ value: e[1] as number, timestamp: e[0] ? new Date(e[0]) : undefined }))}
              barDataKey={'value'}
              legendLabel={'Total orders'}
              dateInterval={dateInterval === 0 ? 1 : dateInterval} />
            <BarChartWidget
              data={orderStartsBins.map(e => ({ value: +e[1], timestamp: e[0] ? new Date(e[0]) : undefined }))}
              barDataKey={'value'}
              legendLabel={'Starting'}
              dateInterval={dateInterval === 0 ? 1 : dateInterval} />
          </OrdersBarCharts>
          <OrdersBarCharts>
            <BarChartWidget data={[{ value: 0 }]} barDataKey={'value'} legendLabel={'Accepted (not ready)'} />
            <BarChartWidget
              data={ordersAcceptedNotReady.map(e => ({ value: +e[1], timestamp: e[0] ? new Date(e[0]) : undefined }))}
              barDataKey={'value'}
              legendLabel={'Accepted (not ready)'}
              dateInterval={dateInterval === 0 ? 1 : dateInterval} />
            <BarChartWidget
              data={orderEndsBins.map((e) => ({ value: +e[1], timestamp: e[0] ? new Date(e[0]) : undefined }))}
              barDataKey={'value'}
              dateInterval={dateInterval === 0 ? 1 : dateInterval}
              legendLabel={'Ending'} />
          </OrdersBarCharts>
        </ColumnBoxWrapper>
        <ReportsList section='orders' ordersStatus={ordersStatus}/>
        <OrdersByCustomerTable data={ordersByCustomers}/>
      </OrdersMainSection>
      <ContainersMainSection>
        <Box mt={2} mb={2}>
          <Typography bold variant='h6' sx={{ color: theme.palette.primary.highlight }}>CONTAINERS</Typography>
        </Box>
        <StyledReportRow>
          <ReportsList
            section='containers'
            total={containerTotalStatusCounts[0]?.totalAv}
            containerAvailable={containerAvailStatusCounts}
            containersStatus={containerStatusCounts[0]}
          />
            <ColumnBoxWrapper>
              {/* <Breakdown
                numAllocated={reportListContainers[0]?.statusCounts.ALLOCATED}
                numAvailable={containerBreakdownAvail}
                numBlocked={reportListContainers[0]?.statusCounts.BLOCKED}
                total={containerBreakdownTotal}
              /> */}
              <RowBoxWrapper>
                <BarChartWidget
                  data={containersIdleDays.map(e => ({ value: +e[1], timestamp: e[0] ? new Date(e[0]) : undefined }))}
                  barDataKey={'value'}
                  legendLabel={'Idle time'}
                  dateInterval={dateInterval === 0 ? 1 : dateInterval}
                  unit={'d'} />
                {/* <BarChartWidget data={[{ value: 0 }]} barDataKey={'pctIdle'} legendLabel={'Idle cost'} /> */}
              </RowBoxWrapper>
            </ColumnBoxWrapper>
            <ColumnBoxWrapper>
              <BarChartWidget
                barDataKey={'value'}
                legendLabel={'AVG per container'}
                unit={'d'}
                data={containersUsageAvPct.map((e) => ({ value: +e[1], timestamp: e[0] ? new Date(e[0]) : undefined }))}
                dateInterval={dateInterval === 0 ? 1 : dateInterval}
              />
              <BarChartWidget
                data={containersAllocDays.map(e => ({ value: +e[1], timestamp: e[0] ? new Date(e[0]) : undefined }))}
                barDataKey={'value'}
                legendLabel={'Usage time'}
                unit={'d'}
                dateInterval={dateInterval === 0 ? 1 : dateInterval}
              />
            </ColumnBoxWrapper>
        </StyledReportRow>
      </ContainersMainSection>
    </StyledViewWrapper>
  )
}

export default Reporting
