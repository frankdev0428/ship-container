import React, { useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material'
import { useDispatch } from 'react-redux'

import { ContractWithLease } from '../../../../services/equipment/types'
import { LabeledDatePicker } from '../../shared/LabeledDatePicker'
import { updateEquipmentLeaseContract } from '../../../../services/thunks'
import FacilityAutocomplete from '../../shared/Autocomplete/FacilityAutocomplete'
import { updateEquipmentStatus } from '../../../../services/equipment/actions'

import { getContractExecutionDate, getContractReturnDate, getContractStopLocationId } from './AllocationRow'

interface AllocateDialogProps {
  allocation: ContractWithLease;

  handleClose: () => void;
}

const EditAllocationDialog = ({ allocation, handleClose }: AllocateDialogProps): JSX.Element => {
  const executionDate = getContractExecutionDate(allocation)
  const initialReturnDate = getContractReturnDate(allocation)
  const initialDestinationId = getContractStopLocationId(allocation)

  const [returnDate, setReturnDate] = useState<Date | null>(initialReturnDate || new Date())
  const [destination, setSelectedDepot] = useState<string>(initialDestinationId || '')
  const [commentSection, setCommentSection] = useState<string | undefined>(allocation.comment)

  const _dispatch = useDispatch()

  const handleChangeComment = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCommentSection(event.target.value)
  }

  const handleClick = () => {
    returnDate && _dispatch(updateEquipmentLeaseContract(allocation.equipmentLeaseContractId,
      { stopAtActual: returnDate, endLocationId: destination, comment: commentSection || '', active: allocation.active },
      handleClose))
  }

  return (
    <Dialog open={true} fullWidth maxWidth={'sm'} onClose={handleClose}>
      <DialogTitle>
        Edit Allocation
        </DialogTitle>
      <DialogContent >
        <LabeledDatePicker
          label="Updated Return Date"
          value={returnDate}
          onChange={setReturnDate}
          minDate={executionDate}
        />
        <FacilityAutocomplete value={destination} callback={(depot) => {
          return setSelectedDepot(depot as string)
        }} label='Return Location'/>
        <Box sx={{ marginTop: 2 }}>
          <Typography variant='body1'>Comments</Typography>
          <Typography variant='specialHelper'>Max. of 250 characters</Typography>
        </Box>
        <Box sx={{ marginTop: 2 }}>
          <TextField
            fullWidth
            disabled={!allocation.active}
            label='Add a comment'
            variant='outlined'
            name='comments'
            inputProps={{ maxLength: 250 }}
            helperText={`${commentSection?.length || 0}/250`}
            multiline
            FormHelperTextProps={{ sx: { textAlign: 'right' } }}
            onChange={handleChangeComment}
            value={commentSection}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button size='small' color='primary' /* variant='outlined' */ onClick={handleClose}>Close</Button>
        <Button size='small' color='primary' variant='contained' onClick={handleClick}>Edit</Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditAllocationDialog
