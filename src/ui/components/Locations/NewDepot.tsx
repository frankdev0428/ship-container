import React, { ChangeEvent, FormEvent, useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  TextField,
  Popover,
  Grid,
  OutlinedInput,
  Chip,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  BoxProps,
} from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import { useDispatch, useSelector } from 'react-redux'

import Typography from '../Utils/Typography'
import { showError } from '../../../store/error/actions'
import { AppState } from '../../../store'
import { AddressRegionEnum, FacilityInput, DepotPartnershipTypesEnum, FacilityWithLocTypeEnum } from '../../../apis-client/svc-places'
import CountryAutocomplete from '../shared/Autocomplete/CountryAutocomplete'
import AddressAutocomplete from '../shared/Autocomplete/AddressAutocomplete'
import CityAutocomplete from '../shared/Autocomplete/CityAutocomplete'

const commonProps = {
  variant: 'outlined' as any,
  margin: 'dense' as any,
  size: 'small' as any,
  style: { minWidth: 160 },
  fullWidth: true,
}

interface SelectableTextFieldProps {
  label: string;
  options: any[];
  value: any;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  hasLabeledOptions?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  selectAll?: boolean;
}

const SelectableTextField = ({ label, options, value, onChange, hasLabeledOptions, disabled, multiple, selectAll }: SelectableTextFieldProps) => (
  <TextField
    id="outlined-select-container-size"
    select
    label={label}
    value={value}
    onChange={onChange}
    disabled={disabled || false}
    {...commonProps}
    SelectProps={{
      ...(multiple && {
        multiple: multiple,
        // input: <OutlinedInput id="select-multiple-chip" label="Chip" />,
        // renderValue: (selected) => (
        //   <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
        //     {(selected as any[]).map((option) => (
        //       <Chip key={hasLabeledOptions ? option.value : option} label={hasLabeledOptions ? option.label : option} />
        //     ))}
        //   </Box>
        // ),
      }),
      MenuProps: {
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'left',
        },
        transformOrigin: {
          vertical: 'top',
          horizontal: 'left',
        },
        // getContentAnchorEl: null,
      },
    }}
  >
    {options.map((option) => (
      <MenuItem key={hasLabeledOptions ? option.value : option} value={hasLabeledOptions ? option.value : option}>
        {hasLabeledOptions ? option.label : option}
      </MenuItem>
    ))}
    {
      selectAll && <MenuItem key={'all'} value={'all'}>
      {'Select all'}
    </MenuItem>
    }
  </TextField>
)

interface MultiSelectProps {
  label: string;
  options: any[];
  value: any;
  onChange: (e: SelectChangeEvent<any>) => void;
  hasLabeledOptions?: boolean;
  disabled?: boolean;
  multiple?: boolean;
}

