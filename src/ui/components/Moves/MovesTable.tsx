import React from 'react'
import { Box } from '@mui/material'
import { useSelector } from 'react-redux'

import { EquipmentMoveInput } from '../../../services/move/types'
import { AppState } from '../../../store'
import Typography from '../Utils/Typography'
import { CurrentLease } from '../../../services/lease/types'
import { TableHeadCell } from '../../../store/ui/types'
import GenericTable from '../shared/GenericTable/Table'

import MoveRow, { mapToMoveRow, MoveRowProps } from './MoveRow'

const NoData = () => {
  return (
    <Box margin={'4px auto'} width='80%'>
      <Typography align='center' variant='subtitle2'>{'There are no movements yet.'}</Typography>
    </Box>
  )
}

const moveTableHeadCells: TableHeadCell[] = [
  { id: 'customer', isSortable: true, label: 'Customer', hide: false },
  { id: 'moveType', isSortable: true, label: 'Move Type', hide: false },
  { id: 'pickupDate', isSortable: true, label: 'Pickup Date', hide: false },
  { id: 'dropoffDate', isSortable: true, label: 'Dropoff Date', hide: false },
  { id: 'origin', isSortable: true, label: 'Origin', hide: false },
  { id: 'destination', isSortable: true, label: 'Destination', hide: false },
  { id: 'orderId', isSortable: true, label: 'Order Nº', hide: false },
  { id: 'costs', isSortable: true, label: 'Costs', hide: false },
  { id: 'actions', isSortable: false, align: 'center', label: null, width: 64 },
]

interface MovesTableProps {
  equipmentId: string;
  leases: CurrentLease[];
}

const MovesTable = ({ equipmentId, leases }: MovesTableProps) => {
  const { companies } = useSelector((state: AppState) => state.company)
  const { facilities, locations } = useSelector((state: AppState) => state.places)
  const { move } = useSelector((state: AppState) => state.financials)
  const { moves, loadingStatus: loadingMoves } = useSelector((state: AppState) => state.moves)

  const filteredMoves = moves.find(m => m.equipmentId === equipmentId)?.moves
    .sort((a, b) => b.pickupDate.getTime() - a.pickupDate.getTime())
    .map(m => mapToMoveRow(m, companies, facilities, locations, leases, move)) || []

  return (
    <Box id='moves-table-wrapper' sx={{ overflowY: 'scroll' }} display='flex' flexDirection={'column'} maxHeight='50vh' pt={1} pb={1}>
        <Box display='flex' flexDirection='column' overflow='hidden' height={'100%'}>
          <GenericTable
            headerCells={moveTableHeadCells}
            order={'asc'}
            orderBy={'id'}
            rows={filteredMoves}
            handleSelectAllClick={() => {}}
            disableSelect
            rowComponent={({ ...row }: MoveRowProps) => (
              <MoveRow
                {...row}
                key={row.id}
              />
            )}
            noDataComponent={<NoData />}
            loading={loadingMoves}
          />
        </Box>
    </Box>
  )
}

export default MovesTable
