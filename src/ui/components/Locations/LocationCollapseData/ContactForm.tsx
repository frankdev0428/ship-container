import {
  Box,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  IconButton,
  Typography,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import React, { FocusEventHandler, FormEventHandler, useCallback, useEffect, useMemo, useState, useRef, ChangeEvent } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { useDispatch, useSelector } from 'react-redux'

import { DepotContact } from '../../../../services/places/types'
import { addDepotContact, updateDepotContact } from '../../../../services/places/actions'

const commonProps = {
  variant: 'outlined' as any,
  margin: 'dense' as any,
  size: 'small' as any,
  style: { minWidth: 160 },
}

const StyledDialogWrapper = styled(Box)({
  padding: '20px',
})

const StyledBox = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'row',
  width: '100%',
})

export const StyledInputBox = styled(Box)({
  marginBottom: '30px',
})

export const StyledFormControl = styled(FormControl)({
  minWidth: '200px',
  marginTop: '10px',
  flexGrow: 1,
})

const StyledDialogActions = styled(DialogActions)({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: '20px',
})

export interface ContactFormProps {
  firstName?: string;
  lastName?: string;
  phone?: string;
  mobile?: string;
  email?: string;
  role?: string;
  isRemoveFromBookingConfirmation?: boolean;
}
export interface CreateMovesFormProps {
  open: boolean;
  depotId: string
  contact?: DepotContact;
  onClose: () => void;
}

const ContactForm = ({ open, contact, depotId, onClose }: CreateMovesFormProps): JSX.Element => {
  const isNew = !contact?.contactId

  const [contactForm, setContactForm] = useState<ContactFormProps>({
    firstName: contact?.firstName,
    lastName: contact?.lastName,
    phone: contact?.phone,
    mobile: contact?.mobile,
    email: contact?.email,
    role: contact?.role,
    isRemoveFromBookingConfirmation: contact?.isRemoveFromBookingConfirmation,
  })

  const dispatch = useDispatch()

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    event.stopPropagation()

    if (contactForm) {
      dispatch(isNew
        ? addDepotContact({ depotId: depotId, contact: contactForm, role: contactForm.role, isRemoveFromBookingConfirmation: contactForm.isRemoveFromBookingConfirmation })
        : updateDepotContact(depotId, contact?.contactId || 'fixme', { contact: contactForm, role: contactForm.role, isRemoveFromBookingConfirmation: contactForm.isRemoveFromBookingConfirmation }))
    }

    onClose()
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string) => {
    setContactForm({
      ...contactForm,
      [key]: event.target.value,
    })
  }

  const chipLabel = isNew ? 'NEW' : 'ACTIVE'
  const disableEnterKey = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Enter' && event.shiftKey === false) {
      event.preventDefault()
    }
  }

  return (
    <Dialog
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
            <DialogTitle id="dialog-title">{`${isNew ? 'Create' : 'Edit'} contact`}</DialogTitle>
            <Box>
              {chipLabel && <Chip sx={{ minWidth: '100px' }} label={chipLabel} color="primary" />}
              <IconButton onClick={onClose} size="large">
                <CloseIcon />
              </IconButton>
            </Box>
          </StyledBox>
          <DialogContent sx={{ width: '100%' }}>
            <Box display='flex' flexDirection='column'>
              <TextField {...commonProps} label="firstName" value={contactForm.firstName} onChange={e => handleChange(e, 'firstName')} />
              <TextField {...commonProps} label="lastName" value={contactForm.lastName} onChange={e => handleChange(e, 'lastName')} />
              <TextField {...commonProps} label="phone" value={contactForm.phone} onChange={e => handleChange(e, 'phone')} />
              <TextField {...commonProps} label="mobile" value={contactForm.mobile} onChange={e => handleChange(e, 'mobile')} />
              <TextField {...commonProps} label="email" value={contactForm.email} onChange={e => handleChange(e, 'email')} />
              <TextField {...commonProps} label="role" value={contactForm.role} onChange={e => handleChange(e, 'role')} />
              <FormControlLabel
                control={
                  <Checkbox
                    color='primary'
                    checked={contactForm.isRemoveFromBookingConfirmation}
                    onChange={e => setContactForm({
                      ...contactForm,
                      isRemoveFromBookingConfirmation: (e.target as any).checked,
                    })}
                  />
                }
                label={'Remove from booking confirmation email'}
              />
            </Box>
          </DialogContent>
          <StyledDialogActions>
            <Button variant="outlined" onClick={onClose} color="primary">
              CANCEL
            </Button>
            <Button variant="contained" type='submit' color="primary">
              {isNew ? 'Create contact' : 'Save changes'}
            </Button>
          </StyledDialogActions>
        </StyledDialogWrapper>
      </form>
    </Dialog>
  )
}

export default ContactForm
