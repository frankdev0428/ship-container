import React, { Dispatch, SetStateAction, useState } from 'react'
import { useTheme } from '@mui/material/styles'
import {
  Box,
  Checkbox,
  TableCell,
  TableRow,
  IconButton,
  Collapse,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import Typography, { DisableableTypography } from '../Utils/Typography'
// import { Location as LocationAPI, OrderStatusContractStatusEnum, OrderStatusOrderStatusEnum, PublicOrder } from '../../../apis-client'
// import { locationLabelFromLocation } from '../shared/utils'
import { ContractStatusEnum, CurrentLease, Lease, OrderStatusEnum } from '../../../services/lease/types'
import { Company } from '../../../services/customer/types'
import { Facility, DepotStats, ExchangeLocation } from '../../../services/places/types'
import { TableHeadCell } from '../../../store/ui/types'
import OverflowTooltip from '../shared/OverflowTooltip'
import { StorageRate } from '../../../services/financials/types'
import { mapCurrencySymbols } from '../shared/currencySymbols'
import { FacilityWithLocTypeEnum } from '../../../apis-client/svc-places'
import CollapsibleRow from '../shared/GenericTable/CollapsibleRow'

import NewStorageRate from './NewStorageRate'
import DeleteFacility from './DeleteFacility'
import PatchDepot from './PatchDepot'
import LocationData from './LocationCollapseData/LocationData'

export const mapToDepotRow = (depot: Facility, depotStats?: DepotStats, storage?: StorageRate): DepotRowDataProps => {
  const depotId = depot.facilityId
  return {
    id: depotId,
    code: depot.code,
    type: depot.type,
    depotId: depotId,
    city: depot.address?.city?.name,
    countryName: depot.address?.country?.name,
    countryCode: depot.address?.country?.code,
    region: depot.address?.region,
    containersArriving: depotStats?.containersArriving,
    containersDeparting: depotStats?.containersDeparting,
    containersAtDepot: depotStats?.containersAtDepot,
    containersOverIdleLimit: depotStats?.containersOverIdleLimit,
    containersBlocked: depotStats?.containersBlocked,
    daysidle: depotStats?.daysIdle,
    storageRate: storage ? `${storage?.dailyRate.rate}${mapCurrencySymbols.get(storage?.currency) || storage?.currency}` : undefined,
    name: depot.name,
    facilityId: depotId,
  }
}
interface DepotCellProps {
  headCell: TableHeadCell;
  depot: DepotRowDataProps;
  // orderStatusMap: Map<string | undefined, { color: string; label: string; }>;
  headerCells: TableHeadCell[];
}

const DepotCell = ({ headCell, depot, /* orderStatusMap,  */headerCells }: DepotCellProps): (JSX.Element | null) => {
  if (headCell.hide) return null

  let content
  const theme = useTheme()

  switch (headCell.id) {
    case 'id':
      return (<TableCell>
          <OverflowTooltip title={depot.id} deps={[headerCells]} >
            <Typography noWrap variant='body1' >{depot.id}</Typography>
          </OverflowTooltip>
        </TableCell>)
    case 'containersAtDepot':
      return (<TableCell>
          <OverflowTooltip title={depot.containersAtDepot?.length} deps={[headerCells]} >
            <Typography noWrap variant='body1' >{depot.containersAtDepot?.length}</Typography>
          </OverflowTooltip>
        </TableCell>)
    case 'containersDeparting':
      return (<TableCell>
                <OverflowTooltip title={depot.containersDeparting?.length} deps={[headerCells]} >
                  <Typography noWrap variant='body1' >{depot.containersDeparting?.length}</Typography>
                </OverflowTooltip>
              </TableCell>)
    case 'containersArriving':
      return (<TableCell>
                <OverflowTooltip title={depot.containersArriving?.length} deps={[headerCells]} >
                  <Typography noWrap variant='body1' >{depot.containersArriving?.length}</Typography>
                </OverflowTooltip>
              </TableCell>)
    case 'containersOverIdleLimit':
      content = depot[headCell.id as 'id'].length
      return (
        <TableCell>
          <OverflowTooltip title={content || ''} deps={[headerCells]} >
            <DisableableTypography noWrap variant='body1' sx={{ ...(content > 0 && { color: theme.palette.error.main }) }} >{content}</DisableableTypography>
          </OverflowTooltip>
        </TableCell>
      )
    case 'containersBlocked':
      return (<TableCell>
                <OverflowTooltip title={depot.containersBlocked?.length} deps={[headerCells]} >
                  <Typography noWrap variant='body1' >{depot.containersBlocked?.length}</Typography>
                </OverflowTooltip>
              </TableCell>)
    default:
      content = depot[headCell.id as 'id']
      return (<TableCell>
        <OverflowTooltip title={content || ''} deps={[headerCells]} >
          <DisableableTypography noWrap variant='body1' >{content}</DisableableTypography>
        </OverflowTooltip>
      </TableCell>)
  }
}

export interface DepotRowDataProps {
  id: string;
  code: string;
  type: FacilityWithLocTypeEnum;
  depotId: string;
  city?: string;
  countryName?: string;
  countryCode?: string;
  region?: string;
  // containers?: number;
  containersArriving?: string[];
  containersDeparting?: string[];
  containersAtDepot?: string[];
  containersOverIdleLimit?: string[];
  containersBlocked?: string[];
  daysidle?: number;
  storageRate?: string;
  name: string;
  facilityId: string;
  // customer?: string;
  // depotType?: Depot['depotType'];
  // pickupDate?: Date;
  // dropoffDate?: Date;
  // origin?: string;
  // destination?: string;
  // orderId?: string;
  // costs: DepotCost[];
}
export interface DepotRowProps extends DepotRowDataProps {
  headerCells: TableHeadCell[];
  isExpanded?: boolean;
  isTicked?: boolean;
  disableSelect?: boolean;
  uncollapseRows?: boolean;
  handleRowClick: (event: React.MouseEvent<unknown>, id: string) => void;
  handleCheckboxClick: (event: React.MouseEvent<unknown>, id: string) => void;
  setUncollapseRows: Dispatch<SetStateAction<boolean | undefined>>;
}

const DepotRow = (props: DepotRowProps): JSX.Element => {
  const {
    id,
    code,
    type,
    depotId,
    city,
    countryName,
    countryCode,
    region,
    // containers,
    containersArriving,
    containersDeparting,
    containersAtDepot,
    containersOverIdleLimit,
    containersBlocked,
    daysidle,
    storageRate,
    // customer,
    // depotType,
    // pickupDate,
    // dropoffDate,
    // origin,
    // destination,
    // orderId,
    // costs,
    name,
    facilityId,

    isExpanded,
    isTicked,
    disableSelect,
    headerCells,
    uncollapseRows,
    handleRowClick,
    handleCheckboxClick,
    setUncollapseRows,
  } = props
  // const orderStatusMap = useOrderStatusMap()

  const labelId = `enhanced-table-checkbox-${id}`

  const cellProps = {
    id,
    code,
    type,
    depotId,
    city,
    countryName,
    countryCode,
    region,
    // containers,
    containersArriving,
    containersDeparting,
    containersAtDepot,
    containersOverIdleLimit,
    containersBlocked,
    daysidle,
    storageRate,
    // customer,
    // depotType,
    // pickupDate,
    // dropoffDate,
    // origin,
    // destination,
    // orderId,
    // costs,
    name,
    facilityId,
  }

  const handleDropdown = (event: React.MouseEvent<unknown, MouseEvent>, id: string /*  open: boolean */) => {
    isTicked && setUncollapseRows(false)
    handleRowClick(event, id)
  }

  return (
    <React.Fragment>
      <TableRow
        // hover
        onClick={(event) => handleDropdown(event, id /*  !open */)}
        role={disableSelect ? 'checkbox' : undefined}
        aria-checked={isExpanded}
        tabIndex={-1}
        selected={isExpanded}
        sx={{ height: 40 }}
      >
        {
          !disableSelect &&
            <TableCell padding="checkbox">
              <Checkbox
                color='primary'
                checked={isTicked}
                inputProps={{ 'aria-labelledby': labelId }}
                onClick={(event: any) => {
                  event.stopPropagation()
                  handleCheckboxClick(event, id)
                }}
              />
            </TableCell>
        }
        { headerCells.filter(h => h.id !== 'actions').map(hc =>
          <DepotCell
            key={hc.id}
            headCell={hc}
            headerCells={headerCells}
            depot={cellProps}
            // orderStatusMap={orderStatusMap}
          />).filter(Boolean)}
          <TableCell padding={'none'} align='center'>
            <Box display='flex' alignItems={'center'} justifyContent={'space-between'}>
              <NewStorageRate depotId={depotId}/>
              <PatchDepot depot={{
                facilityId: depotId,
                name: name,
              }}/>
              <DeleteFacility facilityId={depotId} name={name} />
              <IconButton size='small' color='primary'>
                  { isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
            </Box>
          </TableCell>
        </TableRow>
        <CollapsibleRow open={!!(isExpanded || (uncollapseRows && isTicked))} colSpan={headerCells.filter(h => !h.hide).length + 1}>
          <LocationData depotId={depotId} />
        </CollapsibleRow>
    </React.Fragment>
  )
}

export default DepotRow
