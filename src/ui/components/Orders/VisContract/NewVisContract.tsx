/* eslint-disable no-useless-escape */
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
  FormControlLabel,
  Grid,
  Checkbox,
  Autocomplete,
} from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import { useDispatch, useSelector } from 'react-redux'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Visibility'
import UpdateIcon from '@mui/icons-material/Edit'

import Typography from '../../Utils/Typography'
import { showError, showWarning } from '../../../../store/error/actions'
import { LeaseVisibilityInput } from '../../../../apis-client'
import { addVisibilityContract, updateVisibilityContracts } from '../../../../services/lease/actions'
import { AppState } from '../../../../store'
import { LeaseVisibilityContract } from '../../../../services/lease/types'
import LabeledDateTimePicker from '../../shared/LabeledDateTimePicker'

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
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  hasLabeledOptions?: boolean;
  disabled?: boolean;
}

const SelectableTextField = ({ label, options, value, onChange, hasLabeledOptions, disabled }: SelectableTextFieldProps) => (
  <TextField
    id="outlined-select-container-size"
    select
    label={label}
    value={value}
    onChange={onChange}
    disabled={disabled || false}
    {...commonProps}
  >
    {options.map((option) => (
      <MenuItem key={hasLabeledOptions ? option.value : option} value={hasLabeledOptions ? option.value : option}>
        {hasLabeledOptions ? option.label : option}
      </MenuItem>
    ))}
  </TextField>
)

interface NewVisContractDialogProps {
  isUpdateForm?: boolean;
  handleClose: () => void;
  handleCreate: (contract: LeaseVisibilityInput) => void;
  handleUpdate: (contract: LeaseVisibilityInput) => void;
  contract?: Partial<LeaseVisibilityContract>;
}

const NewVisContractDialog = ({ handleClose, handleCreate, handleUpdate, isUpdateForm, contract }: NewVisContractDialogProps) => {
  const { companies, loadingStatus } = useSelector((state: AppState) => state.company)
  const [customer, setCustomer] = useState<{code: string; name: string; companyId: string} | null>(companies.find(c => c.companyId === contract?.customerId) || null)
  const [customerInput, setCustomerInput] = useState('')

  const [newVisContract, setNewVisContract] = useState<LeaseVisibilityInput>({
    customerId: contract?.customerId || '',
    startAt: contract?.startAt || undefined,
    stopAt: contract?.stopAt || undefined,
    isSameDatesAsLease: contract?.isSameDatesAsLease !== undefined ? contract?.isSameDatesAsLease : undefined,
    isSameDatesAsStatus: contract?.isSameDatesAsStatus !== undefined ? contract?.isSameDatesAsStatus : (!isUpdateForm),
    isActive: contract?.isActive !== undefined ? contract?.isActive : (!isUpdateForm),
  })
  const _dispatch = useDispatch()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.stopPropagation()
    event.preventDefault()

    if (newVisContract.customerId === '') {
      _dispatch(showWarning(['Need to set customer']))
    } else {
      if (isUpdateForm) {
        handleUpdate({
          ...newVisContract,
        })
      } else {
        handleCreate({
          ...newVisContract,
        })
      }
    }
  }

  const handleChangeDate = (date: Date | null, key: 'startAt' | 'stopAt') => {
    setNewVisContract({
      ...newVisContract,
      ...(date && { [key]: date }),
    })
  }

  const handleChangeCustomer = (e: any, customer: any) => {
    setCustomer(customer)
    setNewVisContract({
      ...newVisContract,
      customerId: customer.companyId,
    })
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string) => {
    setNewVisContract({
      ...newVisContract,
      [key]: event.target.value,
    })
  }

  return (
    <Dialog open={true} maxWidth={'sm'} fullWidth onClose={handleClose} >
      <DialogTitle>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography variant={'h6'}>{isUpdateForm ? 'Edit' : 'New'} Visibility Contract</Typography>
          {/* { loadingDepots && <CircularProgress sx={{ marginLeft: '16px' }} size={20} /> } */}
          <Box justifyContent={'flex-end'}>
            <IconButton size='small' onClick={handleClose}><ClearIcon/></IconButton>
          </Box>
        </Box>
        </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
            <Box display='flex' flexDirection='column' >
              <Autocomplete
                id="customer-input"
                freeSolo
                disabled={contract?.customerId !== undefined} // if a customer is provided, we cannot change it
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
              <LabeledDateTimePicker
                label="Start visibility"
                value={newVisContract.startAt || null}
                onChange={date => handleChangeDate(date, 'startAt')}
              />
              <LabeledDateTimePicker
                label="Stop visibility"
                value={newVisContract.stopAt || null}
                onChange={date => handleChangeDate(date, 'stopAt')}
                minDate={newVisContract.startAt}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    color='primary'
                    checked={newVisContract.isSameDatesAsLease}
                    onChange={e => setNewVisContract({
                      ...newVisContract,
                      isSameDatesAsLease: (e.target as any).checked,
                    })}
                  />
                }
                label={'isSameDatesAsLease'}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    color='primary'
                    checked={newVisContract.isSameDatesAsStatus}
                    onChange={e => setNewVisContract({
                      ...newVisContract,
                      isSameDatesAsStatus: (e.target as any).checked,
                    })}
                  />
                }
                label={'isSameDatesAsStatus'}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    color='primary'
                    checked={newVisContract.isActive}
                    onChange={e => setNewVisContract({
                      ...newVisContract,
                      isActive: (e.target as any).checked,
                    })}
                  />
                }
                label={'isActive'}
              />
            </Box>
        </DialogContent>
        <DialogActions>
          {/* <Button color='primary' onClick={handleClose}>Close</Button> */}
          <Button color='primary' variant='contained' type='submit' >{isUpdateForm ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

interface NewVisContractProps extends BoxProps {
  equipmentLeaseContractId: string;
  visibilityContractId?: string;
  isUpdateForm?: boolean;
  contract?: Partial<LeaseVisibilityContract>;
}

const NewVisContract = ({ equipmentLeaseContractId, visibilityContractId, isUpdateForm, contract, ...boxProps }: NewVisContractProps) => {
  const [open, setOpen] = useState(false)

  const _dispatch = useDispatch()

  const onCreate = (equipmentLeaseContractId: string, contract: LeaseVisibilityInput) => {
    _dispatch(addVisibilityContract(equipmentLeaseContractId, contract))
  }

  const onUpdate = (contractId: string, equipmentLeaseContractId: string, contract: LeaseVisibilityInput) => {
    _dispatch(updateVisibilityContracts(equipmentLeaseContractId, contractId, contract))
  }

  const handleCreate = (contract: LeaseVisibilityInput) => {
    setOpen(false)
    onCreate(equipmentLeaseContractId, contract)
  }

  const handleUpdate = (contract: LeaseVisibilityInput) => {
    setOpen(false)
    onUpdate(visibilityContractId || 'FIXME', equipmentLeaseContractId, contract)
  }

  return (
    <Box {...boxProps} >
      {/* <Button variant='contained' color='primary' size='small' disabled={false} onClick={() => setOpen(true)}>
        New Move Cost
      </Button> */}
      <IconButton size='small' color='primary' onClick={() => setOpen(true)}>
        {isUpdateForm ? <UpdateIcon /> : <AddIcon />}
      </IconButton>
      { open && <NewVisContractDialog handleClose={() => setOpen(false)} handleCreate={handleCreate} handleUpdate={handleUpdate} isUpdateForm={isUpdateForm} contract={contract}/>}
    </Box>
  )
}

export default NewVisContract
