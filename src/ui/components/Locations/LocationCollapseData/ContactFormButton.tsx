import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { styled } from '@mui/material/styles'
import { Box, Button, IconButton } from '@mui/material'
import UpdateIcon from '@mui/icons-material/Edit'

import { DisableableTypography } from '../../Utils/Typography'
import { DepotContact } from '../../../../services/places/types'

import ContactForm from './ContactForm'

const LinkButton = styled(Button)({
  padding: '0px',
})

export interface ContactFormButtonProps {
  label: string;
  depotId: string;
  contact?: DepotContact;
  disabled?: boolean;
  action: 'create' | 'edit';
  iconButton?: boolean
}

const ContactFormButton = ({ depotId, contact, label, disabled, action, iconButton }: ContactFormButtonProps): JSX.Element => {
  const [open, setOpen] = useState(false)

  const handleOpen = () => { setOpen(true) }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Box display="flex" alignItems="center">
     {!iconButton && <Button
        disabled={disabled}
        size='small'
        {...action === 'create' && { variant: 'contained' }}
        {...action === 'edit' && { variant: 'outlined' }}
        color="primary"
        onClick={handleOpen}
      >
        {label}
      </Button>}
      {iconButton &&
        <IconButton color='primary' size='small' onClick={handleOpen}>
          {action === 'edit' && <UpdateIcon/>}
        </IconButton>
      }
      {open && <ContactForm depotId={depotId} contact={contact} open={open} onClose={handleClose}/>}
    </Box>
  )
}

export default ContactFormButton
