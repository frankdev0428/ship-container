import React, { ChangeEvent, FormEvent, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  BoxProps,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  TextField,
  FormControlLabel,
  Checkbox,
} from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import { NotListedLocation } from '@mui/icons-material'
import UpdateIcon from '@mui/icons-material/Edit'

import { LabeledDatePicker } from '../shared/LabeledDatePicker'
import Typography from '../Utils/Typography'
import { showError, showWarning } from '../../../store/error/actions'
import { getAutocompleteCustomers } from '../../../services/autocomplete/actions'
import { AppState } from '../../../store'
import { FakeCustomer } from '../../../services/autocomplete/types'
import FacilityAutocomplete from '../shared/Autocomplete/FacilityAutocomplete'
import { ContractStatusEnum, EquipmentLeasePatchInput, Lease } from '../../../services/lease/types'
import { updateLease } from '../../../services/lease/actions'

const commonProps = {
  variant: 'outlined' as any,
  margin: 'dense' as any,
  size: 'small' as any,
  style: { minWidth: 160 },
}

interface SelectableTextFieldProps {
  label: string;
  options: any[];
  value: any;
  hasLabeledOptions?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const SelectableTextField = ({ label, options, value, hasLabeledOptions, onChange }: SelectableTextFieldProps) => (
  <TextField
    id="outlined-select-lease-size"
    select
    label={label}
    value={value}
    onChange={onChange}
    {...commonProps}
  >
    {options.map((option) => (
      <MenuItem key={hasLabeledOptions ? option.value : option} value={hasLabeledOptions ? option.value : option}>
        {hasLabeledOptions ? option.label : option}
      </MenuItem>
    ))}
  </TextField>
)

interface PatchOrderDialogProps {
  orderId: string;
  pickupLocation?: string;
  dropoffLocation?: string;
  returnDate?: Date;
  executionDate?: Date;
  units?: number;
  customersBookingNumber?: string;
  status?: string;
  handleClose: () => void;
  handlePatch: (orderId: string, lease: EquipmentLeasePatchInput) => void;
}

const PatchOrderDialog = ({ orderId, pickupLocation, dropoffLocation, returnDate, executionDate, units, customersBookingNumber, status, handleClose, handlePatch }: PatchOrderDialogProps) => {
  const { companies, loadingStatus } = useSelector((state: AppState) => state.company)
  const [customer, setCustomer] = useState<{code: string; name: string; companyId: string} | null>(null)
  const [customerInput, setCustomerInput] = useState('')
  const [patchOrder, setPatchOrder] = useState<EquipmentLeasePatchInput>({
    pickupLocation: pickupLocation,
    dropoffLocation: dropoffLocation,
    returnDate: returnDate,
    executionDate: executionDate,
    units: units,
    customersBookingNumber: customersBookingNumber,
  })
  const [isAccepted, setIsAccepted] = useState(true)

  const _dispatch = useDispatch()

  const contractStatus = [
    { value: ContractStatusEnum.Ltl, label: 'Long term lease' },
    { value: ContractStatusEnum.Ael, label: 'Aeler' },
    { value: ContractStatusEnum.Owl, label: 'One way lease' },
    { value: ContractStatusEnum.Sal, label: 'Sale' },
  ]

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.stopPropagation()
    event.preventDefault()

    if (orderId === '') {
      _dispatch(showWarning(['Error']))
    } else if (patchOrder.units === 0) {
      _dispatch(showWarning(['Container units cannot be zero']))
    } else if (patchOrder.pickupLocation === '') {
      _dispatch(showWarning(['Need to select an Origin Facility']))
    } else if (patchOrder.dropoffLocation === '') {
      _dispatch(showWarning(['Need to select a Destination Facility']))
    } else {
      handlePatch(orderId, patchOrder)
    }
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string) => {
    const keyType = typeof patchOrder[key as keyof EquipmentLeasePatchInput]

    setPatchOrder({
      ...patchOrder,
      [key]: keyType === 'number' ? parseInt(event.target.value) : event.target.value,
    })
  }

  const handleChangeDate = (date: Date | null, key: 'executionDate' | 'returnDate') => {
    setPatchOrder({
      ...patchOrder,
      ...(date && { [key]: date }),
    })
  }

  const handleChangeLocation = (depot: string, key: 'pickupLocation' | 'dropoffLocation') => {
    console.log('depot', depot)
    setPatchOrder({
      ...patchOrder,
      [key]: depot,
    })
  }

  const handleDialogClick = (event: any) => {
    event.stopPropagation()
  }

