import React, { Fragment, useEffect, useMemo } from 'react'
import { styled } from '@mui/material/styles'
import {
  Box,
  Checkbox,
  TableCell,
  tableCellClasses,
  TableRow,
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { DataGridPro, GridColDef, GridToolbarColumnsButton, useGridApiRef } from '@mui/x-data-grid-pro'

import { TableHeadCell } from '../../../../store/ui/types'
import { Alert } from '../../../../services/alerts/types'
import Typography, { DisableableTypography } from '../../Utils/Typography'
import OverflowTooltip from '../../shared/OverflowTooltip'
import { EquipmentLeaseContract } from '../../../../apis-client'
import GenericTable from '../../shared/GenericTable/Table'
import { AppState } from '../../../../store'
import { LeaseVisibilityContract } from '../../../../services/lease/types'
import { Equipment } from '../../../../services/equipment/types'
import NewVisContract from '../VisContract/NewVisContract'
import { Company } from '../../../../services/customer/types'
import { getTimeLabel, setDefaultsDataGridState } from '../../shared/utils'
import { ENABLE_DATAGRID } from '../../../globals'
import { setDatagridState } from '../../../../store/ui/actions'
import { CustomOverflowValue } from '../../shared/CustomOverflowValue'

export const contractDateFormat = 'DD-MM-YYYY'

const StyledTableRow = styled(TableRow)({
  '& > *': {
    borderBottom: 'unset',
  },
})

export const mapToContractRow = (contract: LeaseVisibilityContract, customers: Company[], leaseContracts?: EquipmentLeaseContract[], equipments?: Equipment[]): ContractRowDataProps => {
  // console.log('>>>>>>>>>>>>>>>><', contract)

  const equipmentId = leaseContracts?.find(lc => lc.equipmentLeaseContractId === contract.equipmentLeaseContractId)?.equipmentId
  const containerId = equipments?.find(e => equipmentId === e.equipmentId)?.aelerContainerId

  return {
    id: contract.leaseVisibilityContractId,
    equipmentLeaseContractId: contract.equipmentLeaseContractId,
    containerId: containerId || 'UNKNOWN',
    customerId: contract.customerId,
    customerName: customers.find(c => c.companyId === contract.customerId)?.name,
    startAt: contract.startAt,
    stopAt: contract.stopAt,
    isSameDatesAsLease: contract.isSameDatesAsLease,
    isSameDatesAsStatus: contract.isSameDatesAsStatus,
    isActive: contract.isActive,
  }
}

export const filterVisibilityContracts = (contracts: ContractRowDataProps[], filter: string, companies: Company[]): ContractRowDataProps[] => (
  contracts.filter((c: ContractRowDataProps) => {
    // Don't filter on empty filter
    if (filter.trim().length === 0) { return true }

    // Add attributes to be used in filter
    const attributeList = [
      c.id,
      c.equipmentLeaseContractId,
      c.containerId,
      companies.find(cp => cp.companyId === c.customerId)?.name || c.customerId,
      c.startAt ? getTimeLabel(c.startAt) : undefined,
      c.stopAt ? getTimeLabel(c.stopAt) : undefined,
    ].map(e => e != null ? e.toLowerCase() : '')

    for (const attribute of attributeList) {
      if (attribute.includes(filter.toLowerCase())) {
        return true
      }
    }
    return false
  }))

const StyledTableCell = styled(TableCell)({
  [`&.${tableCellClasses.root}`]: {
    padding: '6px 8px 6px 8px',
  },
})

interface ContractCellProps {
  headCell: TableHeadCell;
  contract: ContractRowDataProps;
  headerCells: TableHeadCell[];
  onDismissAlerts: (alerts: Alert[]) => void;
  companies: Company[];
}

const ContractCell: React.FC<ContractCellProps> = ({ headCell, contract, headerCells, onDismissAlerts, companies }) => {
  if (headCell.hide) return null

  const {
    id,
    containerId,
    customerId,
    startAt,
    stopAt,
    isSameDatesAsLease,
    isSameDatesAsStatus,
    isActive,
  } = contract

  switch (headCell.id) {
    case 'id':
      return (<StyledTableCell >
          <OverflowTooltip title={contract.id} deps={[headerCells]} >
            <Typography noWrap variant='body1'>{id}</Typography>
          </OverflowTooltip>
        </StyledTableCell>)
    case 'isActive':
    case 'isSameDatesAsLease':
    case 'isSameDatesAsStatus':
      return (<TableCell>
        <Checkbox checked={contract[headCell.id] as boolean} disableRipple sx={{ cursor: 'unset' }}></Checkbox>
      </TableCell>)
    case 'customerId': {
      const customerLabel = companies.find(c => c.companyId === customerId)?.name || customerId
      return (<StyledTableCell >
        <OverflowTooltip title={customerLabel || ''} deps={[headerCells]} >
          <DisableableTypography noWrap variant='body1'>{customerLabel}</DisableableTypography>
        </OverflowTooltip>
      </StyledTableCell>)
    }
    // case 'startPlanned':
    //   return (<StyledTableCell >
    //         <OverflowTooltip title={(startPlanned && moment(startPlanned).format(contractDateFormat)) || ''} deps={[headerCells]} >
    //   <DisableableTypography noWrap variant='body2'>
    //     {startPlanned && moment(startPlanned).format(contractDateFormat)}
    //   </DisableableTypography>
    //   </OverflowTooltip>
    //   </StyledTableCell>)
    // case 'startActual':
    //   return (<StyledTableCell >
    //         <OverflowTooltip title={(startActual && moment(startActual).format(contractDateFormat)) || ''} deps={[headerCells]} >
    //   <DisableableTypography noWrap variant='body2'>
    //     {startActual && moment(startActual).format(contractDateFormat)}
    //   </DisableableTypography>
    //   </OverflowTooltip>
    //   </StyledTableCell>)
    // case 'stopPlanned':
    //   return (<StyledTableCell >
    //         <OverflowTooltip title={(stopPlanned && moment(stopPlanned).format(contractDateFormat)) || ''} deps={[headerCells]} >
    //   <DisableableTypography noWrap variant='body2'>
    //     {stopPlanned && moment(stopPlanned).format(contractDateFormat)}
    //   </DisableableTypography>
    //   </OverflowTooltip>
    //   </StyledTableCell>)
    case 'startAt':
    case 'stopAt': {
      const label = contract[headCell.id as 'id']
      const labelFormatted = label && getTimeLabel(new Date(label))
      return (<StyledTableCell >
        <OverflowTooltip title={labelFormatted || ''} deps={[headerCells]} >
          <DisableableTypography noWrap variant='body1'>{labelFormatted}</DisableableTypography>
        </OverflowTooltip>
      </StyledTableCell>)
    }
    default: return (<StyledTableCell >
        <OverflowTooltip title={contract[headCell.id as 'id'] || ''} deps={[headerCells]} >
          <DisableableTypography noWrap variant='body1'>{contract[headCell.id as 'id']}</DisableableTypography>
        </OverflowTooltip>
      </StyledTableCell>)
  }
}

export interface ContractRowDataProps {
  id: string;
  equipmentLeaseContractId: string;
  containerId: string;
  customerId: string;
  customerName?: string;
  startAt?: Date;
  stopAt?: Date;
  isSameDatesAsLease?: boolean;
  isSameDatesAsStatus?: boolean;
  isActive?: boolean;
}
export interface ContractRowProps extends ContractRowDataProps {
  headerCells: TableHeadCell[];
  isSelected?: boolean;
  handleRowClick?: (event: React.MouseEvent<unknown>, id: string) => void;
  onDismissAlerts?: (alerts: Alert[]) => void;
  noCollapse?: boolean;
  noActions?: boolean;
  companies: Company[];
}

const ContractRow = (props: ContractRowProps): JSX.Element => {
  const {
    headerCells,
    id,
    equipmentLeaseContractId,
    containerId,
    customerId,
    customerName,
    startAt,
    stopAt,
    isSameDatesAsLease,
    isSameDatesAsStatus,
    isActive,
    isSelected,
    handleRowClick,
    onDismissAlerts,
    noCollapse,
    noActions,
    companies,
  } = props

  const labelId = `enhanced-table-checkbox-${id}`

  const _dispatch = useDispatch()

  const cellProps = {
    id,
    equipmentLeaseContractId,
    containerId,
    customerId,
    customerName,
    startAt,
    stopAt,
    isSameDatesAsLease,
    isSameDatesAsStatus,
    isActive,
  }

  return (
    <Fragment>
      <StyledTableRow
        hover
        role="checkbox"
        aria-checked={isSelected}
        tabIndex={-1}
        selected={isSelected}
        sx={{ cursor: 'pointer' }}
      >
        {!noCollapse &&
          <TableCell padding="checkbox">
            <Checkbox
              color='primary'
              checked={isSelected}
              inputProps={{ 'aria-labelledby': labelId }}
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                if (handleRowClick) handleRowClick(event, id)
              }}
            />
          </TableCell>
        }
        {
          headerCells.filter(h => h.label).map(hc =>
            <ContractCell
              key={hc.id}
              headerCells={headerCells}
              headCell={hc}
              contract={cellProps}
              onDismissAlerts={onDismissAlerts === undefined ? (alerts: any) => {} : onDismissAlerts}
              companies={companies}
            />).filter(Boolean)
        }
        {noActions !== true &&
          <TableCell padding={'none'} align='center'>
            <Box display='flex' alignItems={'center'} justifyContent={'space-between'} mb={1}>
              <NewVisContract equipmentLeaseContractId={equipmentLeaseContractId} visibilityContractId={id} isUpdateForm={true} contract={cellProps}/>
              {/* <UpdateStatus equipmentId={equipmentId || ''} containerId={currentStatus?.containerId || ''} contract={currentStatus} throughLease={false}/> */}
            </Box>
          </TableCell>
        }
      </StyledTableRow>
    </Fragment>
  )
}

