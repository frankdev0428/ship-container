import React, { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  FormControlLabel,
  BoxProps,
  Stepper,
  Step,
  StepLabel,
  SelectChangeEvent,
  Grid,
  Typography,
} from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import { useDispatch } from 'react-redux'

import { ContainerCharacteristicsSizeEnum, ContainerCharacteristicsTypeEnum } from '../../../apis-client'
import { showError } from '../../../store/error/actions'
import { createNewContainer } from '../../../services/thunks'
import { ContainerBoardPairingProfilePostInput, ContainerInput, ContainerPanelProfileInput, ContainerStatusEnum } from '../../../services/equipment/types'
import FacilityAutocomplete from '../shared/Autocomplete/FacilityAutocomplete'
import AutoCompleteFieldControlled from '../shared/Autocomplete/AutocompleteFieldControlled'
import { LabeledSimpleDatePicker } from '../shared/LabeledSimpleDatePicker'
import { LabeledDatePicker } from '../shared/LabeledDatePicker'
import SelectPopper, { SelectPopperProps } from '../Utils/SelectPopper'
import { CAN_PAIR_BOARDS_IN_BULK_CONTAINER_CREATION } from '../shared/utils'
import GridField from '../shared/Form/FormGridField'
import GridPicker from '../shared/Form/FormGridPicker'

import PairingBoardProfiles, { BoardProfile } from './NewContainer/PairingBoardProfiles'
import { validateBoardProfiles } from './NewContainer/utils'

const commonProps = {
  variant: 'outlined' as any,
  margin: 'dense' as any,
  size: 'small' as any,
  style: { minWidth: 160 },
  fullWidth: true,
}

const containerSizes = [
  ContainerCharacteristicsSizeEnum._20ft,
  ContainerCharacteristicsSizeEnum._40ft,
  ContainerCharacteristicsSizeEnum._45ft,
]
const containerTypes = ['REEFER', 'FLEXITANK', 'NORMAL']
const operationalStatus = [
  ContainerStatusEnum.Production,
  ContainerStatusEnum.Blocked,
]

const containerVersions = ['1.1', '2.3', '2.4']

const doorTypeOptions = [
  { value: null, label: '' },
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'unknown', label: 'Unknown' },
]

const floorTypeOptions = [
  { value: null, label: '' },
  { value: 'rockwool', label: 'RockWool' },
  { value: 'spray foam', label: 'Spray Foam' },
  { value: 'unknown', label: 'Unknown' },
]

interface ContainerProps extends Omit<ContainerInput, 'containerId' | 'containerVersion'> {
  containerIds: string[]
  containerVersion?: string | null
}
interface NewContainerDialogProps {
  handleClose: () => void;
  handleCreate: (
    container: ContainerInput,
    isActual: boolean,
    panelProfile?: ContainerPanelProfileInput,
    boardPairingProfile?: ContainerBoardPairingProfilePostInput[]
  ) => void;
}

