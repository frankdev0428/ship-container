import { Grid } from '@mui/material'
import React from 'react'

import SelectPopper, { SelectPopperProps } from '../../Utils/SelectPopper'

interface GridPcikerProps extends SelectPopperProps {
  itemSize?: number
}
const GridPicker = ({ itemSize, ...props }: GridPcikerProps): JSX.Element => (
  <Grid item xs={itemSize || 6}>
    <SelectPopper {...props} style={{ marginTop: 4, marginBottom: 0 }}/>
  </Grid>
)

export default GridPicker