interface NoDataProps {
  searchFilter?: string;
}

const NoData = ({ searchFilter }: NoDataProps) => {
  return (
    <Box margin={'4px auto'} width='80%'>
      <Typography align='center' variant='subtitle2'>
        { searchFilter !== ''
          ? 'There are no contacts matching your search filter.'
          : 'There are no contacts yet.'
        }
        </Typography>
    </Box>
  )
}

export const inititalHeadCells: TableHeadCell[] = [
  { id: 'id', isSortable: true, label: 'Contract ID', hide: true },
  { id: 'containerId', isSortable: true, label: 'Container ID', hide: false, width: 180 },
  { id: 'customerId', isSortable: true, label: 'Customer', hide: false },
  { id: 'startAt', isSortable: true, label: 'startAt', hide: false },
  { id: 'stopAt', isSortable: true, label: 'stopAt', hide: false },
  { id: 'isActive', isSortable: true, label: 'isActive', hide: false },
  { id: 'isSameDatesAsLease', isSortable: true, label: 'isSameDatesAsLease', hide: false },
  { id: 'isSameDatesAsStatus', isSortable: true, label: 'isSameDatesAsStatus', hide: false },
  { id: 'actions', isSortable: false, align: 'center', label: null, width: 64 },
]

interface VisibilityContractsTableProps {
  leaseContracts?: EquipmentLeaseContract[];
}

