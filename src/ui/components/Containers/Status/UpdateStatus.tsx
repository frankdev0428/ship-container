import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  TextField,
  FormControlLabel,
  BoxProps,
  StandardTextFieldProps,
  Grid,
} from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import { useDispatch, useSelector } from 'react-redux'
import UpdateIcon from '@mui/icons-material/Edit'

import { LabeledDatePicker } from '../../shared/LabeledDatePicker'
import Typography from '../../Utils/Typography'
import { CurrentStatus, EquipmentLeaseContractUpdate, PatchEquipmentStatusInput } from '../../../../apis-client'
import { updateEquipmentStatus } from '../../../../services/equipment/actions'
import { updateEquipmentLeaseContract, updateStatus } from '../../../../services/thunks'
import FacilityAutocomplete from '../../shared/Autocomplete/FacilityAutocomplete'
import Costs, { Cost } from '../Costs/Costs'
import { addCost, getCosts, removeCost, updateCost } from '../../../../services/financials/actions'
import { AppState } from '../../../../store'
import { getContractStopLocationId } from '../ContainerCollapsedData/AllocationRow'
import { CurrentStatusStatusEnum } from '../../../../services/equipment/types'

const commonProps = {
  variant: 'outlined' as any,
  margin: 'dense' as any,
  size: 'small' as any,
  style: { minWidth: 160 },
  fullWidth: true,
}

interface SelectableTextFieldProps extends StandardTextFieldProps {
  label: string;
  options: any[];
  value: any;

  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const SelectableTextField = ({ label, options, value, onChange, ...restProps }: SelectableTextFieldProps) => (
  <TextField
    id="outlined-select-container-size"
    select
    label={label}
    value={value}
    onChange={onChange}
    {...commonProps}
    {...restProps}
  >
    {options.map((option) => (
      <MenuItem key={option} value={option}>
        {option}
      </MenuItem>
    ))}
  </TextField>
)

interface UpdateStatusDialogProps {
  handleClose: () => void;
  handleCreate: (newStatus: PatchEquipmentStatusInput) => void;
  handleContractUpdate: (newContract: EquipmentLeaseContractUpdate) => void
  status?: CurrentStatus;
  equipmentId: string;
  containerId?: string;
  comment?: string;
  isActive?: boolean
}

const UpdateStatusDialog = ({ containerId, equipmentId, status, comment, isActive, handleClose, handleCreate, handleContractUpdate }: UpdateStatusDialogProps) => {
  const [statusUpdate, setStatusUpdate] = useState<PatchEquipmentStatusInput>({
    locationFromPlanned: status?.locationStartPlanned,
    locationFromActual: status?.locationStartActual,
    locationToPlanned: status?.locationStopPlanned,
    locationToActual: status?.locationStopActual,
    depotOutDatePlanned: status?.validFromPlanned,
    depotOutDateActual: status?.validFromActual,
    depotInDatePlanned: status?.validToPlanned,
    depotInDateActual: status?.validToActual,
    comment: comment,
  })

  // const [contractUpdate, setContractUpdate] = useState<{comment?: string, active?: CurrentStatusStatusEnum}>({
  //   comment: comment,
  //   active: status?.status,
  // })

  const costsInitial = useSelector((state: AppState) => state.financials.costs) // example mock: [{ costId: 'bla', value: 10, currency: 'CHF' as any, invoicedAt: new Date(), reason: 'tuna' }]
  const [costs, setCosts] = useState<Cost[]>(costsInitial)

  const handleSubmit = (event?: FormEvent<HTMLFormElement>) => {
    event?.stopPropagation()
    event?.preventDefault()
    // if (contractUpdate?.comment && (status?.validFromActual || status?.validFromPlanned) && (status.locationStopActual || status.locationStartPlanned)) {
    //   const newContract = {
    //     stopAtActual: status?.validFromActual || status.validFromPlanned || new Date(),
    //     endLocationId: status?.locationStopActual || status?.locationStopPlanned || '',
    //     comment: contractUpdate.comment,
    //   }
    //   handleContractUpdate(newContract)
    // }
    handleCreate(statusUpdate)
    onSubmitCosts()
  }

  const handleChangeDate = (date: Date | null, key: string) => {
    setStatusUpdate({
      ...statusUpdate,
      ...(date && { [key]: date }),
    })
  }

  const handleChangeLocation = (value: string, key: string) => {
    setStatusUpdate({
      ...statusUpdate,
      [key]: value,
    })
  }

  const handleChangeComment = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // setContractUpdate({
    //   comment: event.target.value,
    // })
    setStatusUpdate({
      ...statusUpdate,
      comment: event.target.value,
    })
  }

  const _dispatch = useDispatch()

  const onSubmitCosts = () => {
    const toAdd = costs.filter(e => e.new)
    const toUpdate = costs.filter(e => costsInitial.map(e2 => e2.costId).includes(e.costId)).filter(e => e.shouldUpdate)
    const toRemove = costsInitial.filter(e => !costs.map(e2 => e2.costId).includes(e.costId))
    toAdd.length > 0 && toAdd.map(e => _dispatch(addCost(e)))
    toUpdate.length > 0 && toUpdate.map(e => _dispatch(updateCost(e.costId, e)))
    toRemove.length > 0 && toRemove.map(e => _dispatch(removeCost(e.costId)))
  }

