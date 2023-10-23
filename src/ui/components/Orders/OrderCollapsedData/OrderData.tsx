import React, { useEffect, useState } from 'react'
import { Box, Tab, Tabs } from '@mui/material'
import { useDispatch } from 'react-redux'

import { EquipmentLeaseContract } from '../../../../services/lease/types'
import { listEquipment } from '../../../../services/equipment/actions'
import { listVisibilityContracts } from '../../../../services/lease/actions'

import VisibilityContractsTable from './VisibilityContractsTable'
import Allocations from './Allocations'

interface OrderDataProps {
  orderId: string;
  leaseContracts?: EquipmentLeaseContract[];
  // leases: CurrentLease[];
  // containerId: string;
  // handleCreateMove: (move: EquipmentMoveInput) => void;
  // equipmentsWithLeases: {orderId: string, leases: {value: string, label: string}[]}[];
}

const OrderData = ({ orderId, leaseContracts }: OrderDataProps): JSX.Element => {
  const [tab, setTab] = useState<'allocations' | 'contracts'>('allocations')

  // const eqsInOrder = leaseContracts?.map(lc => lc.equipmentId)

  const _dispatch = useDispatch()

  useEffect(() => {
    if (orderId) {
      if (tab === 'contracts') {
        leaseContracts?.forEach(lc => {
          _dispatch(listVisibilityContracts({ equipmentLeaseContractId: lc.equipmentLeaseContractId }))
        })
      }
      if (tab === 'allocations') {
        leaseContracts?.forEach(lc => {
          _dispatch(listEquipment(lc.equipmentId))
        })
      }
    }
  }, [tab])

  const handleChange = (event: any, newValue: 'allocations' | 'contracts') => {
    setTab(newValue)
  }

  return (
    <Box id='orders-table-wrapper' display='flex' flexDirection={'column'} maxHeight='50vh' pt={1} pb={1}>
      <Box display='flex' alignItems={'center'} justifyContent={'space-between'} mb={1}>
        {/* <Typography >Movements</Typography> */}
        {/* <MovesTable orderId={orderId} leases={leases} /> */}
        <Tabs
          value={tab}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChange}
          aria-label="disabled tabs example"
          sx={{ height: '36px', minHeight: '36px' }}
        >
          <Tab value='allocations' label="Allocations" sx={{ height: '36px', minHeight: '36px' }} />
          <Tab value='contracts' label="Visibility" sx={{ height: '36px', minHeight: '36px' }} />
        </Tabs>
      </Box>

      {
        tab === 'allocations' &&
        <Allocations leaseContracts={leaseContracts}/>
      }
      {
        tab === 'contracts' &&
        <VisibilityContractsTable leaseContracts={leaseContracts}/>
      }
    </Box>
  )
}

export default OrderData
