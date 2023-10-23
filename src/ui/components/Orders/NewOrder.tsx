import React, { ChangeEvent, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  BoxProps,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  TextField,
  FormControlLabel,
  Checkbox,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Autocomplete,
  CircularProgress,
} from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import moment from 'moment'

import { LabeledDatePicker } from '../shared/LabeledDatePicker'
import Typography from '../Utils/Typography'
import { showError, showWarning } from '../../../store/error/actions'
import { getAutocompleteCustomers } from '../../../services/autocomplete/actions'
import { AppState } from '../../../store'
import FacilityAutocomplete from '../shared/Autocomplete/FacilityAutocomplete'
import { ContractStatusEnum, EquipmentLeaseInput, OrderStatusEnum } from '../../../services/lease/types'
import { allocateContainers } from '../../../services/thunks'
import { getTimeLabel } from '../shared/utils'

import Allocate from './Allocate'

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
    id="outlined-select-container-size"
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

const steps = [
  {
    label: 'Create order',
    description: 'eheh',
  },
  {
    label: 'Allocate',
    description: 'uhuh',
  },
]

interface NewOrderDialogProps {
  handleClose: () => void;
  handleCreate: (container: EquipmentLeaseInput, status?: OrderStatusEnum) => Promise<any>;
}

const NewOrderDialog = ({ handleClose, handleCreate }: NewOrderDialogProps) => {
  const { companies, loadingStatus } = useSelector((state: AppState) => state.company)
  const { isCreatingLease } = useSelector((state: AppState) => state.lease)
  const [customer, setCustomer] = useState<{code: string; name: string; companyId: string} | null>(null)
  const [customerInput, setCustomerInput] = useState('')
  const [newOrder, setNewOrder] = useState<EquipmentLeaseInput>({
    orderId: `XXXX-${getTimeLabel(new Date(), 'yearFistDate')}-${ContractStatusEnum.Ael}`,
    customerId: '',
    timePlaced: new Date(),
    returnDate: new Date(),
    pickupLocation: '',
    dropoffLocation: '',
    executionDate: new Date(),
    contractStatus: ContractStatusEnum.Ael as any,
    units: 0,
    customersBookingNumber: undefined,
  })
  const [isAccepted, setIsAccepted] = useState(true)
  const [createdOrder, setCreatedOrder] = useState<any /** FIXME: Lease */ | undefined>(undefined)

  const [activeStep, setActiveStep] = React.useState(0)

  // const handleNext = () => {
  //   setActiveStep((prevActiveStep) => prevActiveStep + 1)
  // }

  const _dispatch = useDispatch()

  const contractStatus = [
    { value: ContractStatusEnum.Ltl, label: 'Long term lease' },
    { value: ContractStatusEnum.Ael, label: 'Aeler' },
    { value: ContractStatusEnum.Owl, label: 'One way lease' },
    { value: ContractStatusEnum.Sal, label: 'Sale' },
  ]

  const handleSubmit = (event: any /** FIXME */) => {
    event.stopPropagation()
    event.preventDefault()

    if (newOrder.orderId === '' && newOrder.customerId === '') {
      _dispatch(showWarning(['Need to input customerId']))
    } else if (newOrder.units === 0) {
      _dispatch(showWarning(['Container units cannot be zero']))
    } else if (newOrder.pickupLocation === '') {
      _dispatch(showWarning(['Need to select an Origin Facility']))
    } else if (newOrder.dropoffLocation === '') {
      _dispatch(showWarning(['Need to select a Destination Facility']))
    } else {
      handleCreate({ ...newOrder, timePlaced: new Date() }, isAccepted ? 'ACCEPTED' as any : undefined)
        .then(o => {
          // console.log(o)
          const cOrder = {
            ...o.payload,
            dateFrom: o.payload.executionDate,
            dateTo: o.payload.returnDate,
            facilityFrom: o.payload.pickupLocation,
          }
          o.type === 'CREATE_LEASE_SUCCESS' && setCreatedOrder(cOrder)
        })
    }
  }

  const toAllocateStep = (e: any) => {
    setActiveStep(1)
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string) => {
    let id = newOrder.orderId

    switch (key) {
      case 'contractStatus':
        id = `${customer?.code || 'XXXX'}-${getTimeLabel(newOrder.executionDate, 'yearFistDate')}-${event.target.value}`
        break
      case 'customerId':
        _dispatch(getAutocompleteCustomers({ startswith: event.target.value }))
        break
      default:
    }

    const keyType = typeof newOrder[key as keyof EquipmentLeaseInput]

    setNewOrder({
      ...newOrder,
      orderId: id,
      [key]: keyType === 'number' ? parseInt(event.target.value) : event.target.value,
    })
  }

  const handleChangeDate = (date: Date | null, key: 'executionDate' | 'returnDate') => {
    const id = key === 'executionDate'
      ? `${customer?.code || 'XXXX'}-${moment(date).format('YY-MM-DD')}-${newOrder.contractStatus}`
      : newOrder.orderId

    setNewOrder({
      ...newOrder,
      orderId: id,
      ...(date && { [key]: date }),
    })
  }

  const handleChangeLocation = (depot: string, key: 'pickupLocation' | 'dropoffLocation') => {
    console.log('depot', depot)
    setNewOrder({
      ...newOrder,
      [key]: depot,
    })
  }

  const handleChangeCustomer = (e: any, customer: any) => {
    setCustomer(customer)
    const id = `${customer?.code || 'XXXX'}-${getTimeLabel(newOrder.executionDate, 'yearFistDate')}-${newOrder.contractStatus}`
    setNewOrder({
      ...newOrder,
      orderId: id,
      customerId: customer.companyId,
    })
  }

  const handleAllocate = (equipments: string[]) => {
    const orderId = createdOrder?.orderId
    if (orderId) {
      _dispatch(allocateContainers(equipments, { orderId }))
        .then((a: any) => {
          handleClose()
        })
    } else {
      _dispatch(showError(['Must choose one single order']))
    }
  }

  return (
    <Dialog open={true} maxWidth={'xl'} fullWidth onClose={handleClose} >
      <DialogTitle>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography variant={'h6'}>New Order</Typography>
          {/* { loadingDepots && <CircularProgress sx={{ marginLeft: '16px' }} size={20} /> } */}
          <Box justifyContent={'flex-end'}>
            <IconButton size='small' onClick={handleClose}><ClearIcon/></IconButton>
          </Box>
        </Box>
        </DialogTitle>
      {/* <form> */}
        <DialogContent>
          <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
                      <Step key={step.label}>
                      <StepLabel
                        optional={
                          index === 2
                            ? (
                            <Typography variant="caption">Last step</Typography>
                              )
                            : null
                        }
                      >
                        {step.label}
                      </StepLabel>
                      <StepContent>
              {index === 0 && (<Box display='flex' flexDirection='column' >
                <TextField required {...commonProps} variant='standard' disabled InputProps={{ readOnly: true }} label="Order Id" value={newOrder.orderId} /* onChange={e => handleChange(e, 'id')} */ />
                <Autocomplete
                  id="customer-input"
                  freeSolo
                  getOptionLabel={(option) => typeof option !== 'string' ? option.name : '' }
                  value={customer}
                  onChange={handleChangeCustomer}
                  inputValue={customerInput}
                  onInputChange={(event, newInputValue) => {
                    setCustomerInput(newInputValue)
                    // _dispatch(getAutocompleteCustomers({ startswith: newInputValue }))
                  }}
                  options={companies}
                  renderInput={(params) => (
                    <TextField {...params} required {...commonProps} label="Customer" margin="normal" variant="outlined" />
                  )}
                />
                <LabeledDatePicker
                  label="Execution Date"
                  value={newOrder.executionDate}
                  onChange={date => handleChangeDate(date, 'executionDate')}
                  textFieldProps={{ size: 'small' }}
                />
                <LabeledDatePicker
                  label="Return Date"
                  value={newOrder.returnDate}
                  minDate={newOrder.executionDate}
                  onChange={date => handleChangeDate(date, 'returnDate')}
                  textFieldProps={{ size: 'small' }}
                />
                <SelectableTextField
                  label={'Leasing Type'}
                  options={contractStatus}
                  value={newOrder.contractStatus}
                  hasLabeledOptions={true}
                  onChange={e => handleChange(e, 'contractStatus')}
                />
                <FacilityAutocomplete label="Origin Facility" callback={(depot) => handleChangeLocation(depot as string, 'pickupLocation')}/>
                <FacilityAutocomplete label="Destination Facility" callback={(depot) => handleChangeLocation(depot as string, 'dropoffLocation')}/>
                <TextField {...commonProps} type='number' inputProps={{ min: 0 }} required label="Container Units" value={newOrder.units === 0 ? '' : newOrder.units} onChange={e => handleChange(e, 'units')} />
                <TextField {...commonProps} label="Customer's Booking Number" value={newOrder.customersBookingNumber} onChange={e => handleChange(e, 'customersBookingNumber')} />
                <FormControlLabel
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
                />
                <Box>
                  <Button color='primary' variant='contained' onClick={handleSubmit} disabled={createdOrder?.orderId !== undefined} >Create</Button>
                  {isCreatingLease && <CircularProgress size={20} />}
                  <Button color='primary' variant='contained' onClick={toAllocateStep} disabled={!(isAccepted && createdOrder?.orderId !== undefined)} >Allocate</Button>
                </Box>
              </Box>
              )}
              {index === 1 && (
                <Box>
                    <Allocate
                      noDialog={true}
                      onAllocate={handleAllocate}
                      allocationOrder={createdOrder}
                    />
                </Box>
              )}
              </StepContent>
              </Step>
          ))}
            </Stepper>
        </DialogContent>
        {/* <DialogActions>
          <Button color='primary' variant='contained' type='submit' onClick={handleSubmit('WITHOUT_ALLOC')} >Create without allocation</Button>
          <Button color='primary' variant='contained' type='submit' onClick={handleSubmit('WITH_ALLOC')} disabled={!isAccepted} >Create then allocate</Button>
        </DialogActions> */}
      {/* </form> */}
    </Dialog>
  )
}

interface NewOrderProps extends BoxProps {

  onCreate: (container: EquipmentLeaseInput, status?: OrderStatusEnum) => Promise<any>
}

const NewOrder = ({ onCreate, ...boxProps }: NewOrderProps) => {
  const [open, setOpen] = useState(false)

  const handleCreate = (container: EquipmentLeaseInput, status?: OrderStatusEnum) => {
    // setOpen(false)
    return onCreate(container, status)
  }

  return (
    <Box {...boxProps} >
      <Button variant='contained' color='primary' size='small' disabled={false} onClick={() => setOpen(true)}>
        New Order
      </Button>
      { open && <NewOrderDialog handleClose={() => setOpen(false)} handleCreate={handleCreate}/>}
    </Box>
  )
}

export default NewOrder
