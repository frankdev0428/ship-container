import React from 'react'
import { Box, Grid, TextField, Button } from '@mui/material'
import { useSelector } from 'react-redux'
import ScheduleIcon from '@mui/icons-material/Schedule'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'

import { AppState } from '../../../../store'
import { Loading } from '../../shared/component_utils'
import Typography, { DisableableTypography } from '../../Utils/Typography'
import { Equipment } from '../../../../services/equipment/types'
import { getTimeLabel } from '../../shared/utils'

interface GanttChartProps {
  equipmentId?: string;
}

const DateFormat = 'DD-MM-YYYY'

const showDate = (date?: {planned?: Date; actual?: Date}) => {
  if (!date || (date && !date.planned && !date.actual)) {
    return (
      <DisableableTypography noWrap variant='body2' >
        {undefined}
      </DisableableTypography>
    )
  }
  if (date && date.actual) {
    return (
      <React.Fragment>
        <DisableableTypography noWrap variant='body2' sx={{
          verticalAlign: 'middle',
          display: 'inline-flex',
        }}>
          <EventAvailableIcon sx={{ marginRight: '5px' }}/> {getTimeLabel(date.actual)}
        </DisableableTypography>
        {
          date.planned &&
          <DisableableTypography noWrap variant='body2' sx={{
            verticalAlign: 'middle',
            display: 'inline-flex',
            color: 'gray',
          }}>
            <ScheduleIcon sx={{ marginRight: '5px' }}/>{getTimeLabel(date.planned)}
          </DisableableTypography>
        }
      </React.Fragment>
    )
  } else if (date.planned) {
    return (
      <React.Fragment>
        <DisableableTypography noWrap variant='body2' sx={{
          verticalAlign: 'middle',
          display: 'inline-flex',
        }}>
          <ScheduleIcon sx={{ marginRight: '5px' }}/> {getTimeLabel(date.planned)}
        </DisableableTypography>
      </React.Fragment>
    )
  }
}

const Gantt = ({ equipment }: {equipment?: Equipment}) => {
  const statuses = [
    ...(equipment?.currentStatus ? [equipment?.currentStatus] : []),
    ...(equipment?.futureStatuses || []),
  ]

  console.log('statuses', statuses)

  return (equipment
    ? (<Grid>
      <Grid>
        {
          statuses.filter(s => (s.status as any) === 'AVAILABLE').map((s, idx) => {
            // return (<div key={idx}>{moment(s.validFromPlanned).format(DateFormat)}</div>)
            return showDate({ planned: s.validFromPlanned, actual: s.validFromActual })
          })
        }
      </Grid>
      <Grid>
        {
          statuses.filter(s => s.status === 'ALLOCATED').map((s, idx) => {
            // return (<div key={idx}>{moment(s.validFromPlanned).format(DateFormat)}</div>)
            return showDate({ planned: s.validFromPlanned, actual: s.validFromActual })
          })
        }
      </Grid>
    </Grid>)
    : (<Box>Not Container data available</Box>)
  )
}

const GanttChart = ({ equipmentId }: GanttChartProps) => {
  const { equipments, loadingStatus } = useSelector((state: AppState) => state.equipment)
  const equipment = equipments.find(c => c.equipmentId === equipmentId)

  return (
    <Box id='boards-table-wrapper' display='flex' flexDirection={'column'} maxHeight='50vh' pt={1} pb={1}>
      <Loading loading={loadingStatus}>
        <Box display='flex' flexDirection='column' overflow='hidden' height={'100%'}>
          <Gantt equipment={equipment}/>
        </Box>
      </Loading>
    </Box>
  )
}

export default GanttChart
