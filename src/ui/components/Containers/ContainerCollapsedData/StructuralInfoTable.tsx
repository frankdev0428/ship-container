import React from 'react'
import { useSelector } from 'react-redux'
import { styled } from '@mui/material/styles'
import { Box, Grid, TextField } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'

import { AppState } from '../../../../store'
import { Loading } from '../../shared/component_utils'
import { ContainerWithProfile } from '../../../../services/equipment/types'
import UpdateContainerData from '../UpdateContainerData'
import { getTimeLabel } from '../../shared/utils'
import Typography from '../../Utils/Typography'

const StyledParentGrid = styled(Grid)({
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'row',
  justifyContent: 'start',
  alignItems: 'baseline',
  gap: '8px',
})

const commonProps = {
  // fullWidth: true,
  variant: 'outlined' as any,
  margin: 'dense' as any,
  size: 'small' as any,
  style: { minWidth: 180 },
  InputLabelProps: { shrink: true },
  inputProps: { readOnly: true },
}

const InlineCheck = ({ label, checked }: {label: string, checked?: boolean }) => (
  <Box display='flex' sx={{ gap: '4px' }}>
    <Typography>{label}</Typography>
    { checked ? <CheckCircleIcon color='primary' /> : <CancelIcon color='disabled' /> }
  </Box>
)

interface BoardsTableProps {
  containerId?: string;
  boardIds?: string[];
}

const ContainerStructs = ({ container }: {container?: ContainerWithProfile}) => {
  const containerPanelProfile = (container?.containerpanelprofiles && container?.containerpanelprofiles.length > 0) ? container?.containerpanelprofiles[0] : undefined

  return (container
    ? (<StyledParentGrid id='grid-structural-info-table'>
      <TextField {...commonProps} label="Container Nº" value={container.containerId} />
      <TextField {...commonProps} label="Size" value={container.characteristics_size} />
      <TextField {...commonProps} label="Type" value={container.characteristics_type} />
      <TextField {...commonProps} label="Version" value={container.containerVersion} />
      <TextField {...commonProps} label="Max Payload" value={container.characteristics_maxPayload} />
      <TextField {...commonProps} label="Built Year" value={container.characteristics_builtYear || ''} />
      <TextField {...commonProps} label="Inspection Date" value={container.inspectionDate ? getTimeLabel(container.inspectionDate, 'dateHourWithTz') : ''} />
      <TextField {...commonProps} label="CSC Cert Nº" value={container.cscCertNo} />
      <TextField {...commonProps} label="CSC Cert Date" value={container.cscCertDate ? getTimeLabel(container.cscCertDate, 'dateHourWithTz') : ''} />
      <TextField {...commonProps} label="Volume" value={container.volume} />
      <TextField {...commonProps} label="Tare" value={container.characteristics_tare} />
      <TextField {...commonProps} label="Grade" value={container.characteristics_grade || ''} />
      <TextField {...commonProps} label="CSC Cert Link" value={container.cscCertLink || ''} />
      <TextField {...commonProps} label="Insurance" value={container.insurance || ''} />
      <TextField {...commonProps} label="Insurance Date" value={container.insuranceDate || ''} />
      <TextField {...commonProps} label="TIR locking plate" value={container.doorType || ''} />
      <TextField {...commonProps} label="Floor insulation" value={container.floorType || ''} />
      {containerPanelProfile && <React.Fragment>
          <TextField {...commonProps} label="Left Panel" value={containerPanelProfile.leftPanel || ''} />
          <TextField {...commonProps} label="Right Panel" value={containerPanelProfile.rightPanel || ''} />
          <TextField {...commonProps} label="Roof Panel" value={containerPanelProfile.roofPanel || ''} />
          <TextField {...commonProps} label="End Panel" value={containerPanelProfile.endPanel || ''} />
        </React.Fragment>
      }
      <TextField {...commonProps} label="Created At" value={getTimeLabel(container.createdAt, 'dateHourWithTz')} />
      <TextField {...commonProps} label="Updated At" value={container.updatedAt ? getTimeLabel(container.updatedAt, 'dateHourWithTz') : ''} />
      <Box width={1} display='flex' sx={{ gap: '16px' }} mt={1} mb={1} >
        <InlineCheck label="Electronics Charging" checked={container.electronicsCharging}/>
        <InlineCheck label="Camera Ext" checked={container.cameraExt}/>
        <InlineCheck label="Camera Int" checked={container.cameraInt}/>
      </Box>
      {/* <Button variant='contained' color='primary' size='small' >Modify structural data</Button> */}
      <Box width={1}>
        <UpdateContainerData
          container={container}
          panelProfile={containerPanelProfile as any}
        />
      </Box>
    </StyledParentGrid>)
    : (<Box>Not Container data available</Box>)
  )
}

const BoardsTable = ({ containerId, boardIds }: BoardsTableProps) => {
  const { containers, loadingStatus } = useSelector((state: AppState) => state.equipment)
  const container = containers.find(c => c.containerId === containerId)

  return (
    <Box id='boards-table-wrapper' display='flex' flexDirection={'column'} >
      <Loading loading={loadingStatus}>
        <Box display='flex' flexDirection='column' overflow='hidden' height={'100%'}>
          <ContainerStructs container={container}/>
        </Box>
      </Loading>
    </Box>
  )
}

export default BoardsTable
