import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Button, Autocomplete, TextField, Typography, Tooltip, IconButton } from '@mui/material'
import { styled } from '@mui/material/styles'
import { DataGridPro, GridColDef, GridToolbar, useGridApiRef } from '@mui/x-data-grid-pro'
import ClearAllIcon from '@mui/icons-material/ClearAll'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider, DatePicker, DatePickerProps } from '@mui/x-date-pickers'
import { format } from 'date-fns'
import moment from 'moment'

import { AppState } from '../../../store'
import { listLeases } from '../../../services/lease/actions'
import { listCompanies } from '../../../services/customer/actions'
import { listFacilities } from '../../../services/places/actions'
// import { mapToOrderRow, OrderRowDataProps } from '../Orders/OrderRow'
import { LabeledDatePicker } from '../shared/LabeledDatePicker'
import { ContractStatusEnum, EquipmentLeaseContract, Lease, OrderStatusEnum } from '../../../services/lease/types'
import { Company } from '../../../services/customer/types'
import { Facility } from '../../../services/places/types'
import { Equipment } from '../../../services/equipment/types'
import { listEquipments } from '../../../services/equipment/actions'
import { setDatagridState } from '../../../store/ui/actions'

const commonProps = {
  variant: 'outlined' as any,
  margin: 'dense' as any,
  size: 'small' as any,
  style: { minWidth: 160 },
}

const dateFormatter = (params: any) => params?.value !== undefined ? format(params?.value, 'dd-MMM-yyyy') : undefined

const StyledDatePicker = (props: any) => <StyledDiv><LabeledDatePicker {...props} /></StyledDiv>

const MonthPicker = (props: DatePickerProps<Date, Date>) => (
  <Box width={140}>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker {...props} />
    </LocalizationProvider>
  </Box>
)

const StyledDiv = styled('div')({
  width: 200,
})

interface OrderRowDataProps {
  id: string;
  orderId: string;
  createdAt?: Date,
  executionDate?: Date;
  returnDate?: Date;
  origin?: string;
  destination?: string;
  orderStatus?: OrderStatusEnum;
  contractStatus?: ContractStatusEnum;
  customer?: string;
  allocatedContainers: number;
  units?: number;
  leaseContracts?: EquipmentLeaseContract[];
  customersBookingNumber?: string;
  containerNumber?: string;
  customerId: string;
}

interface ExtendedOrderRowDataProps extends OrderRowDataProps {
  leaseDays?: number;
}

export const mapToOrderRow = (order: Lease, customers: Company[], facilities: Facility[], equipments: Equipment[]): OrderRowDataProps[] => {
  const lcs = order.equipmentleasecontracts.filter(lc => lc.active)

  const ret = {
    orderId: order.orderId,
    createdAt: order.createdAt,
    // executionDate: order.executionDate, // ? `${moment(order.executionDate).format('DD-MM-YYYY')}` : undefined,
    // returnDate: order.returnDate, // ? `${moment(order.returnDate).format('DD-MM-YYYY')}` : undefined,
    // origin: facilities.find(c => c.facilityId === order.pickupLocation)?.name || order.pickupLocation,
    // destination: facilities.find(c => c.facilityId === order.dropoffLocation)?.name || order.dropoffLocation,
    units: order.units,
    contractStatus: order.equipmentleasestatuses.length > 0 ? order.equipmentleasestatuses[0].contractStatus : undefined,
    customer: customers.find(c => c.companyId === order.customerId)?.name || order.customerId,
    customerId: order.customerId,
    // allocatedContainers: order.equipmentleasecontracts.map(l => l.equipmentId),
    allocatedContainers: lcs.length,
    leaseContracts: lcs,
    customersBookingNumber: order.customersBookingNumber,
  }

  return lcs.map(lc => {
    const container = equipments.find(e => e.equipmentId === lc.equipmentId)
    if (container === undefined) return undefined as any

    const currentAllocationStatus = container.blockingStatuses?.find(s => (s as any)?.equipmentLeaseContractId === lc?.equipmentLeaseContractId)

    return {
      ...ret,
      containerNumber: container?.aelerContainerId,
      id: lc.equipmentLeaseContractId,
      executionDate: currentAllocationStatus?.validFromActual || currentAllocationStatus?.validFromPlanned || order.executionDate,
      returnDate: currentAllocationStatus?.validToActual || currentAllocationStatus?.validToPlanned || order.returnDate,
      origin: facilities
        .find(c => c.facilityId === currentAllocationStatus?.locationStartActual ||
         c.facilityId === currentAllocationStatus?.locationStartPlanned ||
         c.facilityId === order.pickupLocation)?.name,
      destination: facilities
        .find(c => c.facilityId === currentAllocationStatus?.locationStopActual ||
            c.facilityId === currentAllocationStatus?.locationStopPlanned ||
            c.facilityId === order.dropoffLocation)?.name,

    }
  }).filter(e => e !== undefined)
}

