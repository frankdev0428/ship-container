import React from 'react'
import { Box, Chip, Collapse, Grid } from '@mui/material'

import Typography from '../../Utils/Typography'

import { FilterChip } from './FilterButton'

interface CollapsibleChipsProps {
  open?: boolean;
  chips: FilterChip[] | null;
}

const CollapsibleChips = ({ open, chips }:CollapsibleChipsProps) => {
  const items = chips?.map(c => (
    <Grid item key={c.label}>
      <Chip
        color="primary"
        variant='outlined'
        label={<Typography variant='label'>{c.label}</Typography>}
        onDelete={c.onRemove}
        sx={{ backgroundColor: '#3a58961a', border: 'none', height: '24px' }}
      />
      </Grid>
  ))

  return (
    <Collapse in={open} timeout="auto" unmountOnExit >
      {items?.length
        ? <Grid container spacing={1}>
          {items}
        </Grid>
        : <Box height={32}></Box>
      }
    </Collapse>
  )
}

export default CollapsibleChips
