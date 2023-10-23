import React, { useEffect, useState } from 'react'
import { Box, Tab, Tabs } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'

import Typography from '../../Utils/Typography'
import { getDepotContacts } from '../../../../services/places/actions'

import InventoryTable from './InventoryTable'
import ContactsTable from './ContactsTable'
import ContactFormButton from './ContactFormButton'

const NoData = ({ type }: { type: string }) => {
  return (
    <Box margin={'4px auto'} width='80%'>
      <Typography align='center' variant='subtitle2'>{`There are no ${type} yet.`}</Typography>
    </Box>
  )
}

interface LocationDataProps {
  depotId: string;
  // handleCreateMove: (move: EquipmentMoveInput) => void;
}

const LocationData = ({ depotId }: LocationDataProps) => {
  const [tab, setTab] = useState<'containers' | 'contacts'>('containers')

  const handleChange = (event: any, newValue: 'containers' | 'contacts') => {
    setTab(newValue)
  }

  const _dispatch = useDispatch()
  useEffect(() => {
    if (depotId) {
      if (tab === 'containers') {
        // _dispatch(listContainer(depotId))
      }
      if (tab === 'contacts') {
        _dispatch(getDepotContacts(depotId))
      }
    }
  }, [tab])

  return (
    <Box id='location-data-table-wrapper' sx={{ overflowY: 'auto' }} display='flex' flexDirection={'column'} pt={1} pb={2}>
      <Box display='flex' alignItems={'center'} justifyContent={'space-between'} mb={1}>
        <Tabs
          value={tab}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChange}
          aria-label="disabled tabs example"
          sx={{ height: '36px', minHeight: '36px' }}
        >
          <Tab value='containers' label="Containers" sx={{ height: '36px', minHeight: '36px' }} />
          <Tab value='contacts' label="Contacts" sx={{ height: '36px', minHeight: '36px' }} />
        </Tabs>
        {
          tab === 'contacts' &&
            <ContactFormButton
              label='Create contact'
              action={'create'}
              depotId={depotId}
            />
        }
      </Box>
      { tab === 'containers' && <InventoryTable facilityId={depotId} /> }
      { tab === 'contacts' && <ContactsTable facilityId={depotId} /> }
    </Box>
  )
}

export default LocationData
