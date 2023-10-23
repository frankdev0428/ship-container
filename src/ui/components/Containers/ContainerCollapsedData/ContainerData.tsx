import React, { useEffect, useState } from 'react'
import { Box, Tab, Tabs } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'

import { EquipmentMoveInput } from '../../../../services/move/types'
import { AppState } from '../../../../store'
import Typography from '../../Utils/Typography'
import { CurrentLease } from '../../../../services/lease/types'
import { TableHeadCell } from '../../../../store/ui/types'
import NewMove from '../../Moves/NewMove'
import { listMoves } from '../../../../services/move/actions'
import { getMoveCosts } from '../../../../services/financials/actions'
import { listEquipmentLeaseContracts, listContainer } from '../../../../services/equipment/actions'
import Config from '../../../../config.json'

import AllocationTable from './AllocationTable'
// import BoardsTable from './BoardProfile/BoardProfileTable'
import StructuralInfoTable from './StructuralInfoTable'
import StatusesTable from './StatusesTable'
import BoardProfileTable from './BoardProfile/BoardProfileTable'

const NoData = ({ type }: { type: string }) => {
  return (
    <Box margin={'4px auto'} width='80%'>
      <Typography align='center' variant='subtitle2'>{`There are no ${type} yet.`}</Typography>
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
  { id: 'actions', isSortable: false, align: 'center', label: null },
]

const allocationTableHeadCells: TableHeadCell[] = [
  { id: 'id', isSortable: true, label: 'Order Nº', hide: false },
  { id: 'customer', isSortable: true, label: 'Customer', hide: false },
  { id: 'origin', isSortable: true, label: 'Collection Location', hide: false },
  { id: 'executionDate', isSortable: true, label: 'Collection Date', hide: false },
  { id: 'destination', isSortable: true, label: 'Return Location', hide: false },
  { id: 'returnDate', isSortable: true, label: 'Return Date', hide: false },
  { id: 'units', isSortable: true, label: 'Cont. Quantity', hide: false },
  // { id: 'allocatedContainers', isSortable: true, label: 'Cont. Allocated', hide: false },
  { id: 'actions', isSortable: true, align: 'center', label: null },
]

// export const inititalOrderHeadCells: TableHeadCell[] = [
//   { id: 'id', isSortable: true, label: 'Order Nº', hide: false },
//   { id: 'orderStatus', isSortable: true, label: 'Status', hide: false },
//   { id: 'customer', isSortable: true, label: 'Client', hide: false },
//   { id: 'contractStatus', isSortable: true, label: 'Contract', hide: false },
//   { id: 'origin', isSortable: true, label: 'Collection Location', hide: false },
//   { id: 'executionDate', isSortable: true, label: 'Collection Date', hide: false },
//   { id: 'destination', isSortable: true, label: 'Return Location', hide: false },
//   { id: 'returnDate', isSortable: true, label: 'Return Date', hide: false },
//   { id: 'units', isSortable: true, label: 'Cont. Quantity', hide: false },
//   { id: 'allocatedContainers', isSortable: true, label: 'Cont. Allocated', hide: false },
// ]

interface ContainerDataProps {
  equipmentId: string;
  leases: CurrentLease[];
  containerId: string;
  handleCreateMove: (move: EquipmentMoveInput) => void;
  equipmentsWithLeases: {equipmentId: string, leases: {value: string, label: string}[]}[];
}

const ContainerData = ({ equipmentId, containerId, leases, handleCreateMove, equipmentsWithLeases }: ContainerDataProps) => {
  // const [tab, setTab] = useState(0)
  const [tab, setTab] = useState<'allocations' | 'movements' | 'structInfo' | 'boards' | 'gantt'>('allocations')

  const eqOptions = [{ value: equipmentId, label: containerId }]

  const handleChange = (event: any, newValue: 'allocations' | 'movements' | 'structInfo' | 'boards' | 'gantt') => {
    setTab(newValue)
  }

  const _dispatch = useDispatch()
  useEffect(() => {
    if (equipmentId) {
      if (tab === 'movements') {
        _dispatch(listMoves(equipmentId))
        _dispatch(getMoveCosts({})) // FIXME: filter only for equipment ?
      }
      if (tab === 'allocations') {
        _dispatch(listEquipmentLeaseContracts(equipmentId))
      }
      /*
      FIXME: LEGACY CODE FROM BOARDS V1 -- remove it later
      */
      // if (tab === 'boards') {
      //   // _dispatch(listBoardsByEquipment(equipmentId))
      //   _dispatch(listContainer(containerId))
      // }
      if (tab === 'boards') {
        // _dispatch(listBoardsByEquipment(equipmentId))
        _dispatch(listContainer(containerId))
      }
      if (tab === 'structInfo') {
        // _dispatch(listContainerPanel(containerId)) // FIXME
        _dispatch(listContainer(containerId))
      }
    }
  }, [tab])

  const hasMovesFF = Config.FF_ENABLE_MOVES !== undefined && Config.FF_ENABLE_MOVES === 'true'

  return (
    <Box id='container-data-table-wrapper' sx={{ overflowY: 'auto' }} display='flex' flexDirection={'column'} pt={1} pb={2}>
      <Box display='flex' alignItems={'center'} justifyContent={'space-between'} mb={2}>
        <Tabs
          value={tab}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChange}
          aria-label="disabled tabs example"
          sx={{ height: '36px', minHeight: '36px' }}
        >
          <Tab value='allocations' label="Allocations" sx={{ height: '36px', minHeight: '36px' }} />
          <Tab value='structInfo' label="Structural Info" sx={{ height: '36px', minHeight: '36px' }} />
          {/*
          FIXME: LEGACY CODE FROM BOARDS V1 -- remove it later
          */}
          {/* <Tab value='boards' label="Boards" sx={{ height: '36px', minHeight: '36px' }} /> */}
          <Tab value='boards' label="IoT Boards" sx={{ height: '36px', minHeight: '36px' }} />
          <Tab value='gantt' label="Gantt" sx={{ height: '36px', minHeight: '36px' }} />
          {hasMovesFF && <Tab label="Movements" sx={{ height: '36px', minHeight: '36px' }} />}
        </Tabs>
        { tab === 'movements' && hasMovesFF && <NewMove
          textAlign={'right'}
          equipmentId={equipmentId}
          equipments={eqOptions}
          equipmentsWithLeases={equipmentsWithLeases}
          onCreate={handleCreateMove}
          />
        }
      </Box>
      { tab === 'allocations' && <AllocationTable equipmentId={equipmentId} leases={leases} />}
      { tab === 'gantt' && <StatusesTable equipmentId={equipmentId} />}
      {/*
      FIXME: LEGACY CODE FROM BOARDS V1 -- remove it later
      */}
      {/* { tab === 'boards' && <BoardsTable containerId={containerId}/>} */}
      { tab === 'boards' && <BoardProfileTable containerId={containerId}/>}
      { tab === 'structInfo' && <StructuralInfoTable containerId={containerId}/>}
    </Box>
  )
}

export default ContainerData
