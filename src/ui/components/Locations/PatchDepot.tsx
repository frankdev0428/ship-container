import React, { ChangeEvent, FormEvent, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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
} from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import UpdateIcon from '@mui/icons-material/Edit'

import Typography from '../Utils/Typography'
import { showError, showWarning } from '../../../store/error/actions'
import { PatchFacilityInput } from '../../../services/places/types'
import { modifyFacility } from '../../../services/places/actions'

const commonProps = {
  variant: 'outlined' as any,
  margin: 'dense' as any,
  size: 'small' as any,
  style: { minWidth: 160 },
}

interface PatchDepotDialogProps {
  facilityId: string;
  name: string;
  handleClose: () => void;
  handlePatch: (facilityId: string, depot: PatchFacilityInput) => void;
}

const PatchDepotDialog = ({ facilityId, name, handleClose, handlePatch }: PatchDepotDialogProps) => {
  const [patchDepot, setPatchDepot] = useState<PatchFacilityInput>({
    name: name,
  })

  const _dispatch = useDispatch()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.stopPropagation()
    event.preventDefault()

    if (facilityId === '') {
      _dispatch(showWarning(['Error']))
    } else {
      handlePatch(facilityId, patchDepot)
    }
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string) => {
    const keyType = typeof patchDepot[key as keyof PatchFacilityInput]

    setPatchDepot({
      ...patchDepot,
      [key]: keyType === 'number' ? parseInt(event.target.value) : event.target.value,
    })
  }

  const handleDialogClick = (event: any) => {
    event.stopPropagation()
  }

  return (
    <Dialog open={true} maxWidth={'sm'} fullWidth onClose={handleClose} onClick={handleDialogClick}>
      <DialogTitle>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography variant={'h6'}>Update Depot</Typography>
          {/* { loadingDepots && <CircularProgress sx={{ marginLeft: '16px' }} size={20} /> } */}
          <Box justifyContent={'flex-end'}>
            <IconButton size='small' onClick={handleClose}><ClearIcon/></IconButton>
          </Box>
        </Box>
        </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
            <Box display='flex' flexDirection='column' >
              <TextField {...commonProps} label="Name" value={patchDepot.name} onChange={e => handleChange(e, 'name')} />
            </Box>

        </DialogContent>
        <DialogActions>
          {/* <Button color='primary' onClick={handleClose}>Close</Button> */}
          <Button color='primary' variant='contained' type='submit' >Update</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

interface PatchDepotProps extends BoxProps {
  depot: {
    facilityId: string;
    name: string;
  };
  // onPatch: (facilityId: string, depot: FacilityInput) => void
}

const PatchDepot = ({ depot, ...boxProps }: PatchDepotProps) => {
  const [open, setOpen] = useState(false)

  const _dispatch = useDispatch()

  const onClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation()
    event.preventDefault()
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const onPatch = (facilityId: string, depot: PatchFacilityInput) => {
    _dispatch(modifyFacility(facilityId, depot))
  }

  const handlePatch = (facilityId: string, depot: PatchFacilityInput) => {
    setOpen(false)
    onPatch(facilityId, depot)
  }

  return (
    <Box {...boxProps} >
      <IconButton color='primary' size='small' onClick={onClick}>
        <UpdateIcon/>
      </IconButton>
      {
        open && <PatchDepotDialog
          facilityId={depot.facilityId}
          name={depot.name}
          handleClose={handleClose}
          handlePatch={handlePatch}
        />
      }
    </Box>
  )
}

export default PatchDepot
