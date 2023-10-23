import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material'
import React, { useState } from 'react'

// import { showError } from '../../../../store/error/actions'

// type TagProps = { label:string, value: string }

export interface NewValueDialogProps {
  title: string
  onClose: () => void
  onCreate: (v: string) => void
}

const NewValueDialog = ({ title, onClose, onCreate }: NewValueDialogProps): JSX.Element => {
  const [newValue, setNewValue] = useState('')

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    event.stopPropagation()
    onCreate(newValue)
  }

  return (
    <Dialog open={true} onClose={onClose}>
    <form onSubmit={submit}>
      <DialogTitle>{`New ${title}`}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {`Add a new ${title}`}
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          type="text"
          value={newValue}
          variant="outlined"
          onChange={(event) => setNewValue(event.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit">Add</Button>
      </DialogActions>
    </form>
  </Dialog>
  )
}

export default NewValueDialog
