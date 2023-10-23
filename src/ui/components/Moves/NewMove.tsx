import React, { ChangeEvent, FormEvent, useState } from 'react'
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
  Grid,
  Autocomplete,
  BaseTextFieldProps,
} from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import { useDispatch, useSelector } from 'react-redux'

import { LabeledDatePicker } from '../shared/LabeledDatePicker'
import Typography from '../Utils/Typography'
import { showError, showWarning } from '../../../store/error/actions'
import { EquipmentMoveInput, EquipmentMoveInputMoveTypeEnum, ExchangeLocationInput } from '../../../apis-client'
import FacilityAutocomplete from '../shared/Autocomplete/FacilityAutocomplete'
import { AppState } from '../../../store'
import NewLocation from '../Locations/NewLocation'
import { addLocation } from '../../../services/places/actions'
import { createNewLocation } from '../../../services/thunks'

const commonProps = {
  variant: 'outlined' as any,
  margin: 'dense' as any,
  size: 'small' as any,
  style: { minWidth: 160 },
}

interface SelectableTextFieldProps extends BaseTextFieldProps {
  label: string;
  options: any[];
  value: any;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  hasLabeledOptions?: boolean;
  disabled?: boolean;
}

const SelectableTextField = ({ label, options, value, onChange, hasLabeledOptions, disabled, ...restProps }: SelectableTextFieldProps) => (
  <TextField
    id="outlined-select-container-size"
    select
    label={label}
    value={value}
    onChange={onChange}
    disabled={disabled || false}
    {...commonProps}
    {...restProps}
  >
    {options.map((option) => (
      <MenuItem key={hasLabeledOptions ? option.value : option} value={hasLabeledOptions ? option.value : option}>
        {hasLabeledOptions ? option.label : option}
      </MenuItem>
    ))}
  </TextField>
)

interface NewMoveDialogProps {
  equipmentId?: string;
  equipments: {value: string, label: string}[];
  equipmentsWithLeases: {equipmentId: string, leases: {value: string, label: string}[]}[];
  orders?: string[];
  handleClose: () => void;
  handleCreate: (move: EquipmentMoveInput, isActual: boolean) => void;
}