const VisibilityContractsTable = ({ leaseContracts }: VisibilityContractsTableProps) => {
  const apiRef = useGridApiRef()
  const contracts = useSelector((state: AppState) => state.lease.vizContracts)
  const equipments = useSelector((state: AppState) => state.equipment.equipments)
  const { companies } = useSelector((state: AppState) => state.company)
  const datagridState = useSelector((state: AppState) => state.ui.datagridState)

  const contractsFiltered = contracts.filter(c => leaseContracts?.map(lc => lc.equipmentLeaseContractId).includes(c.equipmentLeaseContractId))

  const _dispatch = useDispatch()

  useEffect(() => {
    if (ENABLE_DATAGRID && datagridState?.ordersVisibility) {
      apiRef.current.restoreState(setDefaultsDataGridState(datagridState.ordersVisibility))
    }
  }, [])

  const handleDispatch = () => {
    const columnState = apiRef.current.exportState()

    _dispatch(setDatagridState({ ...datagridState, ordersVisibility: columnState }))
  }

  const columns = useMemo(() => [
    {
      field: 'actions',
      sortable: false,
      filterable: false,
      hideable: false,
      headerName: 'Actions',
      minWidth: 70,
      renderHeader: () => (
        <GridToolbarColumnsButton style={{ minWidth: 36 }} nonce={undefined} onResize={undefined} onResizeCapture={undefined} />
      ),
      renderCell: (params: {row: ContractRowDataProps}) => (
        <NewVisContract equipmentLeaseContractId={params.row.equipmentLeaseContractId} visibilityContractId={params.row.id} isUpdateForm={true} contract={params.row}/>
      ),
    },
    {
      field: 'id',
      headerName: 'Contract ID',
      renderCell: (params: {row: ContractRowDataProps}) => (
        <CustomOverflowValue dataKey={'ordersVisibility'} value={params.row.id} />
      ),
      minWidth: 200,
    },
    {
      field: 'containerId',
      headerName: 'Container ID',
      minWidth: 180,
      renderCell: (params: {row: ContractRowDataProps}) => (
        <CustomOverflowValue dataKey={'ordersVisibility'} value={params.row.containerId} />
      ),
      flex: 1,
    },
    {
      field: 'customerId',
      headerName: 'Customer',
      renderCell: (params: {row: ContractRowDataProps}) => (
        <CustomOverflowValue dataKey={'ordersVisibility'} value={params.row.customerName} />
      ),
      flex: 1,
    },
    {
      field: 'startAt',
      headerName: 'startAt',
      renderCell: (params: {row: ContractRowDataProps}) => (
        <CustomOverflowValue
          dataKey={'ordersVisibility'}
          value={params.row.startAt ? getTimeLabel(params.row.startAt, 'dateHourWithTz') : undefined}
        />
      ),
      flex: 1,
    },
    {
      field: 'stopAt',
      headerName: 'stopAt',
      renderCell: (params: {row: ContractRowDataProps}) => (
        <CustomOverflowValue
          dataKey={'ordersVisibility'}
          value={params.row.stopAt ? getTimeLabel(params.row.stopAt, 'dateHourWithTz') : undefined}
        />
      ),
      flex: 1,
    },
    {
      field: 'isActive',
      headerName: 'isActive',
      renderCell: (params: {row: ContractRowDataProps}) => (
        <Checkbox checked={params.row.isActive as boolean} disableRipple sx={{ cursor: 'unset' }}></Checkbox>
      ),
      flex: 1,
    },
    {
      field: 'isSameDatesAsLease',
      headerName: 'isSameDatesAsLease',
      renderCell: (params: {row: ContractRowDataProps}) => (
        <Checkbox checked={params.row.isSameDatesAsLease as boolean} disableRipple sx={{ cursor: 'unset' }}></Checkbox>
      ),
      flex: 1,
    },
    {
      field: 'isSameDatesAsStatus',
      headerName: 'isSameDatesAsStatus',
      renderCell: (params: {row: ContractRowDataProps}) => (
        <Checkbox checked={params.row.isSameDatesAsStatus as boolean} disableRipple sx={{ cursor: 'unset' }}></Checkbox>
      ),
      flex: 1,
    },
  ] as GridColDef[],
  [])

  return (
    <Box display='flex' flexDirection='column' overflow='hidden' height={'100vh'} /* We can have 100vh because the parent will limit it to 50vh */ >
      { ENABLE_DATAGRID
        ? <DataGridPro
          apiRef={ apiRef }
          initialState={{ columns: { columnVisibilityModel: {} } }}
          localeText={{ toolbarColumns: '' }}
          disableSelectionOnClick
          onColumnOrderChange={ handleDispatch }
          onColumnVisibilityModelChange={ handleDispatch }
          onColumnWidthChange={ handleDispatch }
          onPinnedColumnsChange={ handleDispatch }
          onSortModelChange={ handleDispatch }
          columns={ columns }
          rows={ contractsFiltered.map(c => mapToContractRow(c, companies, leaseContracts, equipments)) }
          getRowId={ row => row.id }
        />
        : <GenericTable
          headerCells={inititalHeadCells}
          order={'asc'}
          orderBy={'startPlanned'}
          rows={contractsFiltered.map(c => mapToContractRow(c, companies, leaseContracts, equipments))}
          handleSelectAllClick={() => {}}
          searchBy={(rows, searchFilter: string) => filterVisibilityContracts(rows, searchFilter, companies)}
          searchPlaceholder={'Search contracts...'}
          disableSelect
          noDataComponent={(searchFilter: string) => <NoData searchFilter={searchFilter} />}
          rowComponent={({ ...row }: ContractRowProps) => (
            <ContractRow
              {...row}
              headerCells={inititalHeadCells}
              // handleRowClick={handleRowClick}
              // isSelected={isSelected(row.id)}
              // onDismissAlerts={handleDismissAlerts}
              // handleCreateMove={handleCreateMove}
              // equipmentsWithLeases={equipmentsWithLeases}
              companies={companies}
              noCollapse={true}
            />
          )}
        />
      }
    </Box>
  )
}

export default VisibilityContractsTable
