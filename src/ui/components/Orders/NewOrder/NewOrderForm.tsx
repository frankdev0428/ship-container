import { Box, Grid } from '@mui/material'
import { DateRange } from '@mui/x-date-pickers-pro'
import React, { ChangeEvent, useState } from 'react'
import { useSelector } from 'react-redux'

import { ContractStatusEnum, EquipmentLeaseInput } from '../../../../services/lease/types'
import { AppState } from '../../../../store'
import AutoCompleteFieldControlled from '../../shared/Autocomplete/AutocompleteFieldControlled'
import FacilityAutocomplete from '../../shared/Autocomplete/FacilityAutocomplete'
import GridField from '../../shared/Form/FormGridField'
import GridPicker from '../../shared/Form/FormGridPicker'
import LabeledDateRangePicker from '../../shared/LabeledDateRangePicker'
import { getTimeLabel } from '../../shared/utils'

import { FormErrorsProps } from './NewOrderButton'

const commonProps = {
  variant: 'outlined' as any,
  margin: 'dense' as any,
  size: 'small' as any,
  style: { minWidth: 160 },
}

const contractStatus = [
  { value: ContractStatusEnum.Ltl, label: 'Long term lease' },
  { value: ContractStatusEnum.Ael, label: 'Aeler' },
  { value: ContractStatusEnum.Owl, label: 'One way lease' },
  { value: ContractStatusEnum.Sal, label: 'Sale' },
]

interface NewOrderFormProps {
  newOrder: EquipmentLeaseInput
  formErrors: FormErrorsProps;
  handleChangeFormErrors: (newFormErrors: FormErrorsProps) => void;
  onChange: (order: EquipmentLeaseInput) => void
}

const NewOrderForm = ({ newOrder, formErrors, handleChangeFormErrors, onChange }: NewOrderFormProps): JSX.Element => {
  const [customer, setCustomer] = useState<{code: string; name: string; companyId: string} | null>(null)
  const companies = useSelector((state: AppState) => state.company.companies)

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string) => {
    const keyType = typeof newOrder[key as keyof EquipmentLeaseInput]

    onChange({
      ...newOrder,
      orderId: newOrder.orderId,
      [key]: keyType === 'number' ? parseInt(event.target.value) : event.target.value,
    })
    if (key === 'units' && event.target.value !== '' && event.target.value) {
      handleChangeFormErrors({ ...formErrors, [key]: false })
    }
  }

  const handleChangeContractStatus = (value: string | null) => {
    onChange({
      ...newOrder,
      orderId: `${customer?.code || 'XXXX'}-${getTimeLabel(newOrder.executionDate, 'yearFistDate')}-${value}`,
      contractStatus: value as ContractStatusEnum as any,
    })
  }

  const handleChangeLocation = (depot: string, key: 'pickupLocation' | 'dropoffLocation') => {
    onChange({
      ...newOrder,
      [key]: depot,
    })
    handleChangeFormErrors({ ...formErrors, [key]: false })
  }

  const handleChangeCustomer = (customer: {value: string, label: string, code: string }) => {
    setCustomer({ name: customer.label, code: customer.code, companyId: customer.value })
    const id = `${customer?.code || 'XXXX'}-${getTimeLabel(newOrder.executionDate, 'yearFistDate')}-${newOrder.contractStatus}`
    onChange({
      ...newOrder,
      orderId: id,
      customerId: customer.value,
    })
    handleChangeFormErrors({ ...formErrors, customerId: false })
  }

  const handleChangeDateRange = (date: DateRange<Date>) => {
    onChange({
      ...newOrder,
      executionDate: date[0] || new Date(),
      returnDate: date[1] || new Date(),
    })
  }

  return (
    <Box display='flex' flexDirection='column' width='100%'>
      <Grid container columnSpacing={2} display='flex' flexDirection='row' alignItems='center'>
        <Grid item xs={6}>
          <AutoCompleteFieldControlled
            {...commonProps}
            label={'Customer'}
            freeSolo
            onChange={handleChangeCustomer}
            value={newOrder.customerId}
            options={companies.map((c) => ({ value: c.companyId, label: c.name, code: c.code }))}
            openOnFocus={false}
            error={formErrors.customerId}
            TextFieldProps={{ required: true, helperText: formErrors.customerId ? 'Mandatory field.' : undefined }}
          />
        </Grid>
        <GridPicker
          {...commonProps}
          label={'Leasing Type'}
          options={contractStatus}
          value={newOrder.contractStatus}
          onChange={e => handleChangeContractStatus(e)}
          itemSize={6}
          required={true}
        />
      </Grid>
        <LabeledDateRangePicker
          required={true}
          labelStart='Collection date'
          labelEnd='Return date'
          onChange={handleChangeDateRange}
          value={[newOrder.executionDate, newOrder.returnDate]}
        />
      <Grid container columnSpacing={2} display='flex' flexDirection='row'>
        <Grid item xs={6}>
          <FacilityAutocomplete
            required={true}
            label="Collection location"
            value={newOrder.pickupLocation}
            callback={(depot) => handleChangeLocation(depot as string, 'pickupLocation')}
            TextFieldProps={{
              required: true,
              helperText: formErrors.dropoffLocation ? 'Mandatory field.' : undefined,
              error: formErrors.pickupLocation,
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <FacilityAutocomplete
            required={true}
            label="Return location"
            value={newOrder.dropoffLocation}
            callback={(depot) => handleChangeLocation(depot as string, 'dropoffLocation')}
            TextFieldProps={{
              required: true,
              error: formErrors.dropoffLocation,
              helperText: formErrors.dropoffLocation ? 'Mandatory field.' : undefined,
            }}

          />
        </Grid>
      </Grid>
      <Grid container columnSpacing={2} display='flex' flexDirection='row'>
        <GridField
          fullWidth
          {...commonProps}
          type='number'
          inputProps={{ min: 0 }}
          required={true}
          label="Container Units"
          value={newOrder.units === 0 ? '' : newOrder.units}
          onChange={e => handleChange(e, 'units')}
          itemSize={6}
          error={formErrors.units}
          helperText={formErrors.units ? 'Mandatory field.' : undefined}
        />
        <GridField
          fullWidth
          {...commonProps}
          label="Customer's Booking Number"
          value={newOrder.customersBookingNumber}
          onChange={e => handleChange(e, 'customersBookingNumber')}
          itemSize={6}
        />
      </Grid>
    </Box>
  )
}

export default NewOrderForm
