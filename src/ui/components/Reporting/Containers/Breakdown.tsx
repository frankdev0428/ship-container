import { Paper, styled } from '@mui/material'
import React from 'react'
import { Pie, PieChart, Legend, Label, ResponsiveContainer, Cell } from 'recharts'

import Typography from '../../Utils/Typography'

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
}))

const LegendWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
  gap: theme.spacing(1),
}))

const LegendUl = styled('ul')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  flexDirection: 'column',
  gap: theme.spacing(2),
}))

const COLORS = ['#1674D0', '#698D3C', '#D64933']

const CustomLabel = ({ viewBox, value }: any) => {
  const { cx, cy } = viewBox
  return (
    <g>
      <text
        x={cx}
        y={cy}
        textAnchor='middle'
        dominantBaseline='central'
        alignmentBaseline='middle'
        fill='#1674D0'
        fontSize='29.45044px'
      >
        {value}
      </text>
      <text
        x={cx}
        y={cy + 20}
        textAnchor='middle'
        dominantBaseline='central'
        alignmentBaseline='middle'
        fill='#757575'
        fontSize='10.04px'
      >
        ALLOCATED
      </text>
    </g>
  )
}

const CustomizedLegend = (props: any) => {
  const { payload } = props
  return (
    <LegendUl>
      {payload.map((entry:any, index: number) => (
          <LegendWrapper key={index}>
            <Bullet backgroundColor={entry.payload.fill} size='10px' />
            <Typography sx={{ fontSize: '10px' }}>{entry.payload.value} {entry.value}</Typography>
          </LegendWrapper>
      ))}
    </LegendUl>
  )
}

const Bullet = ({ backgroundColor, size }: any) => {
  return (
    <div
      style={{
        backgroundColor,
        width: size,
        height: size,
        borderRadius: '50%',
      }}
    ></div>
  )
}

interface BreakdownProps {
  numAllocated: number;
  numBlocked: number;
  numAvailable: number;
  total: number;
}

const Breakdown = ({ numAllocated, numBlocked, numAvailable, total }: BreakdownProps):JSX.Element => {
  const breakdownData = [
    { name: 'Allocated'.toUpperCase(), value: numAllocated },
    { name: 'Available'.toUpperCase(), value: numAvailable },
    { name: 'Blocked'.toUpperCase(), value: numBlocked },
  ]

  const allocPct = (numAllocated / total) * 100.0

  return (
    <StyledPaper elevation={5} sx={{ width: '100%' }}>
      <Typography variant='h6'>Container allocation breakdown</Typography>
      <div style={{ width: '80%', height: 165 }}>
      <ResponsiveContainer>
        <PieChart height={100}>
          <Pie
            data={breakdownData}
            dataKey='value'
            cx={100}
            cy={90}
            innerRadius={60}
            outerRadius={70}
          >
            {breakdownData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
            <Label
              content={(props: any) => <CustomLabel {...props} value={`${allocPct.toFixed(0)}%`} />}
              position='center'
            />
          </Pie>
          <Legend
          align='right'
          layout='vertical'
          verticalAlign='middle'
          content={(props: any) => <CustomizedLegend {...props} />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
    </StyledPaper>
  )
}

export default Breakdown
