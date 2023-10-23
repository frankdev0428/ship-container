import React, { ChangeEvent, FormEvent, useState } from 'react'
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
  Collapse,
} from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useDispatch } from 'react-redux'

import Typography from '../Utils/Typography'
import { ContainerCharacteristicsSizeEnum, ContainerWithProfile, ContainerPatchInput } from '../../../apis-client'
import { ContainerPanelProfileInput } from '../../../services/equipment/types'
import { createPanelProfile, updateContainer } from '../../../services/equipment/actions'
import { LabeledSimpleDatePicker } from '../shared/LabeledSimpleDatePicker'
import { LabeledDatePicker } from '../shared/LabeledDatePicker'

const commonProps = {
  variant: 'outlined' as any,
  margin: 'dense' as any,
  size: 'small' as any,
  style: { minWidth: 160, marginTop: 4, marginBottom: 0 },
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

const GridField = (props: StandardTextFieldProps) => (
  <Grid item xs={6}>
    <TextField {...commonProps} {...props}/>
  </Grid>
)

const GridPicker = (props: SelectableTextFieldProps) => (
  <Grid item xs={6}>
    <SelectableTextField {...props}/>
  </Grid>
)

interface UpdateContainerDataDialogProps {
  handleClose: () => void;
  handleCreate: (container: ContainerPatchInput, panelProfile?: ContainerPanelProfileInput) => void;
  container: ContainerWithProfile;
  panelProfile?: ContainerPanelProfileInput;
}

const UpdateContainerDataDialog = ({ container, panelProfile, handleClose, handleCreate }: UpdateContainerDataDialogProps) => {
  const [newContainer, setNewContainer] = useState<{containerId: string} & ContainerPatchInput & ContainerPanelProfileInput>({
    containerId: container.containerId,
    cscCertNo: container.cscCertNo,
    cscCertDate: container.cscCertDate,
    cscCertLink: container.cscCertLink,
    inspectionDate: container.inspectionDate,
    characteristics_size: container.characteristics_size as any,
    characteristics_type: container.characteristics_type as any,
    containerVersion: container.containerVersion,
    characteristics_maxPayload: container.characteristics_maxPayload,
    characteristics_builtYear: container.characteristics_builtYear || '2022',
    volume: container.volume,
    characteristics_grade: container.characteristics_grade,
    characteristics_tare: container.characteristics_tare,
    electronicsCharging: container.electronicsCharging,
    insurance: container.insurance,
    cameraExt: container.cameraExt,
    cameraInt: container.cameraInt,
    doorType: container.doorType,
    floorType: container.floorType,
    leftPanel: panelProfile?.leftPanel || '',
    rightPanel: panelProfile?.rightPanel || '',
    roofPanel: panelProfile?.roofPanel || '',
    endPanel: panelProfile?.endPanel || '',
  })
  const [certOpen, setCertOpen] = useState(false)

  const _dispatch = useDispatch()

  const containerSizes = [
    ContainerCharacteristicsSizeEnum._20ft,
    ContainerCharacteristicsSizeEnum._40ft,
    ContainerCharacteristicsSizeEnum._45ft,
  ]
  const containerTypes = ['REEFER', 'FLEXITANK', 'NORMAL']

  const handleSubmit = (event?: FormEvent<HTMLFormElement>) => {
    event?.stopPropagation()
    event?.preventDefault()

    handleCreate(newContainer, {
      leftPanel: newContainer.leftPanel,
      rightPanel: newContainer.rightPanel,
      roofPanel: newContainer.roofPanel,
      endPanel: newContainer.endPanel,
    })
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string) => {
    if (key === 'volume' || key === 'characteristics_tare') {
      setNewContainer({
        ...newContainer,
        [key]: +event.target.value,
      })
    } else {
      setNewContainer({
        ...newContainer,
        [key]: event.target.value,
      })
    }
  }

  // const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string, isCheckbox?: boolean) => {
  //   setNewBoard({
  //     ...newBoard,
  //     [key]: isCheckbox ? (event.target as any).checked : event.target.value,
  //   })
  // }

  const handleChangeDate = (date: Date | null, key: string) => {
    setNewContainer({
      ...newContainer,
      [key]: date,
    })
  }

  const handleChangeYear = (date: Date | null, key: string) => {
    setNewContainer({
      ...newContainer,
      ...(date && { [key]: date.getFullYear() }),
      // ...date && { depotAvailabilityDatePlanned: date },
    })
  }

  return (
    <Dialog open={true} maxWidth={'sm'} fullWidth /* onClose={(event, reason) => { if (reason !== 'backdropClick') handleClose() }} */ >
      <DialogTitle>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography variant={'h6'}>Update Container {container.containerId ? `${container.containerId}` : ''}</Typography>
          <Box justifyContent={'flex-end'}>
            <IconButton size='small' onClick={handleClose}><ClearIcon/></IconButton>
          </Box>
        </Box>
        </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
        <Box display='flex' flexDirection='column' >
            <Box mb={0.5} >
              <Typography>Container Characteristics</Typography>
            </Box>
            <Box display='flex'>
              <Grid container spacing={1}>
                <GridPicker
                  required
                  label={'Size'}
                  options={containerSizes}
                  value={newContainer.characteristics_size}
                  onChange={e => handleChange(e, 'characteristics_size')}
                />
                <GridField {...commonProps} required label="Version" type='text' value={newContainer.containerVersion} onChange={e => handleChange(e, 'containerVersion')} />
                <GridPicker
                  required
                  label={'Type'}
                  options={containerTypes}
                  value={newContainer.characteristics_type}
                  onChange={e => handleChange(e, 'characteristics_type')}
                />
                <Grid item xs={6}>
                  <LabeledSimpleDatePicker
                    label="Built Year"
                    value={new Date(parseInt(newContainer.characteristics_builtYear || '2022'), 0)}
                    onChange={date => handleChangeYear(date, 'characteristics_builtYear')}
                    openTo="year"
                    views={['year']}
                    inputFormat={'yyyy'}
                    textFieldProps={{ sx: { marginTop: '4px', marginBottom: 0 } }}
                  />
                </Grid>
                <GridField required label="Tare" type='number' inputProps={{ min: 0 }} value={newContainer.characteristics_tare === 0 ? '' : (newContainer.characteristics_tare || '')} onChange={e => handleChange(e, 'characteristics_tare')} />
                <GridField {...commonProps} required label="Volume" type='number' inputProps={{ min: 0 }} value={newContainer.volume === 0 ? '' : newContainer.volume} onChange={e => handleChange(e, 'volume')} />
                <GridField required label="Maximum Payload" type='number' inputProps={{ min: 0 }} value={newContainer.characteristics_maxPayload === '0' ? '' : newContainer.characteristics_maxPayload} onChange={e => handleChange(e, 'characteristics_maxPayload')} />
                <GridField {...commonProps} label="Grade" type='text' value={newContainer.characteristics_grade} onChange={e => handleChange(e, 'characteristics_grade')} />
              </Grid>
            </Box>
            {/* <Box display='flex'> */}
            <FormControlLabel
              control={
                <Checkbox
                  color='primary'
                  checked={newContainer.electronicsCharging}
                  onChange={e => setNewContainer({
                    ...newContainer,
                    electronicsCharging: (e.target as any).checked,
                  })}
                />
              }
              label={'Charging Electronics'}
            />
            <FormControlLabel
              control={
                <Checkbox
                  color='primary'
                  checked={newContainer.cameraInt}
                  onChange={e => setNewContainer({
                    ...newContainer,
                    cameraInt: (e.target as any).checked,
                  })}
                />
              }
              label={'Internal Camera'}
            />
            <FormControlLabel
              control={
                <Checkbox
                  color='primary'
                  checked={newContainer.cameraExt}
                  onChange={e => setNewContainer({
                    ...newContainer,
                    cameraExt: (e.target as any).checked,
                  })}
                />
              }
              label={'External Camera'}
            />
            <Grid container spacing={1}>
              {/* <GridField {...commonProps} label="TIR locking plate" type='text' value={newContainer.doorType} onChange={e => handleChange(e, 'doorType')} />
              <GridField {...commonProps} label="Floor insulation" type='text' value={newContainer.floorType} onChange={e => handleChange(e, 'floorType')} /> */}
              <Grid item xs={6}>
                <SelectableTextField
                label={'TIR locking plate'}
                options={['yes', 'no', 'unknown']}
                value={newContainer.doorType}
                onChange={e => handleChange(e, 'doorType')}
                />
              </Grid>
              <Grid item xs={6}>
                <SelectableTextField
                  label={'Floor insulation'}
                  options={['none', 'rockwool', 'spray foam', 'unknown']}
                  value={newContainer.floorType}
                  onChange={e => handleChange(e, 'floorType')}
                />
              </Grid>
            </Grid>
            <Button
              fullWidth
              color='primary'
              sx={{ textTransform: 'none', justifyContent: 'space-between', marginTop: '8px' }}
              endIcon={ certOpen ? <ExpandLessIcon color='primary' /> : <ExpandMoreIcon color='primary' />}
              onClick={() => setCertOpen(!certOpen)}
            >
              {'Certification, Inspection & Insurance'}
            </Button>
            <Collapse in={certOpen} sx={{ margin: certOpen ? '8px 0' : 0 }}>
              <Grid container spacing={1}>
                <GridField {...commonProps} label="CSC Cert Nº" type='text' value={newContainer.cscCertNo || ''} onChange={e => handleChange(e, 'cscCertNo')} />
                <Grid item xs={6}>
                  <LabeledDatePicker
                    label="CSC Cert Date"
                    value={newContainer.cscCertDate || null}
                    onChange={date => handleChangeDate(date, 'cscCertDate')}
                    textFieldProps={{ sx: { marginTop: '4px', marginBottom: 0 } }}
                  />
                </Grid>
                <GridField {...commonProps} label="CSC Cert Link" type='text' value={newContainer.cscCertLink || ''} onChange={e => handleChange(e, 'cscCertLink')} />
                <Grid item xs={6}>
                  <LabeledDatePicker
                    label="Inspection Date"
                    value={newContainer.inspectionDate || null}
                    onChange={date => handleChangeDate(date, 'inspectionDate')}
                    textFieldProps={{ sx: { marginTop: '4px', marginBottom: 0 } }}
                  />
                </Grid>
                <GridField {...commonProps} label="Insurance" type='text' value={newContainer.insurance || ''} onChange={e => handleChange(e, 'insurance')} />
              </Grid>
            </Collapse>
            <Box mt={1} mb={0.5} > <Typography>{'Panels & Doors'}</Typography></Box>
            <Grid container spacing={1}>
              <GridField {...commonProps} label="Left Panel" type='text' value={newContainer.leftPanel} onChange={e => handleChange(e, 'leftPanel')} />
              <GridField {...commonProps} label="Right Panel" type='text' value={newContainer.rightPanel} onChange={e => handleChange(e, 'rightPanel')} />
              <GridField {...commonProps} label="Roof Panel" type='text' value={newContainer.roofPanel} onChange={e => handleChange(e, 'roofPanel')} />
              <GridField {...commonProps} label="End Panel" type='text' value={newContainer.endPanel} onChange={e => handleChange(e, 'endPanel')} />
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button color='primary' onClick={handleClose}>Close</Button>
          <Button color='primary' size='small' variant='contained' type='submit' >Update</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

interface UpdateContainerDataProps extends BoxProps {
  container: ContainerWithProfile;
  panelProfile?: ContainerPanelProfileInput;
}

const UpdateContainerData = ({ container, panelProfile, ...boxProps }: UpdateContainerDataProps) => {
  const [open, setOpen] = useState(false)
  const _dispatch = useDispatch()

  const handleCreate = (containerPatch: ContainerPatchInput, panelProfile?: ContainerPanelProfileInput) => {
    setOpen(false)
    _dispatch(updateContainer(container.containerId, containerPatch))
    panelProfile && _dispatch(createPanelProfile(container.containerId, panelProfile))
  }

  return (
    <Box {...boxProps} >
      <Button variant='contained' size='small' color='primary' disabled={false} onClick={() => setOpen(true)}>
        Update container data
      </Button>
      { open && <UpdateContainerDataDialog container={container} panelProfile={panelProfile} handleClose={() => setOpen(false)} handleCreate={handleCreate}/>}
    </Box>
  )
}

export default UpdateContainerData