const MultiSelect = ({ label, options, value, onChange, hasLabeledOptions, disabled, multiple }: MultiSelectProps) => (
  <FormControl>
    <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
      <Select
        labelId="demo-multiple-chip-label"
        id="demo-multiple-chip"
        multiple
        value={value}
        onChange={onChange}
        input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            {(selected as any[]).map((option) => (
              <Chip key={hasLabeledOptions ? option.value : option} label={hasLabeledOptions ? option.label : option} />
            ))}
          </Box>
        )}
        // MenuProps={MenuProps}
      >
        {options.map((option) => (
          <MenuItem key={hasLabeledOptions ? option.value : option} value={hasLabeledOptions ? option.value : option}>
            {hasLabeledOptions ? option.label : option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
)

interface NewDepotDialogProps {
  name?: string;
  handleClose: () => void;
  handleCreate: (depot: FacilityInput) => void;
  isNotDialog?: boolean;
}

const NewDepotDialog = ({ name, handleClose, handleCreate, isNotDialog }: NewDepotDialogProps) => {
  // const [availabilityDate, setAvailabilityDate] = useState<Date | null>(new Date())
  type Ext = {
    // lat: number;
    // lon: number;
    cityId: string;
    countryId: string;
    region: string;
    addressName: string;
    zipCode?: string;
    // cityName?: string;
  }
  const [newDepot, setNewDepot] = useState<Partial<FacilityInput & Ext>>({
    name: '',
    // locationId: undefined, // comes from lat, lon
    addressId: undefined, // comes from cityId, countryId, region
    partnershipTypes: [DepotPartnershipTypesEnum.Storage as any],
    // lat: 0,
    // lon: 0,
    cityId: '',
    countryId: '',
    region: AddressRegionEnum.Europe,
    addressName: '',
    type: FacilityWithLocTypeEnum.Depo as any,
    code: undefined,
    zipCode: undefined,
    // cityName: undefined,
  })
  const { addresses } = useSelector((state: AppState) => state.places)
  const [countryCode, setCountryCode] = useState<string | undefined>(undefined)
  const [cityCode, setCityCode] = useState<string | undefined>(undefined)

  const regionOptions = [
    AddressRegionEnum.Europe,
    AddressRegionEnum.Asia,
    AddressRegionEnum.SouthAmerica,
    AddressRegionEnum.NorthAmerica,
    AddressRegionEnum.Australasia,
    AddressRegionEnum.Antarctica,
  ]

  const partnershipTypes = [
    DepotPartnershipTypesEnum.Storage,
    DepotPartnershipTypesEnum.MnR,
    DepotPartnershipTypesEnum.Haulage,
  ]

  const typeOptions = [
    { value: FacilityWithLocTypeEnum.Bocr, label: 'Border crossing' },
    { value: FacilityWithLocTypeEnum.Culo, label: 'Customer location' },
    { value: FacilityWithLocTypeEnum.Cofs, label: 'Container freight station' },
    { value: FacilityWithLocTypeEnum.Coya, label: 'Container yard' },
    { value: FacilityWithLocTypeEnum.Depo, label: 'Depot' },
    { value: FacilityWithLocTypeEnum.Inte, label: 'Inland terminal' },
    { value: FacilityWithLocTypeEnum.Pote, label: 'Port terminal' },
    { value: FacilityWithLocTypeEnum.Pbst, label: 'Pilot boarding station' },
  ]

  const _dispatch = useDispatch()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.stopPropagation()
    event.preventDefault()

    if (newDepot.name === '') {
      _dispatch(showError(['Need to input move ID']))
    } else {
      handleCreate({
        ...newDepot as any /** FIXME */,
      })
    }
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string) => {
    setNewDepot({
      ...newDepot,
      [key]: event.target.value,
    })
  }

  const handleChangePartnerships = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewDepot({
      ...newDepot,
      partnershipTypes: event.target.value.includes('all') ? partnershipTypes as any[] : event.target.value as any,
    })
  }

  const isDialog = isNotDialog ? !isNotDialog : true

  const handleSelectAddress = (addressId: string | string[]) => {
    const address = addresses.find(a => a.addressId === addressId)
    const countryId = address?.countryId
    const cityId = address?.cityId
    const addressName = address?.name
    const region = address?.region
    const zipCode = address?.zipCode

    setNewDepot({
      ...newDepot,
      addressId: addressId as string,
      ...(countryId && { countryId }),
      ...(cityId && { cityId }),
      ...(addressName && { addressName }),
      ...(region && { region }),
      ...(zipCode && { zipCode }),
    })
  }

  const getCode = () => {
    const country = countryCode
    const city = cityCode
    const company = newDepot.code
    return `${country || 'XX'}-${city || 'XXX'}-${company || 'XXXX'}`
  }

  const isValidCode = (newDepot.code && newDepot.code.length === 4 && /^[a-zA-Z0-9]{4}$/.test(newDepot.code))

  return isDialog
    ? (
    <Dialog open={true} maxWidth={'sm'} fullWidth onClose={handleClose} >
      <DialogTitle>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography variant={'h6'}>New Facility</Typography>
          {/* { loadingDepots && <CircularProgress sx={{ marginLeft: '16px' }} size={20} /> } */}
          <Box justifyContent={'flex-end'}>
            <IconButton size='small' onClick={handleClose}><ClearIcon/></IconButton>
          </Box>
        </Box>
        </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
            <Box display='flex' flexDirection='column' >
              {/* <TextField required {...commonProps} label="Container Id" value={newDepot.equipmentId} onChange={e => handleChange(e, 'equipmentId')} /> */}
              <TextField required {...commonProps} label="Facility name" value={newDepot.name} onChange={e => handleChange(e, 'name')} />
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <TextField required {...commonProps} label="Company code" value={newDepot.code} onChange={e => handleChange(e, 'code')}
                    error={!isValidCode}
                    helperText={newDepot.code !== undefined && !isValidCode ? 'Needs to be 4 letters (no special characters allowed, only letters and numbers)' : ''}
                    inputProps={{
                      maxLength: 4,
                      style: {
                        letterSpacing: '0.5ch',
                        textTransform: 'uppercase',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField disabled {...commonProps} value={getCode()} />
                </Grid>
              </Grid>
              {/* <input maxLength='7' value='0123456'/> */}
              <SelectableTextField
                hasLabeledOptions={true}
                label={'type'}
                options={typeOptions}
                value={newDepot.type}
                onChange={e => handleChange(e, 'type')}
              />
              <SelectableTextField
                label={'Partnerships'}
                options={partnershipTypes}
                value={newDepot.partnershipTypes}
                multiple={true}
                selectAll={true}
                onChange={e => handleChangePartnerships(e)}
              />
              {/* <MultiSelect
                label={'Partnerships'}
                options={partnershipTypes}
                value={newDepot.partnershipTypes}
                multiple={true}
                onChange={e => handleChange(e, 'partnershipTypes')}
              /> */}
              <Box mt={2} mb={1} >
                <Typography>Address</Typography>
              </Box>
              <AddressAutocomplete label={'Pick Address or fill in details below'} callback={handleSelectAddress}/>
              <CountryAutocomplete disabled={newDepot.addressId !== undefined} controlled={true} value={newDepot.countryId} label={'Country'}
                callback={(country) => setNewDepot({
                  ...newDepot,
                  countryId: country as string,
                })}
                callbackCountryCode={(code) => setCountryCode(code as string)}
              />
              <SelectableTextField
                label={'Region'}
                options={regionOptions}
                value={newDepot.region}
                disabled={newDepot.addressId !== undefined}
                onChange={e => handleChange(e, 'region')}
              />
              <CityAutocomplete countryId={newDepot.countryId} disabled={newDepot.addressId !== undefined} controlled={true} value={newDepot.cityId} label={'City'}
                callback={(city) => setNewDepot({
                  ...newDepot,
                  cityId: city as string,
                })}
                callbackCityCode={(code) => setCityCode(code as string)}
              />
              <TextField disabled={newDepot.addressId !== undefined} {...commonProps} label="ZIP code" value={newDepot.zipCode} onChange={e => handleChange(e, 'zipCode')} />
              <TextField disabled={newDepot.addressId !== undefined} {...commonProps} label="Address name" value={newDepot.addressName} onChange={e => handleChange(e, 'addressName')} />
              {/* <Box mt={2} mb={1} >
                <Typography>Location</Typography>
              </Box> */}
            </Box>
        </DialogContent>
        <DialogActions>
          {/* <Button color='primary' onClick={handleClose}>Close</Button> */}
          <Button color='primary' variant='contained' type='submit' >Create</Button>
        </DialogActions>
      </form>
    </Dialog>
      )
    : (
      // <form onSubmit={handleSubmit}>
      //   <Box display='flex' flexDirection='column' >
      //     {/* <TextField required {...commonProps} label="Container Id" value={newDepot.equipmentId} onChange={e => handleChange(e, 'equipmentId')} /> */}
      //     <TextField required {...commonProps} label="Name" value={newDepot.name} onChange={e => handleChange(e, 'name')} />
      //     <FacilityAutocomplete label={'Depot'} callback={(depot) => setNewDepot({
      //       ...newDepot,
      //       depotId: depot as string,
      //     })}/>
      //   </Box>
      //   <Button color='primary' variant='contained' type='submit' >Create</Button>
      // </form>
      <React.Fragment></React.Fragment>
      )
}

interface NewDepotProps extends BoxProps {
  name?: string;
  onCreate: (depot: FacilityInput) => void;
  isNotDialog?: boolean;
  label?: string;
}

const NewDepot = ({ label, name, onCreate, isNotDialog, ...boxProps }: NewDepotProps) => {
  const [open, setOpen] = useState(false)
  const [bla, setBla] = useState<any>(null)

  const handleCreate = (depot: FacilityInput) => {
    setOpen(false)
    onCreate({
      ...depot,
    })
  }

  const isDialog = isNotDialog ? !isNotDialog : true

  return isDialog
    ? (
      <Box {...boxProps} >
        <Button variant='contained' color='primary' size='small' disabled={false} onClick={() => setOpen(true)}>
          New Facility
        </Button>
        { open && <NewDepotDialog name={name} isNotDialog={isNotDialog} handleClose={() => setOpen(false)} handleCreate={handleCreate}/>}
      </Box>
      )
    : (
      <Box {...boxProps} >
        <Button variant='contained' color='primary' size='small' disabled={false}
          onClick={(event) => {
            setOpen(true)
            setBla(event.currentTarget)
          }}
        >
          {label || 'New Facility'}
        </Button>
        <Popover open={open} anchorEl={bla}>
          <NewDepotDialog name={name} isNotDialog={isNotDialog} handleClose={() => setOpen(false)} handleCreate={handleCreate}/>
        </Popover>
        {/* <NewDepotDialog name={name} isNotDialog={isNotDialog} handleClose={() => setOpen(false)} handleCreate={handleCreate}/> */}
      </Box>
      )
}

export default NewDepot