  return (
    <Dialog open={true} maxWidth={'sm'} fullWidth onClose={handleClose} onClick={handleDialogClick}>
      <DialogTitle>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography variant={'h6'}>Update Order</Typography>
          {/* { loadingDepots && <CircularProgress sx={{ marginLeft: '16px' }} size={20} /> } */}
          <Box justifyContent={'flex-end'}>
            <IconButton size='small' onClick={handleClose}><ClearIcon/></IconButton>
          </Box>
        </Box>
        </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
            <Box display='flex' flexDirection='column' >
              <TextField required {...commonProps} variant='standard' disabled InputProps={{ readOnly: true }} label="Order Id" value={orderId} /* onChange={e => handleChange(e, 'id')} */ />
              <TextField {...commonProps} label="Customer's Booking Number" value={patchOrder.customersBookingNumber} onChange={e => handleChange(e, 'customersBookingNumber')} />
              <LabeledDatePicker
                label="Execution Date"
                value={patchOrder.executionDate || null}
                onChange={date => handleChangeDate(date, 'executionDate')}
              />
              <LabeledDatePicker
                label="Return Date"
                value={patchOrder.returnDate || null}
                onChange={date => handleChangeDate(date, 'returnDate')}
                minDate={patchOrder.executionDate}
              />
              {/* <SelectableTextField
                label={'Leasing Type'}
                options={contractStatus}
                value={patchOrder.contractStatus}
                hasLabeledOptions={true}
                onChange={e => handleChange(e, 'contractStatus')}
              /> */}
              <FacilityAutocomplete
                value={patchOrder.pickupLocation}
                label="Origin Facility"
                callback={(depot) => handleChangeLocation(depot as string, 'pickupLocation')}
                disabled={status === 'ONGOING' || status === 'OUTDATED'}

              />
              <FacilityAutocomplete
                value={patchOrder.dropoffLocation}
                label="Destination Facility"
                callback={(depot) => handleChangeLocation(depot as string, 'dropoffLocation')}
                disabled={status === 'ONGOING' || status === 'OUTDATED' || status === 'AELER-CANCELED' || status === 'CUSTOMER-CANCELED'}
              />
              <TextField {...commonProps} type='number' inputProps={{ min: 0 }} required label="Container Units" value={patchOrder.units === 0 ? '' : patchOrder.units} onChange={e => handleChange(e, 'units')} />
              {/* <FormControlLabel
                control={
                  <Checkbox
                  // disabled={true}
                  color='primary'
                  checked={isAccepted}
                  onChange={e => {
                    setIsAccepted(e.target.checked)
                  }}
                />
                }
                label={'Firm order (ACCEPTED)'}
              /> */}
            </Box>

        </DialogContent>
        <DialogActions>
          {/* <Button color='primary' onClick={handleClose}>Close</Button> */}
          <Button color='primary' variant='contained' type='submit' >Update</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

interface PatchOrderProps extends BoxProps {
  patchOrder: {
    orderId: string;
    returnDate?: Date;
    executionDate?: Date;
    units?: number;
    customersBookingNumber?: string;
    dropoffLocation?: string;
    pickupLocation?: string;
    status?: string;
  };
  // onPatch: (orderId: string, lease: EquipmentLeasePatchInput) => void
}

const PatchOrder = ({ patchOrder, ...boxProps }: PatchOrderProps) => {
  const [open, setOpen] = useState(false)

  const _dispatch = useDispatch()

  const onClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation()
    event.preventDefault()
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const onPatch = (orderId: string, lease: EquipmentLeasePatchInput) => {
    _dispatch(updateLease(orderId, lease))
  }

  const handlePatch = (orderId: string, lease: EquipmentLeasePatchInput) => {
    setOpen(false)
    onPatch(orderId, lease)
  }

  return (
    <Box {...boxProps} >
      <IconButton color='primary' size='small' onClick={onClick}>
        <UpdateIcon/>
      </IconButton>
      {
        open && <PatchOrderDialog
          orderId={patchOrder.orderId}
          pickupLocation={patchOrder.pickupLocation}
          dropoffLocation={patchOrder.dropoffLocation}
          returnDate={patchOrder.returnDate}
          executionDate={patchOrder.executionDate}
          status={patchOrder.status}
          units={patchOrder.units}
          customersBookingNumber={patchOrder.customersBookingNumber}
          handleClose={handleClose}
          handlePatch={handlePatch}
        />
      }
    </Box>
  )
}

export default PatchOrder
