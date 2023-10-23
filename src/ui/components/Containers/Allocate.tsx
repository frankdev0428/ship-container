import React, { useEffect, useState } from 'react'
import {
  Box,
  BoxProps,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'

import { AppState } from '../../../store'
import { showError } from '../../../store/error/actions'
import { listAssignableLeases } from '../../../services/lease/actions'
import GenericTable from '../shared/GenericTable/Table'
import OrderRow, { mapToOrderRow, OrderRowProps } from '../Orders/OrderRow'
import { inititalOrderHeadCells } from '../../views/Orders'
import { filterOrders } from '../Orders/Filter/utils'

interface AllocateDialogProps {
  handleClose: () => void;
  handleAllocate: (orderId: string) => void;
}

const AllocateDialog = ({ handleClose, handleAllocate }: AllocateDialogProps) => {
  const [orderId, setOrderId] = useState<string | null>(null)
  const _dispatch = useDispatch()

  const { loadingStatus, assignableLeases } = useSelector((state: AppState) => state.lease)
  const { companies } = useSelector((state: AppState) => state.company)
  const { facilities } = useSelector((state: AppState) => state.places)
  const { shouldUseBackend } = useSelector((state: AppState) => state.settings)

  useEffect(() => {
    _dispatch(listAssignableLeases({
      status: 'ASSIGNABLE',
      // statusAt: (new Date()).toISOString(),
    }))
  }, [])

  const orderHeadCells = [...inititalOrderHeadCells]
  orderHeadCells[1].hide = true
  orderHeadCells[3].hide = true

  const handleRowClick = (event: React.MouseEvent<unknown>, id: string) => {
    setOrderId(id)
  }

  const handleClick = () => {
    orderId
      ? handleAllocate(orderId)
      : _dispatch(showError(['Must choose one order']))
  }

  const rowData = assignableLeases.map(l => mapToOrderRow(l, companies, facilities, shouldUseBackend))

  return (
    <Dialog open={true} maxWidth={'xl'} onClose={handleClose}>
      <DialogTitle>
        Assignable Orders
        { loadingStatus && <CircularProgress sx={{ marginLeft: '16px' }} size={20} /> }
        </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
        <GenericTable
          size='small'
          singleSelect
          headerCells={orderHeadCells}
          orderBy='executionDate'
          order='desc'
          rows={rowData}
          selected={[]}
          handleSelectAllClick={(_) => {}}
          searchBy={filterOrders}
          searchPlaceholder={'Search orders...'}
          rowComponent={({ ...order }: OrderRowProps) => (
            <OrderRow
              {...order}
              key={order.id}
              handleRowClick={handleRowClick}
              isSelected={order.id === orderId}
            />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button size='small' color='primary' /* variant='outlined' */ onClick={handleClose}>Close</Button>
        <Button size='small' color='primary' variant='contained' onClick={handleClick}>Allocate</Button>
      </DialogActions>
    </Dialog>
  )
}

interface AllocateProps extends BoxProps {
  disabled?: boolean;

  onAllocate: (orderId: string) => void
}

const Allocate = ({ disabled, onAllocate, ...boxProps }: AllocateProps) => {
  const [open, setOpen] = useState(false)

  const handleAllocate = (orderId: string) => {
    setOpen(false)
    onAllocate(orderId)
  }

  return (
    <Box {...boxProps}>
      <Button variant='outlined' size='small' color='primary' disabled={disabled} sx={{ margin: '0 16px' }} onClick={() => setOpen(true)}>
        Allocate
      </Button>
      { open && <AllocateDialog handleClose={() => setOpen(false)} handleAllocate={handleAllocate}/>}
    </Box>
  )
}

export default Allocate