const NewMoveDialog = ({ equipmentId, equipments, equipmentsWithLeases, orders, handleClose, handleCreate }: NewMoveDialogProps) => {
  // const [availabilityDate, setAvailabilityDate] = useState<Date | null>(new Date())
  const [newMove, setNewMove] = useState<EquipmentMoveInput>({
    equipmentId: equipmentId || '',
    pickupDate: new Date(),
    dropoffDate: undefined,
    moveType: EquipmentMoveInputMoveTypeEnum.Ship,
    equipmentLeaseContractId: undefined,
    originId: undefined,
    destinationId: undefined,
    customerId: undefined,
  })
  const [isActual, setIsActual] = useState(false)
  const [customerInput, setCustomerInput] = useState('')
  const [customer, setCustomer] = useState<{code: string; name: string; companyId: string} | null>(null)
  const [orderId, setOrderId] = useState<string | undefined>(undefined)
  const [ordersOpt, setOrderOpts] = useState<{value: string, label: string}[]>(equipmentId ? equipmentsWithLeases.find(e => e.equipmentId === equipmentId)?.leases || [] : [])
  const { companies, loadingStatus } = useSelector((state: AppState) => state.company)

  const _dispatch = useDispatch()

  const moveTypes = [
    EquipmentMoveInputMoveTypeEnum.Repo,
    EquipmentMoveInputMoveTypeEnum.Mnr,
    EquipmentMoveInputMoveTypeEnum.Ship,
  ]

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.stopPropagation()
    event.preventDefault()

    if (newMove.equipmentId === '') {
      _dispatch(showWarning(['Need to select equipment ID']))
    } else if (!newMove.originId) {
      _dispatch(showWarning(['Need to select an Pickup Facility']))
    } else if (!newMove.destinationId) {
      _dispatch(showWarning(['Need to select a Dropoff Facility']))
    } else {
      handleCreate({
        ...newMove,
        ...(orderId && { equipmentLeaseContractId: orderId }),
      }, isActual)
    }
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string) => {
    setNewMove({
      ...newMove,
      [key]: event.target.value,
    })
  }

  const handleChangeDate = (date: Date | null) => {
    setNewMove({
      ...newMove,
      ...(date && { pickupDate: date }),
    })
  }

  const handleChangeDateDropoff = (date: Date | null) => {
    setNewMove({
      ...newMove,
      ...(date && { dropoffDate: date }),
    })
  }

  const handleCreateLocation = (callback: (loc?: string) => void) => (location: ExchangeLocationInput) => {
    // _dispatch(addLocation(location))
    _dispatch(createNewLocation(location, callback))
  }

  // const handleChangeDateActual = (date: MaterialUiPickersDate) => {
  //   setNewMove({
  //     ...newMove,
  //     ...date && { depotAvailabilityDateActual: date },
  //   })
  // }

  const handleChangeCustomer = (e: any, customer: any) => {
    setCustomer(customer)
    // const id = `${newOrder.contractStatus}-${moment(newOrder.executionDate).format('YYYY-MM-DD')}-${customer?.code}`
    setNewMove({
      ...newMove,
      // orderId: id,
      customerId: customer.companyId,
    })
  }

  const handleChangeOrder = (e: any) => {
    setOrderId(e.target.value)
    // setNewMove({
    //   ...newMove,
    //   // orderId: id,
    //   customerId: customer.companyId,
    // })
  }

  const handleChangeContainer = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const equipmentId = e.target.value
    setNewMove({
      ...newMove,
      equipmentId: equipmentId,
    })
    const opts = equipmentId ? equipmentsWithLeases.find(e => e.equipmentId === equipmentId)?.leases || [] : []
    setOrderOpts(opts)
    setOrderId(undefined)
  }

  return (
    <Dialog open={true} maxWidth={'sm'} fullWidth onClose={handleClose} >
      <DialogTitle>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography variant={'h6'}>New Move</Typography>
          {/* { loadingDepots && <CircularProgress sx={{ marginLeft: '16px' }} size={20} /> } */}
          <Box justifyContent={'flex-end'}>
            <IconButton size='small' onClick={handleClose}><ClearIcon/></IconButton>
          </Box>
        </Box>
        </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
            <Box display='flex' flexDirection='column' >
              <SelectableTextField
                required
                label={'Equipment ID'}
                hasLabeledOptions={true}
                options={equipments}
                value={newMove.equipmentId || ''}
                onChange={handleChangeContainer}
              />
              <SelectableTextField
                label={'Move type'}
                options={moveTypes}
                value={newMove.moveType}
                onChange={e => handleChange(e, 'moveType')}
              />
              <SelectableTextField
                label={'Order Id'}
                hasLabeledOptions={true}
                options={ordersOpt}
                value={orderId || ''}
                onChange={handleChangeOrder}
                disabled={ordersOpt.length === 0}
              />
              <LabeledDatePicker
                label="Pickup date"
                value={newMove.pickupDate}
                onChange={date => handleChangeDate(date)}
              />
              <LabeledDatePicker
                label="Dropoff date"
                value={newMove.dropoffDate || null}
                onChange={date => handleChangeDateDropoff(date)}
                minDate={newMove.pickupDate}
              />
              <Grid container alignItems="center">
                <Grid item xs={9}>
                  <FacilityAutocomplete value={newMove.originId} isLocationsAutocomplete={true} label={'Pickup location'} callback={(depot) => setNewMove({
                    ...newMove,
                    originId: depot as string,
                  })}/>
                </Grid>
                <Grid item xs={3}>
                  <NewLocation label={'New'} isNotDialog={true} name={undefined} onCreate={handleCreateLocation((loc?: string) => {
                    setNewMove({
                      ...newMove,
                      originId: loc,
                    })
                  })}
                  />
                </Grid>
              </Grid>
              <Grid container alignItems="center">
                <Grid item xs={9}>
                  <FacilityAutocomplete value={newMove.destinationId} isLocationsAutocomplete={true} label={'Dropoff location'} callback={(depot) => setNewMove({
                    ...newMove,
                    destinationId: depot as string,
                  })}/>
                </Grid>
                <Grid item xs={3}>
                  <NewLocation label={'New'} isNotDialog={true} name={undefined} onCreate={handleCreateLocation((loc?: string) => {
                    setNewMove({
                      ...newMove,
                      destinationId: loc,
                    })
                  })}
                  />
                </Grid>
              </Grid>
              {/* <FacilityAutocomplete label={'Dropoff depot'} callback={(depot) => setNewMove({
                ...newMove,
                destinationId: depot as string,
              })}/> */}
              <Autocomplete
                id="customer-input"
                freeSolo
                getOptionLabel={(option) => typeof option !== 'string' ? option.name : '' }
                value={customer}
                onChange={handleChangeCustomer}
                inputValue={customerInput}
                onInputChange={(event, newInputValue) => {
                  setCustomerInput(newInputValue)
                }}
                options={companies}
                renderInput={(params) => (
                  <TextField {...params} required {...commonProps} label="Customer" margin="normal" variant="outlined" />
                )}
              />
            </Box>
        </DialogContent>
        <DialogActions>
          {/* <Button color='primary' onClick={handleClose}>Close</Button> */}
          <Button color='primary' variant='contained' type='submit' >Create</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

interface NewMoveProps extends BoxProps {
  equipmentId?: string;
  equipments: {value: string, label: string}[];
  equipmentsWithLeases: {equipmentId: string, leases: {value: string, label: string}[]}[];
  onCreate: (container: EquipmentMoveInput) => void
}

const NewMove = ({ equipmentId, onCreate, equipments, equipmentsWithLeases, ...boxProps }: NewMoveProps) => {
  const [open, setOpen] = useState(false)

  const handleCreate = (move: EquipmentMoveInput, isActual: boolean) => {
    setOpen(false)
    onCreate({
      ...move,
      // ...isActual ? { depotAvailabilityDateActual: container.depotAvailabilityDateActual } : { depotAvailabilityDateActual: undefined },
    })
  }

  return (
    <Box {...boxProps} >
      <Button variant='contained' color='primary' size='small' disabled={false} onClick={() => setOpen(true)}>
        New Move
      </Button>
      { open && <NewMoveDialog equipmentId={equipmentId} equipments={equipments} equipmentsWithLeases={equipmentsWithLeases} handleClose={() => setOpen(false)} handleCreate={handleCreate}/>}
    </Box>
  )
}

export default NewMove