const UsageDaysReport = () => {
  const apiRef = useGridApiRef()
  const [customer, setCustomer] = React.useState<{code: string; name: string; companyId: string} | null>(null)
  const [startDate, setStartDate] = React.useState<Date|null>(null)
  const [endDate, setEndDate] = React.useState<Date|null>(null)
  const [customerInput, setCustomerInput] = useState('')
  const [rowData, setRowData] = useState<ExtendedOrderRowDataProps[]>([])
  const [month, setMonth] = useState<Date|null>(null)

  const { leases, loadingStatus: loadingLeases } = useSelector((state: AppState) => state.lease)
  const { companies, loadingStatus: loadingCompanies } = useSelector((state: AppState) => state.company)
  const { facilities, loadingStatus: loadingFacilities } = useSelector((state: AppState) => state.places)
  const { equipments } = useSelector((state: AppState) => state.equipment)
  const datagridState = useSelector((state: AppState) => state.ui.datagridState)
  const { shouldUseBackend } = useSelector((state: AppState) => state.settings)

  const _dispatch = useDispatch()

  useEffect(() => {
    _dispatch(listLeases({}))
    // _dispatch(listEquipments({}, shouldUseBackend))
    _dispatch(listCompanies({}))
    _dispatch(listFacilities({}))
    if (datagridState?.reports) {
      apiRef.current.restoreState(datagridState.reports)
    }
  }, [])

  useEffect(() => {
    _dispatch(listEquipments({}, shouldUseBackend))
  }, [shouldUseBackend])

  const columns = useMemo(() => {
    const columns = [
      { field: 'customer', headerName: 'Customer', width: 200 },
      // { field: 'contractStatus', headerName: 'Lease type', width: 200 },
      { field: 'containerNumber', headerName: 'Unit', width: 200 },
      { field: 'orderId', headerName: 'Aeler booking ref', width: 300 },
      { field: 'customersBookingNumber', headerName: 'Customer booking ref', width: 200 },
      { field: 'origin', headerName: 'Collection Location', width: 200 },
      { field: 'executionDate', headerName: 'Collection Date', width: 200, valueFormatter: dateFormatter },
      { field: 'destination', headerName: 'Return Location', width: 200 },
      { field: 'returnDate', headerName: 'Return Date', width: 200, valueFormatter: dateFormatter },
      { field: 'leaseDays', headerName: 'Lease days', width: 200 },
    ]

    if (datagridState?.reports && apiRef?.current?.exportState) {
      const columnState = apiRef.current.exportState()
      if (columnState?.columns?.orderedFields) {
        const indexedColumns = columns.reduce((indexed, column) => {
          return {
            ...indexed,
            ...column.field && { [column.field]: column },
          }
        }, {} as { [x: string]: GridColDef })

        return columnState.columns.orderedFields.map(fieldName => indexedColumns[fieldName])
      }
    }

    return columns
  }, [])

  const mapOrders = (orders: Lease[], startDate?: Date | null, endDate?: Date | null) => {
    return orders
      .map(l => mapToOrderRow(l, companies, facilities, equipments))
      .flat()
      .filter(l => l.containerNumber !== undefined)
      .map(l => ({
        ...l,
        ...startDate && endDate && l.executionDate && l.returnDate && { leaseDays: moment(Math.min(l.returnDate.getTime(), endDate.getTime())).diff(Math.max(l.executionDate.getTime(), startDate.getTime()), 'days') + 1 },
      }))
  }

  useEffect(() => {
    const _rowData = mapOrders(leases, startDate, endDate)
    setRowData(_rowData)
  }, [leases, companies, facilities, equipments])

  const handleChangeDateStart = (date: Date | null) => {
    setStartDate(date)
  }

  const handleChangeDateEnd = (date: Date | null) => {
    setEndDate(date)
  }

  const handleChangeCustomer = (e: any, customer: any) => {
    setCustomer(customer)
  }

  const handleChangeMonth = (date: Date | null) => {
    setMonth(date)
    const firstDay = moment(date).startOf('month').toDate()
    const lastDay = moment(date).endOf('month').toDate()
    setStartDate(firstDay)
    setEndDate(lastDay)
  }

  const handleClearAllDates = () => {
    setMonth(null)
    setStartDate(null)
    setEndDate(null)
  }

  const handleFilter = (e: any) => {
    const _rowData = mapOrders(leases, startDate, endDate)
      .filter(r => customer ? r.customerId === customer.companyId : true)
      .filter(r => endDate ? moment(r.executionDate).isBefore(moment(endDate)) : true)
      .filter(r => startDate ? moment(r.returnDate).isAfter(moment(startDate)) : true)
    setRowData(_rowData)
  }

  const handleDispatch = () => {
    const columnState = apiRef.current.exportState()
    _dispatch(setDatagridState({ ...datagridState, reports: columnState }))
  }

  return (
    <Box id='reports' width={'100%'} height={'100%'} display='flex' flexDirection={'column'}>
      <Box id='reports-filters' display={'flex'} justifyContent='space-between' flexWrap='wrap' mt={2} mb={2} >
          <Box id='customer-autocomplete-wrapper' width={300}>
            <Autocomplete
              id="customer-input"
              freeSolo
              getOptionLabel={(option) => typeof option !== 'string' ? option.name : '' }
              value={customer}
              onChange={handleChangeCustomer}
              inputValue={customerInput}
              onInputChange={(event, newInputValue) => {
                setCustomerInput(newInputValue)
                // _dispatch(getAutocompleteCustomers({ startswith: newInputValue }))
              }}
              options={companies}
              renderInput={(params) => (
                <TextField {...params} {...commonProps} placeholder='Search customer...' label="Customer" margin="none" variant="outlined" />
              )}
            />
          </Box>
          <Box id='reports-date-filters' display={'flex'} alignItems='center' sx={{ gap: 1 }} >
            <Tooltip title='Clear All Dates'>
              <span>
                <IconButton color='primary' disabled={!(month || startDate || endDate)} onClick={handleClearAllDates}>
                  <ClearAllIcon />
                </IconButton>
              </span>
            </Tooltip>
            <MonthPicker
              openTo="month"
              views={['month']}
              label="Month"
              renderInput={(props) => <TextField size='small' variant='outlined' margin='none' sx={{ p: 0 }} {...props} />}
              // helperText="Start from year selection"
              value={month}
              onChange={handleChangeMonth}
              inputFormat="yyyy-MM"
            />
            <Typography >or select dates:</Typography>
            <StyledDatePicker
              label="Start date"
              value={startDate}
              onChange={handleChangeDateStart}
              textFieldProps={{ margin: 'none', size: 'small' }}
            />
            <StyledDatePicker
              label="End date"
              value={endDate}
              minDate={startDate || undefined}
              onChange={handleChangeDateEnd}
              textFieldProps={{ margin: 'none', size: 'small' }}
            />

            <Button color='primary' variant='contained' size='small' onClick={handleFilter}>Filter</Button>
        </Box>
      </Box>
      <Box id='reports-data-grid' height='1'>
        <DataGridPro
          apiRef={ apiRef }
          rows={rowData}
          columns={columns}
          // getRowId={(r) => r.orderId}
          components={{ Toolbar: GridToolbar }}
          componentsProps={{
            toolbar: {
              sx: {
                width: 'fit-content', marginLeft: 'auto',
              },
            },
          }}
          // till MUI v6, column visibility model must be initialized for onColumnVisibilityModelChange to work
          initialState={{ columns: { columnVisibilityModel: {} } }}
          // Listener for when the column order, visibility or width changes
          onColumnOrderChange={ handleDispatch }
          onColumnVisibilityModelChange={ handleDispatch }
          onColumnWidthChange={ handleDispatch }
          onPinnedColumnsChange={ handleDispatch }
          getRowId={ row => row.id }
        />
      </Box>
    </Box>
  )
}

export default UsageDaysReport
