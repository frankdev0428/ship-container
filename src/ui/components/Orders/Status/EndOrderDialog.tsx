import React from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import { useSelector } from 'react-redux'

import Typography from '../../Utils/Typography'
import GenericTable from '../../shared/GenericTable/Table'
import OrderRow, { mapToOrderRow, OrderRowProps } from '../OrderRow'
import { Lease } from '../../../../services/lease/types'
import { AppState } from '../../../../store'
import { inititalOrderHeadCells } from '../../../views/Orders'

interface EndOrderDialogProps {
  label: string;
  orders: Lease[],

  handleClose: () => void;
  handleEndOrder: () => void;
}

const EndOrderDialog = ({ label, orders, handleClose, handleEndOrder }: EndOrderDialogProps): any => {
  const { companies } = useSelector((state: AppState) => state.company)
  const { facilities } = useSelector((state: AppState) => state.places)
  const { shouldUseBackend } = useSelector((state: AppState) => state.settings)

  const orderHeadCells = inititalOrderHeadCells
  const rowData = orders.map(l => mapToOrderRow(l, companies, facilities, shouldUseBackend))

  return (
    <Dialog open={true} maxWidth={'xl'} onClose={handleClose} >
      <DialogTitle>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography variant={'h6'}>Change Order Status</Typography>
          <Box justifyContent={'flex-end'}>
            <IconButton size='small' onClick={handleClose}><ClearIcon/></IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
        <GenericTable
          size='small'
          singleSelect
          disableSelect
          headerCells={orderHeadCells}
          order='desc'
          orderBy='executionDate'
          rows={rowData}
          selected={[]}
          handleSelectAllClick={(_) => {}}
          rowComponent={({ ...order }: OrderRowProps) => (
            <OrderRow
              {...order}
              key={order.id}
              disableSelect
              handleRowClick={() => {}}
            />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button color='primary' size='small' onClick={handleClose}>Close</Button>
        <Button color='primary' size='small' variant='contained' onClick={handleEndOrder}>{label}</Button>
      </DialogActions>
    </Dialog>
  )
}

export default EndOrderDialog