  return (
    <Dialog open={true} maxWidth={'md'} fullWidth onClose={(event, reason) => { if (reason !== 'backdropClick') handleClose() }} >
      <DialogTitle>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography variant={'h6'}>{containerId && containerId !== undefined ? `Update ${containerId} status` : 'Update status'}</Typography>
          <Box justifyContent={'flex-end'}>
            <IconButton size='small' onClick={handleClose}><ClearIcon/></IconButton>
          </Box>
        </Box>
        </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Typography>Status dates</Typography>
          <Grid container item spacing={1}>
            <Grid item xs={6}>
              <Box display='flex' flexDirection='column' >
                <Typography variant='subtitle2' bold>Planned</Typography>
                <LabeledDatePicker
                  label="From planned"
                  value={statusUpdate.depotOutDatePlanned || null}
                  onChange={date => handleChangeDate(date, 'depotOutDatePlanned')}
                />
                <FacilityAutocomplete required={false} value={statusUpdate.locationFromPlanned} callback={(depot) => {
                  return handleChangeLocation(depot as string, 'locationFromPlanned')
                }} label='Planned start location'/>
                <LabeledDatePicker
                  label="To planned"
                  value={statusUpdate.depotInDatePlanned || null}
                  onChange={date => handleChangeDate(date, 'depotInDatePlanned')}
                />
                <FacilityAutocomplete required={false} value={statusUpdate.locationToPlanned} callback={(depot) => {
                  return handleChangeLocation(depot as string, 'locationToPlanned')
                }} label='Planned stop location'/>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display='flex' flexDirection='column' >
                <Typography variant='subtitle2' bold>Actual</Typography>
                <LabeledDatePicker
                  label="From actual"
                  value={statusUpdate.depotOutDateActual || null}
                  onChange={date => handleChangeDate(date, 'depotOutDateActual')}
                />
                <FacilityAutocomplete required={false} value={statusUpdate.locationFromActual} callback={(depot) => {
                  return handleChangeLocation(depot as string, 'locationFromActual')
                }} label='Actual start location'/>
                <LabeledDatePicker
                  label="To actual"
                  value={statusUpdate.depotInDateActual || null}
                  onChange={date => handleChangeDate(date, 'depotInDateActual')}
                />
                <FacilityAutocomplete required={false} value={statusUpdate.locationToActual} callback={(depot) => {
                  return handleChangeLocation(depot as string, 'locationToActual')
                }} label='Actual stop location'/>
              </Box>
            </Grid>
          </Grid>
          {status?.status === 'ALLOCATED' && <React.Fragment><Typography>Cost information</Typography>
          <Grid>
            <Costs statusId={status.statusId} costs={costs} setCosts={setCosts}/>
          </Grid>
          </React.Fragment>
          }
          <Grid sx={{ marginTop: 2 }}>
            <Typography variant='body1'>Comments</Typography>
            <Typography variant='specialHelper'>Max. of 250 characters</Typography>
          </Grid>
          <Grid sx={{ marginTop: 2 }}>
            <TextField
              fullWidth
              // disabled={!isActive} FIXME: add it back when status is fixed
              label='Add a comment'
              variant='outlined'
              name='comments'
              inputProps={{ maxLength: 250 }}
              helperText={`${statusUpdate.comment?.length || 0}/250`}
              multiline
              FormHelperTextProps={{ sx: { textAlign: 'right' } }}
              onChange={handleChangeComment}
              value={statusUpdate.comment}
            />
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button color='primary' onClick={handleClose}>Close</Button>
          <Button color='primary' size='small' variant='contained' type='submit' >Update</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

interface UpdateStatusProps extends BoxProps {
  equipmentId: string;
  statusId: string;
  equipmentLeaseContractId?: string;
  containerId?: string;
  status?: CurrentStatus;
  throughLease?: boolean;
  comment?: string;
  isActive?: boolean
}

const UpdateStatus = ({ containerId, equipmentId, statusId, status, throughLease, comment, isActive, equipmentLeaseContractId, ...boxProps }: UpdateStatusProps) => {
  const [open, setOpen] = useState(false)
  const _dispatch = useDispatch()

  useEffect(() => {
    _dispatch(getCosts(statusId))
  }, [])

  const handleCreate = (newStatus: PatchEquipmentStatusInput) => {
    _dispatch(updateStatus(equipmentId, statusId, newStatus, throughLease === undefined ? true : throughLease))
    setOpen(false)
  }

  const handleContractUpdate = (newContract: EquipmentLeaseContractUpdate) => {
    equipmentLeaseContractId && equipmentLeaseContractId !== '' && _dispatch(updateEquipmentLeaseContract(equipmentLeaseContractId, newContract))
  }

  return (
    <Box {...boxProps} >
      {/* <Button variant='contained' size='small' color='primary' disabled={false} onClick={() => setOpen(true)}>
        Update status
      </Button> */}
      <IconButton color='primary' size='small' onClick={() => setOpen(true)}>
        <UpdateIcon/>
      </IconButton>
      {
        open &&
        <UpdateStatusDialog
          containerId={containerId}
          equipmentId={equipmentId}
          status={status}
          comment={comment}
          isActive={isActive}
          handleClose={() => setOpen(false)}
          handleCreate={handleCreate}
          handleContractUpdate={handleContractUpdate}
        />
      }
    </Box>
  )
}

export default UpdateStatus
