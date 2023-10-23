import { Grid, StandardTextFieldProps, TextField } from '@mui/material'
import React from 'react'

interface GridFieldProps extends StandardTextFieldProps {
  commonProps?: any
  itemSize?: number
}
const GridField = ({ commonProps, itemSize, ...props }: GridFieldProps): JSX.Element => (
  <Grid item xs={itemSize || 6}>
    <TextField style={{ ...commonProps?.style && commonProps?.style, marginTop: 4, marginBottom: 0 }} {...props}/>
  </Grid>
)

export default GridField
