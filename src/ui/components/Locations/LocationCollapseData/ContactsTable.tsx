import React, { FormEventHandler, Fragment, useEffect, useMemo, useState } from 'react'
import { styled } from '@mui/material/styles'
import {
  Box,
  Checkbox,
  IconButton,
  TableCell,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  tableCellClasses,
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import DeleteIcon from '@mui/icons-material/Delete'
import CloseIcon from '@mui/icons-material/Close'
import { DataGridPro, GridColDef, GridToolbarColumnsButton, useGridApiRef } from '@mui/x-data-grid-pro'

import { TableHeadCell } from '../../../../store/ui/types'
import { Alert } from '../../../../services/alerts/types'
import Typography, { DisableableTypography } from '../../Utils/Typography'
import OverflowTooltip from '../../shared/OverflowTooltip'
import GenericTable from '../../shared/GenericTable/Table'
import { AppState } from '../../../../store'
import { removeDepotContact } from '../../../../services/places/actions'
import { DepotContact } from '../../../../services/places/types'
import { ENABLE_DATAGRID } from '../../../globals'
import { setDatagridState } from '../../../../store/ui/actions'
import { CustomOverflowValue } from '../../shared/CustomOverflowValue'
import { setDefaultsDataGridState } from '../../shared/utils'

import ContactFormButton from './ContactFormButton'

export const containerDateFormat = 'DD-MM-YYYY'

const StyledDialogWrapper = styled(Box)({
  padding: '20px',
})

const StyledBox = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'row',
  width: '100%',
})

const StyledDialogActions = styled(DialogActions)({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: '20px',
})

const StyledTableRow = styled(TableRow)({
  '& > *': {
    borderBottom: 'unset',
  },
})

export const mapToContactRow = (contact: DepotContact): ContactRowDataProps => {
  return {
    id: contact.contactId,
    firstName: contact.firstName,
    lastName: contact.lastName,
    phone: contact.phone,
    mobile: contact.mobile,
    email: contact.email,
    role: contact.role,
    isRemoveFromBookingConfirmation: contact.isRemoveFromBookingConfirmation || false,
  }
}

const StyledTableCell = styled(TableCell)({
  [`&.${tableCellClasses.root}`]: {
    padding: '6px 8px 6px 8px',
  },
})

interface ContainerCellProps {
  headCell: TableHeadCell;
  container: ContactRowDataProps;
  headerCells: TableHeadCell[];
}

const ContainerCell = ({ headCell, container, headerCells }: ContainerCellProps): (JSX.Element | null) => {
  if (headCell.hide) return null

  const {
    id,
    firstName,
    lastName,
    phone,
    mobile,
    email,
    role,
    isRemoveFromBookingConfirmation,
  } = container

  const linkTo = true

  switch (headCell.id) {
    // case 'id':
    //   return (<StyledTableCell >
    //       <OverflowTooltip title={container.id} deps={[headerCells]} >
    //         <Typography noWrap variant='body1' >
    //           {linkTo
    //             ? <Link href={`/ecosystem/fleet-management/contacts?containerId=${id}`}>
    //             {id}
    //           </Link>
    //             : id}
    //         </Typography>
    //       </OverflowTooltip>
    //     </StyledTableCell>)
    case 'isRemoveFromBookingConfirmation':
      return (<TableCell>
        <Checkbox checked={container[headCell.id] as boolean} disableRipple sx={{ cursor: 'unset' }}></Checkbox>
      </TableCell>)
    default: return (<StyledTableCell >
        <OverflowTooltip title={container[headCell.id as 'id'] || ''} deps={[headerCells]} >
          <DisableableTypography noWrap variant='body1'>{container[headCell.id as 'id']}</DisableableTypography>
        </OverflowTooltip>
      </StyledTableCell>)
  }
}

export interface ContactRowDataProps {
  id: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  mobile?: string;
  email?: string;
  role?: string;
  isRemoveFromBookingConfirmation?: boolean;
}
export interface ContactRowProps extends ContactRowDataProps {
  headerCells: TableHeadCell[];
  isSelected?: boolean;
  handleRowClick?: (event: React.MouseEvent<unknown>, id: string) => void;
  onDismissAlerts?: (alerts: Alert[]) => void;
  noCollapse?: boolean;
  noActions?: boolean;
  facilityId: string;
}