const NewContainerDialog = ({ handleClose, handleCreate }: NewContainerDialogProps) => {
  const IS_ACTUAL_DEFAULT = true

  const [activeStep, setActiveStep] = useState(0)
  const [newContainer, setNewContainer] = useState<ContainerProps & ContainerPanelProfileInput>({
    // STEP 1
    containerIds: [],
    inspectionDate: new Date(),
    cscCertNo: '',
    cscCertDate: new Date(),
    cscCertLink: undefined,
    status: ContainerStatusEnum.Production as any,
    depotId: '',
    depotAvailabilityDatePlanned: new Date(),
    depotAvailabilityDateActual: IS_ACTUAL_DEFAULT ? new Date() : undefined,

    // STEP 2
    characteristics_size: ContainerCharacteristicsSizeEnum._20ft, // ContainerSizeName,
    characteristics_type: ContainerCharacteristicsTypeEnum.Normal, // ContainerTypeName,
    containerVersion: null,
    characteristics_maxPayload: '',
    characteristics_builtYear: '2022',
    volume: 0,
    characteristics_grade: '',
    characteristics_tare: undefined, // undefined, // the empty weight the of container, number, optional to create ctr, can not change,
    electronicsCharging: false, // bool optional to create ctr, can change (every few years, record needed)
    insurance: '', // free form string optional to create ctr, can change (every few years, record needed)
    cameraExt: false, //  external cam, bool, optional to create ctr, can change (every few years, record needed)
    cameraInt: false, //  external cam, bool, optional to create ctr, can change (every few years, record needed)
    doorType: '',
    floorType: '',
    leftPanel: '',
    rightPanel: '',
    roofPanel: '',
    endPanel: '',
  })
  // STEP 3
  const [boardProfiles, setBoardProfiles] = useState<{[ containerId: string ]: BoardProfile[]}>({})
  const [isActual, setIsActual] = useState(IS_ACTUAL_DEFAULT)
  const [disableSubmit, setDisableSubmit] = useState(false)
  const myForm = React.useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (newContainer.containerIds.length > 0) {
      const boards2 = newContainer.containerIds.reduce((indexed, id) => ({
        ...indexed,
        [id as string]: boardProfiles[id] || [{ containerId: id, boardSource: 'aeler' }],
      }), {} as { [containerId: string ]: BoardProfile[] })
      setBoardProfiles(boards2)
    }
  }, [JSON.stringify(newContainer.containerIds)])

  const _dispatch = useDispatch()

  const handleSubmit = (event?: FormEvent<HTMLFormElement>) => {
    event?.stopPropagation()
    event?.preventDefault()

    if (myForm.current) {
      if (!myForm.current.checkValidity()) {
        myForm.current.reportValidity()
        return
      }
    }

    if (newContainer.containerIds.length === 0 && newContainer.depotId === '') {
      _dispatch(showError(['Need to input Container ID and Facility ID']))
    } else {
      newContainer.containerIds.forEach((cId) => {
        const validNewContainer = validateContainerPayload(cId, newContainer)
        const boardPairingProfiles = validateBoardProfiles(boardProfiles[cId])

        validNewContainer && handleCreate(
          { ...validNewContainer, containerId: cId },
          isActual,
          {
            leftPanel: validNewContainer.leftPanel,
            rightPanel: validNewContainer.rightPanel,
            roofPanel: validNewContainer.roofPanel,
            endPanel: validNewContainer.endPanel,
          },
          boardPairingProfiles,
        )
      })
    }
  }

  const validateContainerPayload = (containerId: string, containerForm: ContainerProps & ContainerPanelProfileInput): (ContainerInput & ContainerPanelProfileInput) | undefined => {
    if (
      containerForm.cscCertNo &&
      containerForm.depotId &&
      containerForm.containerVersion &&
      containerForm.characteristics_size &&
      containerForm.characteristics_type &&
      containerForm.characteristics_tare &&
      containerForm.characteristics_maxPayload && parseInt(containerForm.characteristics_maxPayload) > 0 &&
      containerForm.volume
    ) {
      const a = containerForm.containerVersion
      return ({
        containerId,
        ...containerForm,
        cscCertNo: containerForm.cscCertNo,
        depotId: containerForm.depotId,
        containerVersion: containerForm.containerVersion,
        characteristics_size: containerForm.characteristics_size,
        characteristics_type: containerForm.characteristics_type,
        characteristics_tare: containerForm.characteristics_tare,
        characteristics_maxPayload: containerForm.characteristics_maxPayload,
        volume: containerForm.volume,

      })
    }
    return undefined
  }

  const handleTextFieldChange = (key: keyof (ContainerProps & ContainerPanelProfileInput)) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    handleChange(key)(event.target.value)
  }

  const handleChange = (key: keyof (ContainerProps & ContainerPanelProfileInput)) => (value: string | null) => {
    if (key === 'containerVersion') {
      setNewContainer({
        ...newContainer,
        [key]: value || '',
        ...value && (+value === 1.1) && {
          characteristics_maxPayload: '27580',
          characteristics_tare: 2900,
          volume: 33,
        },
        ...value && (+value === 2.3) && {
          characteristics_maxPayload: '',
          characteristics_tare: undefined,
          floorType: 'spray foam',
          volume: 0,
        },
        ...value && (+value === 2.4) && {
          characteristics_maxPayload: '27980',
          floorType: 'spray foam',
          doorType: 'yes',
          characteristics_tare: 2500,
          characteristics_builtYear: '2023',
          characteristics_size: ContainerCharacteristicsSizeEnum._20ft,
          characteristics_type: ContainerCharacteristicsTypeEnum.Normal,
        },
      })
      return
    }

    if (key === 'volume' || key === 'characteristics_tare') {
      setNewContainer({
        ...newContainer,
        [key]: value ? +value : value,
      })
    } else {
      setNewContainer({
        ...newContainer,
        [key]: value,
      })
    }
  }

  type DateKey = 'inspectionDate' | 'cscCertDate' | 'depotAvailabilityDatePlanned' | 'depotAvailabilityDateActual' | 'characteristics_builtYear'
  const handleChangeDate = (key: DateKey) => (date: Date | null) => {
    setNewContainer({
      ...newContainer,
      ...key === 'characteristics_builtYear'
        ? { [key]: `${date?.getFullYear() || ''}` }
        : { [key]: date },
    })
  }

  const handleChangeContainers = (locOpts: { label:string, value: string, inputValue?: string }[] | null) => {
    const newIds = locOpts?.map(o => ({ value: o.value, label: o.value }))

    if (newIds?.length) {
      setNewContainer({ ...newContainer, containerIds: [...newIds.map((c) => c.value)] })
    } else {
      setNewContainer({ ...newContainer, containerIds: [] })
    }
  }

  const labels = [
    'Container Details',
    'Characteristics',
    ...CAN_PAIR_BOARDS_IN_BULK_CONTAINER_CREATION ? ['Boards'] : [],
  ]

  const submitStep = CAN_PAIR_BOARDS_IN_BULK_CONTAINER_CREATION ? 2 : 1

  const ContainerDetailsForm = useMemo(() => {
    return (
      <Box display='flex' flexDirection='column' >
        <AutoCompleteFieldControlled
          {...commonProps}
          canAddNew
          multiple
          label={'Container(s) ID(s)'}
          onChange={e => handleChangeContainers(e)}
          value={newContainer.containerIds}
          options={[]}
          openOnFocus={false}
          TextFieldProps={{ required: true }}
        />
        <LabeledDatePicker
          // required
          label="Inspection Date"
          value={newContainer.inspectionDate}
          onChange={handleChangeDate('inspectionDate')}
          textFieldProps={{ size: 'small' }}
        />
        <TextField
          {...commonProps}
          required
          label="Certification Number"
          type='text' value={newContainer.cscCertNo}
          onChange={handleTextFieldChange('cscCertNo')}
        />
        <TextField
          {...commonProps}
          label="Certification link"
          type='text'
          value={newContainer.cscCertLink}
          onChange={handleTextFieldChange('cscCertLink')}
        />
        <LabeledDatePicker
          // required
          label="Certification Date"
          value={newContainer.cscCertDate}
          onChange={handleChangeDate('cscCertDate')}
          textFieldProps={{ size: 'small' }}
        />
        <FacilityAutocomplete value={newContainer.depotId} callback={(depot) => setNewContainer({
          ...newContainer,
          depotId: depot as string,
        })}/>
        <SelectPopper
          id='outlined-select-container-operational-status'
          label={'Operational Status'}
          options={operationalStatus.map(s => ({ value: s, label: s }))}
          value={newContainer.status}
          onChange={handleChange('status')}
        />
        <FormControlLabel
          control={
            <Checkbox
            // disabled={isActual}
            color='primary'
            // indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={isActual}
            onChange={e => {
              setIsActual(e.target.checked)
              newContainer.depotAvailabilityDatePlanned &&
                handleChangeDate('depotAvailabilityDateActual')(newContainer.depotAvailabilityDatePlanned)
            }}
            // inputProps={{ 'aria-label': 'select all containers' }}
          />
          }
          label={'Mark as available after actual date'}
        />
        <LabeledDatePicker
          id="availability-date-planned"
          label="Availability Date (planned)"
          value={newContainer.depotAvailabilityDatePlanned || null}
          onChange={handleChangeDate('depotAvailabilityDatePlanned')}
          textFieldProps={{ size: 'small' }}
        />
        <LabeledDatePicker
          disabled={!isActual}
          id="availability-date-actual"
          label="Availability Date (actual)"
          value={newContainer.depotAvailabilityDateActual || null}
          onChange={handleChangeDate('depotAvailabilityDateActual')}
          textFieldProps={{ size: 'small' }}
        />
        <Box mt={2} textAlign='right'>
          <Button variant='contained' size='small' color='primary' /* type='submit'  */onClick={() => {
            if (myForm.current) {
              if (!myForm.current.checkValidity()) {
                myForm.current.reportValidity()
              } else {
                setActiveStep(1)
              }
            }
          }}>
            Next
          </Button>
        </Box>
      </Box>
    )
  }, [JSON.stringify(newContainer), myForm, isActual])

  const ContainerCharacteristicsForm = useMemo(() => {
    return (
      <Box display='flex' flexDirection='column' >
        <Box mb={0.5} ><Typography>Container Characteristics</Typography></Box>
        <Box display='flex'>
          <Grid container spacing={1}>
            <GridPicker
              required
              label={'Size'}
              options={containerSizes.map(s => ({ value: s, label: s }))}
              value={newContainer.characteristics_size}
              onChange={handleChange('characteristics_size')}
            />
            <GridPicker
              required
              label={'Version'}
              options={containerVersions.map(v => ({ value: v, label: v || '' }))}
              value={newContainer.containerVersion}
              onChange={handleChange('containerVersion')}
            />
            <GridPicker
              required
              label={'Type'}
              options={containerTypes.map(t => ({ value: t, label: t }))}
              value={newContainer.characteristics_type}
              onChange={handleChange('characteristics_type')}
            />
            <Grid item xs={6}>
              <LabeledSimpleDatePicker
                label="Built Year"
                value={new Date(parseInt(newContainer.characteristics_builtYear || '2022'), 0)}
                onChange={handleChangeDate('characteristics_builtYear')}
                openTo="year"
                views={['year']}
                inputFormat={'yyyy'}
                textFieldProps={{ sx: { marginTop: '4px', marginBottom: 0 } }}
              />
            </Grid>
            <GridField
             {...commonProps}
              required
              label="Tare"
              type='number'
              inputProps={{ min: 0 }}
              value={newContainer.characteristics_tare === 0 ? '' : (newContainer.characteristics_tare || '')}
              onChange={handleTextFieldChange('characteristics_tare')}
            />
            <GridField
             {...commonProps}
              required
              label="Volume"
              type='number'
              inputProps={{ min: 0 }}
              value={newContainer.volume === 0 ? '' : newContainer.volume}
              onChange={handleTextFieldChange('volume')}
            />
            <GridField
             {...commonProps}
              required
              label="Maximum Payload"
              type='number'
              inputProps={{ min: 0 }}
              value={newContainer.characteristics_maxPayload === '0' ? '' : newContainer.characteristics_maxPayload}
              onChange={handleTextFieldChange('characteristics_maxPayload')}
            />
            <GridField
             {...commonProps}
              label="Grade"
              type='text'
              value={newContainer.characteristics_grade}
              onChange={handleTextFieldChange('characteristics_grade')}
            />
          </Grid>
        </Box>
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
        <TextField
          {...commonProps}
          label="Insurance"
          type='text'
          value={newContainer.insurance}
          onChange={handleTextFieldChange('insurance')}
        />
        <SelectPopper
          label={'TIR locking plate'}
          options={doorTypeOptions}
          value={newContainer.doorType}
          onChange={handleChange('doorType')}
          />
        <SelectPopper
          label={'Floor insulation'}
          options={floorTypeOptions}
          value={newContainer.floorType}
          onChange={handleChange('floorType')}
          />
        <Box mt={1} mb={0.5} >
          <Typography>Panels</Typography>
        </Box>
        <Box display='flex'>
          <Box width='50%' pr={0.5}>
            <TextField
              {...commonProps}
              label="Left Panel"
              type='text'
              value={newContainer.leftPanel}
              onChange={handleTextFieldChange('leftPanel')}
            />
            <TextField
              {...commonProps}
              label="Right Panel"
              type='text'
              value={newContainer.rightPanel}
              onChange={handleTextFieldChange('rightPanel')}
            />
          </Box>
          <Box width='50%' pl={0.5}>
            <TextField
              {...commonProps}
              label="Roof Panel"
              type='text'
              value={newContainer.roofPanel}
              onChange={handleTextFieldChange('roofPanel')}
            />
            <TextField
              {...commonProps}
              label="End Panel"
              type='text'
              value={newContainer.endPanel}
              onChange={handleTextFieldChange('endPanel')}
            />
          </Box>
        </Box>
        {/* Buttons */}
        <Box mt={2} display='flex' justifyContent='space-between' >
          <Button variant='contained' size='small' color='primary' onClick={() => {
            setActiveStep(0)
          }}>
            Back
          </Button>
          {
            CAN_PAIR_BOARDS_IN_BULK_CONTAINER_CREATION &&
            <Button variant='contained' size='small' color='primary' onClick={() => {
              if (myForm.current) {
                if (!myForm.current.checkValidity()) {
                  myForm.current.reportValidity()
                } else {
                  setActiveStep(2)
                }
              }
            }}>
              Next
            </Button>
          }
        </Box>
      </Box>
    )
  }, [JSON.stringify(newContainer), myForm, isActual])

  const BoardPairingForm = useMemo(() => {
    if (activeStep !== 2) return null

    const boardsToContainer = Object.values(boardProfiles)
      .flat()
      .reduce((indexed, bp) => {
        return ({
          ...indexed,
          ...bp.boardId && !indexed[bp.boardId] && { [bp.boardId]: bp.containerId },
        })
      }, {} as { [bid: string ]: string })

    return (
      <Box display='flex' flexDirection='column' >
        <Box mb={2} display='flex' flexDirection='column'>
          <Typography>Pair boards</Typography>
          <Typography variant='specialHelper'>Boards must be created previously</Typography>
        </Box>
        {
          Object.keys(boardProfiles).map((containerId, index) => {
            return (
              <PairingBoardProfiles
                key={index}
                containerId={containerId}
                boardProfiles={boardProfiles[containerId]}
                setBoardProfiles={(formProfiles: BoardProfile[]) => {
                  setBoardProfiles({
                    ...boardProfiles,
                    [containerId]: formProfiles,
                  })
                }}
                isBoardPaired={(boardId: string) => boardsToContainer[boardId] !== containerId}
                setDisableSubmit={setDisableSubmit}
              />
            )
          })

        }
        {/* Buttons */}
        <Box mt={2} display='flex' justifyContent='flex-start'>
          <Button variant='contained' size='small' color='primary' onClick={() => setActiveStep(1)}>
            Back
          </Button>
        </Box>
      </Box>
    )
  }, [activeStep, JSON.stringify(boardProfiles)])

  return (
    <Dialog open={true} maxWidth={'sm'} fullWidth PaperProps={{ sx: { maxHeight: '80vh' } }}/* onClose={(event, reason) => { if (reason !== 'backdropClick') handleClose() }} */>
      <DialogTitle>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography variant={'h6'}>New Container</Typography>
          <Box justifyContent={'flex-end'}>
            <IconButton size='small' onClick={handleClose}><ClearIcon/></IconButton>
          </Box>
        </Box>
        </DialogTitle>
      <form onSubmit={handleSubmit} ref={myForm}>
        <DialogContent sx={{ padding: '0px 24px 20px 24px' }}>
            {/* {handleSteps(activeStep)} */}
            { activeStep === 0 && ContainerDetailsForm }
            { activeStep === 1 && ContainerCharacteristicsForm}
            { activeStep === 2 && BoardPairingForm}
            <Stepper activeStep={activeStep} alternativeLabel>
              {labels.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
        </DialogContent>
        <DialogActions>
          <Button color='primary' onClick={handleClose}>Close</Button>
          <Button disabled={disableSubmit || activeStep !== submitStep} color='primary' size='small' variant='contained' type='submit' >Create</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

type NewContainerProps = BoxProps

const NewContainer = ({ ...boxProps }: NewContainerProps): JSX.Element => {
  const [open, setOpen] = useState(false)

  const _dispatch = useDispatch()

  const createContainerAndProfile = (container: ContainerInput, panelProfile?: ContainerPanelProfileInput, boardPairingProfiles?: ContainerBoardPairingProfilePostInput[]) => {
    _dispatch(createNewContainer(container, panelProfile, boardPairingProfiles))
  }

  const handleCreate = (
    container: ContainerInput,
    isActual: boolean,
    panelProfile?: ContainerPanelProfileInput,
    boardPairingProfiles?: ContainerBoardPairingProfilePostInput[],
  ) => {
    setOpen(false)
    createContainerAndProfile({
      ...container,
      ...isActual && { depotAvailabilityDateActual: container.depotAvailabilityDateActual },
    }, panelProfile, boardPairingProfiles)
  }

  return (
    <Box {...boxProps} >
      <Button variant='contained' size='small' color='primary' disabled={false} onClick={() => setOpen(true)}>
        New Container
      </Button>
      { open && <NewContainerDialog handleClose={() => setOpen(false)} handleCreate={handleCreate}/>}
    </Box>
  )
}

export default NewContainer
