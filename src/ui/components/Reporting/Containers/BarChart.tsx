import { Box, Paper, styled, useTheme } from '@mui/material'
import { add, format } from 'date-fns'
import React from 'react'
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip } from 'recharts'

import Typography from '../../Utils/Typography'

const PaperWrapper = styled(Paper)(({ theme }) => ({
  width: '200px',
  height: '200px',
  padding: theme.spacing(1),
  display: 'flex',
  flexDirection: 'column',
}))

const StyledLegendWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  marginRight: theme.spacing(1),
}))

const StyledTooltipWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
  width: '100%',
  border: '1px solid black',
  background: '#ffffffbf',
  padding: theme.spacing(1),
}))

const StyledPercentageSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
}))

const CustomTooltip = (props: any) => {
  const { payload, dateInterval, legendLabel } = props
  const tooltipLegend = payload && payload.length > 0 ? payload[0].payload : undefined

  const startDate = tooltipLegend && tooltipLegend.timestamp ? format(new Date(tooltipLegend.timestamp), 'dd-MM-yyyy') : undefined
  const endDate = tooltipLegend && dateInterval && tooltipLegend.timestamp ? format(add(new Date(tooltipLegend.timestamp), { days: dateInterval }), 'dd-MM-yyyy') : undefined
  return (
      <StyledTooltipWrapper>
       {tooltipLegend && tooltipLegend.value && <Typography variant='body1'><b>{legendLabel}:</b> {tooltipLegend.value}</Typography>}
       {startDate && endDate && <Typography variant='overline'><b>{startDate}</b> - <b>{endDate}</b></Typography>}
      </StyledTooltipWrapper>
  )
}

const WidgetInfo = (props: any) => {
  const { percentage, total, legendLabel, unit } = props

  return (
    <StyledLegendWrapper>
    <Typography variant='h6' style={{ color: '#000000', opacity: '60%' }}>{legendLabel}</Typography>
    <StyledPercentageSection>
      <Typography variant='h3' style={{ marginRight: 20 }}>{total?.toFixed(0)}{unit || ''}</Typography>
      <Typography variant='h6' style={{ color: percentage && Math.sign(percentage) === 1 ? '#698D3C' : '#D64933' }}>{percentage?.toFixed(0) || '-'}%</Typography>
      <Tooltip/>
    </StyledPercentageSection>
</StyledLegendWrapper>
  )
}

interface BarChartWidgetProps {
  data: {
    value: number,
    timestamp?: Date
  }[];
  barDataKey: string;
  legendLabel: string;
  dateInterval?: number;
  unit?: string
}

const BarChartWidget = ({ data, barDataKey, legendLabel, dateInterval, unit }: BarChartWidgetProps): JSX.Element => {
  const total = data?.length > 2 ? data[3].value : undefined // this is the middle bin
  const previousTotal = data?.length > 1 ? data[2].value : undefined // this is on left to the middle bin
  const percentDiffToPrevious = (total !== undefined && previousTotal !== undefined && previousTotal !== 0) ? (total - previousTotal) / previousTotal * 100 : total === 0 && previousTotal === 0 ? 0 : undefined

  const theme = useTheme()

  return (
    <PaperWrapper elevation={4}>
      <WidgetInfo unit={unit} legendLabel={legendLabel} total={total} percentage={percentDiffToPrevious}/>
      <Box height={0} flexGrow={1}>
      <ResponsiveContainer width={'100%'} height="100%">
        <BarChart
          data={data}
          barGap={1}
          width={20}
          height={20}
          >
          <Bar dataKey={barDataKey} fill="#C4C9D4" minPointSize={2}>
          {
            data.map((entry, index) => {
              return ((
                <Cell key={`cell-${index}`} fill={index === 3 ? theme.palette.primary.highlight : theme.palette.grey[400]} />
              ))
            })
          }
          </Bar>
          <Tooltip offset={30} allowEscapeViewBox={{ x: true, y: false }} content={<CustomTooltip legendLabel={legendLabel} dateInterval={dateInterval} />} cursor={{ fill: theme.palette.primary.highlight + '33' }}/>
        </BarChart>
      </ResponsiveContainer>
      </Box>
    </PaperWrapper>
  )
}

export default BarChartWidget