const ContactRow = (props: ContactRowProps): JSX.Element => {
  const {
    headerCells,
    id,
    facilityId,
    firstName,
    lastName,
    phone,
    mobile,
    email,
    role,
    isRemoveFromBookingConfirmation,
    isSelected,
    handleRowClick,
    onDismissAlerts,
    noCollapse,
    noActions,
  } = props

  const labelId = `enhanced-table-checkbox-${id}`

  const cellProps = {
    id,
    firstName,
    lastName,
    phone,
    mobile,
    email,
    role,
    isRemoveFromBookingConfirmation,
  }

  return (
    <Fragment>
      <StyledTableRow
        hover
        role="checkbox"
        aria-checked={isSelected}
        tabIndex={-1}
        selected={isSelected}
        sx={{ cursor: 'pointer' }}
      >
        {!noCollapse &&
          <TableCell padding="checkbox">
            <Checkbox
              color='primary'
              checked={isSelected}
              inputProps={{ 'aria-labelledby': labelId }}
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                if (handleRowClick) handleRowClick(event, id)
              }}
            />
          </TableCell>
        }
        {
          headerCells.filter(h => h.label).map(hc =>
            <ContainerCell
              key={hc.id}
              headerCells={headerCells}
              headCell={hc}
              container={cellProps}
            />).filter(Boolean)
        }
        <TableCell padding={'none'} align='center'>
          <Box display='flex' alignItems={'center'} justifyContent={'space-between'} mb={1}>
            <UpdateContact depotId={facilityId} contact={{
              contactId: id,
              depotId: facilityId,
              firstName,
              lastName,
              phone,
              mobile,
              email,
              role,
              isRemoveFromBookingConfirmation,
            }}/>
            <DeleteContact depotId={facilityId} contactId={id}/>
          </Box>
        </TableCell>
      </StyledTableRow>
    </Fragment>
  )
}

const UpdateContact = ({ depotId, contact }:{depotId: string, contact: DepotContact}) => {
  return (<ContactFormButton
    label='Update contact'
    action={'edit'}
    depotId={depotId}
    contact={contact}
    iconButton={true}
    />)
}

const DeleteContact = ({ depotId, contactId }:{contactId: string; depotId: string}) => {
  const _dispatch = useDispatch()

  const [open, setOpen] = useState(false)

  const handleOpen = () => { setOpen(true) }

  const onClose = () => { handleClose() }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    event.stopPropagation()

    _dispatch(removeDepotContact(depotId, contactId))
    onClose()
  }

  const disableEnterKey = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Enter' && event.shiftKey === false) {
      event.preventDefault()
    }
  }

  return (
    <Box display="flex" alignItems="center">
      <IconButton color='primary' size='small' onClick={handleOpen}>
        <DeleteIcon color='error'/>
      </IconButton>
      {open && <Dialog
        fullWidth
        maxWidth={'md'}
        open={open}
        onClose={onClose}
        aria-labelledby="form-dialog-title"
        // sx={{ zIndex: 9999 }}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}>
      <form onSubmit={handleSubmit} onKeyDown={e => { disableEnterKey(e) }}>
        <StyledDialogWrapper>
          <StyledBox>
            <DialogTitle id="dialog-title">{'Remove contact'}</DialogTitle>
            <Box>
              <IconButton onClick={onClose} size="large">
                <CloseIcon />
              </IconButton>
            </Box>
          </StyledBox>
          <DialogContent sx={{ width: '100%' }}>
          </DialogContent>
          <StyledDialogActions>
            <Button variant="outlined" onClick={onClose} color="primary">
              CANCEL
            </Button>
            <Button variant="contained" type='submit' color="primary">
              {'Remove contact'}
            </Button>
          </StyledDialogActions>
        </StyledDialogWrapper>
        </form>
    </Dialog>}
    </Box>
  )

  // return (
  //   <IconButton color='primary' size='small' onClick={onClick}>
  //     <DeleteIcon color='error'/>
  //   </IconButton>
  // )
}

const NoData = () => {
  return (
    <Box margin={'4px auto'} width='80%'>
      <Typography align='center' variant='subtitle2'>{'There are no contacts in depot.'}</Typography>
    </Box>
  )
}

export const inititalContainerHeadCells: TableHeadCell[] = [
  // { id: 'id', isSortable: true, label: 'Container N°', hide: false },
  { id: 'firstName', isSortable: true, label: 'firstName', hide: false },
  { id: 'lastName', isSortable: true, label: 'lastName', hide: false },
  { id: 'phone', isSortable: true, label: 'phone', hide: false },
  { id: 'mobile', isSortable: true, label: 'mobile', hide: false },
  { id: 'email', isSortable: true, label: 'email', hide: false },
  { id: 'role', isSortable: true, label: 'role', hide: false },
  { id: 'isRemoveFromBookingConfirmation', isSortable: true, label: 'Not on booking conf.', hide: false },
  { id: 'actions', isSortable: false, align: 'center', label: null, width: 64 },
]

interface ContactTableProps {
  facilityId: string;
}

