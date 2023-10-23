import React from 'react'
import { Divider, List, ListItem, ListItemText, ListSubheader, Paper, styled } from '@mui/material'
import CircleIcon from '@mui/icons-material/Circle'

import { ContainerStatus, OrderStatus } from '../../../../services/reporting/types'

interface StyledHeaderListItemProps {
  position: 'left' | 'right';
}

interface BulletProps {
  bulletColor: string;
}

const StyledHeaderListItem = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== 'position',
})<StyledHeaderListItemProps>(({ position }) => ({
  color: '#20365F',
  textAlign: position,
}))

const Bullet = styled(CircleIcon, {
  shouldForwardProp: (prop) => prop !== 'bulletColor',
})<BulletProps>(({ bulletColor }) => ({
  color: bulletColor,
  fontSize: '10px',
}))

const StyledListSubheader = styled(ListSubheader)({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  backgroundColor: '#F4F5F7',
  gap: 20,
  padding: '0px 10px',
})

const StyledList = styled(List)({
  padding: 0,
})

const StyledListItem = styled(ListItem)({
  display: 'flex',
  flexDirection: 'row',
})

const StyledLabelBox = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',
  gap: theme.spacing(1),
}))

const StyledWrapperDiv = styled('div')({
  padding: '0px 10px',
})

  interface ReportsListProps {
    section: 'containers' | 'orders';
    containersStatus?: ContainerStatus;
    ordersStatus?: OrderStatus;
    total?: string
    containerAvailable?: string
  }

const ReportsList = ({ section, containersStatus, ordersStatus, containerAvailable, total }: ReportsListProps): JSX.Element => {
  const containerSection = section === 'containers'

  const reportsList = containerSection
    ? [
        { label: 'Production', bulletColor: '#FA8E1E', number: containersStatus?.PRODUCTION },
        { label: 'Allocated', bulletColor: '#D64933', number: containersStatus?.ALLOCATED },
        { label: 'Available', bulletColor: '#698D3C', number: containerAvailable },
        { label: 'M&R', bulletColor: '#D64933', number: containersStatus?.MNR },
      ]
    : [
        { label: 'Created', bulletColor: '#FA8E1E', number: ordersStatus?.CREATED },
        { label: 'Accepted', bulletColor: '#FA8E1E', number: ordersStatus?.ACCEPTED },
        { label: 'Ready', bulletColor: '#698D3C' },
        { label: 'Ongoing', bulletColor: '#1674D0', number: ordersStatus?.ONGOING },
        { label: 'Outdated', bulletColor: '#D64933', number: ordersStatus?.OUTDATED },
        { label: 'Completed', bulletColor: '#68748D', number: ordersStatus?.COMPLETED_FULFILLED },
      ]

  return (
    <Paper elevation={5} sx={{ width: '30%', height: '100%' }}>
      <StyledList aria-label="container reporting list">
        <StyledListSubheader>
          <StyledHeaderListItem position={'left'}>
            <ListItemText primary='Status' />
          </StyledHeaderListItem>
          <StyledHeaderListItem position={'right'}>
            <ListItemText primary={total || ''} />
          </StyledHeaderListItem>
        </StyledListSubheader>
        {reportsList.map((r, index) => {
          return (<StyledWrapperDiv key={index}>
                <StyledListItem>
                  <StyledLabelBox>
                    <Bullet bulletColor={r.bulletColor || ''}/>
                    <ListItemText primaryTypographyProps={{ fontSize: '10px', paddingTop: '10px', paddingBottom: '10px' }} primary={r.label.toUpperCase() || ''} />
                  </StyledLabelBox>
                  <ListItemText primaryTypographyProps={{ fontSize: '10px' }} primary={r.number || 0} />
                </StyledListItem>
                <Divider />
                </StyledWrapperDiv>)
        })}
      </StyledList>
    </Paper>
  )
}

export default ReportsList