const ContactTable = ({ facilityId }: ContactTableProps) => {
  const apiRef = useGridApiRef()
  const contactsForDepots = useSelector((state: AppState) => state.places.contacts)
  const datagridState = useSelector((state: AppState) => state.ui.datagridState)

  // const equipment = equipments.find(e => e.facilityId === facilityId)
  const contacts: DepotContact[] = contactsForDepots.filter(c => c.depotId === facilityId) || []

  const _dispatch = useDispatch()
  useEffect(() => {
    // _dispatch(getDepotContacts(facilityId))
    if (ENABLE_DATAGRID && datagridState?.facilitiesContacts) {
      apiRef.current.restoreState(setDefaultsDataGridState(datagridState.facilitiesContacts))
    }
  }, [])

  const handleDispatch = () => {
    const columnState = apiRef.current.exportState()
    _dispatch(setDatagridState({ ...datagridState, facilitiesContacts: columnState }))
  }

  const columns = useMemo(() => [
    {
      field: 'actions',
      sortable: false,
      filterable: false,
      hideable: false,
      headerName: 'Actions',
      minWidth: 70,
      renderHeader: () => (
        <GridToolbarColumnsButton style={{ minWidth: 32 }} nonce={undefined} onResize={undefined} onResizeCapture={undefined} />
      ),
      renderCell: (params: {row: ContactRowProps}) => (
        <Box display='flex' alignItems={'center'} justifyContent={'space-between'} mb={1}>
          <UpdateContact depotId={params.row.facilityId} contact={{
            contactId: params.row.id,
            depotId: params.row.facilityId,
            firstName: params.row.firstName,
            lastName: params.row.lastName,
            phone: params.row.phone,
            mobile: params.row.mobile,
            email: params.row.email,
            role: params.row.role,
            isRemoveFromBookingConfirmation: params.row.isRemoveFromBookingConfirmation,
          }}/>
          <DeleteContact depotId={params.row.facilityId} contactId={params.row.id}/>
        </Box>
      ),
    },
    {
      field: 'firstName',
      headerName: 'firstName',
      renderCell: (params: {row: ContactRowProps}) => (
        <CustomOverflowValue dataKey={'facilitiesContacts'} value={params.row.firstName} />
      ),
      flex: 1,
    },
    {
      field: 'lastName',
      headerName: 'lastName',
      renderCell: (params: {row: ContactRowProps}) => (
        <CustomOverflowValue dataKey={'facilitiesContacts'} value={params.row.lastName} />
      ),
      flex: 1,
    },
    {
      field: 'phone',
      headerName: 'phone',
      renderCell: (params: {row: ContactRowProps}) => {
        <CustomOverflowValue dataKey={'facilitiesContacts'} value={params.row.phone} />
      },
      flex: 1,
    },
    {
      field: 'mobile',
      headerName: 'mobile',
      renderCell: (params: {row: ContactRowProps}) => (
        <CustomOverflowValue dataKey={'facilitiesContacts'} value={params.row.mobile} />
      ),
      flex: 1,
    },
    {
      field: 'email',
      headerName: 'email',
      renderCell: (params: {row: ContactRowProps}) => (
        <CustomOverflowValue dataKey={'facilitiesContacts'} value={params.row.email} />
      ),
      flex: 1,
    },
    {
      field: 'role',
      headerName: 'role',
      renderCell: (params: {row: ContactRowProps}) => (
        <CustomOverflowValue dataKey={'facilitiesContacts'} value={params.row.role} />
      ),
      flex: 1,
    },
    {
      field: 'isRemoveFromBookingConfirmation',
      headerName: 'Not on booking conf.',
      renderCell: (params: {row: ContactRowProps}) => (
        <Checkbox checked={params.row.isRemoveFromBookingConfirmation as boolean} disableRipple sx={{ cursor: 'unset' }}></Checkbox>
      ),
      flex: 1,
    },
  ] as GridColDef[],
  [])

  return (
    <Box id='moves-table-wrapper' sx={{ overflowY: 'auto' }} display='flex' flexDirection={'column'} maxHeight='40vh'>
      <Box display='flex' alignItems={'center'} justifyContent={'space-between'} height={'40vh'}>
        { ENABLE_DATAGRID
          ? <DataGridPro
            apiRef={ apiRef }
            initialState={{ columns: { columnVisibilityModel: {} } }}
            localeText={{ toolbarColumns: '' }}
            disableSelectionOnClick
            onColumnOrderChange={ handleDispatch }
            onColumnVisibilityModelChange={ handleDispatch }
            onColumnWidthChange={ handleDispatch }
            onPinnedColumnsChange={ handleDispatch }
            onSortModelChange={ handleDispatch }
            columns={ columns }
            rows={ contacts.map(mapToContactRow) }
            getRowId={ row => row.id }
          />
          : <GenericTable
            headerCells={inititalContainerHeadCells}
            order={'asc'}
            orderBy={'startPlanned'}
            rows={contacts.map(mapToContactRow)}
            handleSelectAllClick={() => {}}
            disableSelect
            noDataComponent={<NoData />}
            rowComponent={({ ...row }: ContactRowProps) => (
              <ContactRow
                {...row}
                headerCells={inititalContainerHeadCells}
                noCollapse={true}
                facilityId={facilityId}
              />
            )}
          />
        }
      </Box>
    </Box>
  )
}

export default ContactTable
