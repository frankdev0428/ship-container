import React from 'react'
import { Box, Button } from '@mui/material'
import { Link } from 'react-router-dom'

import Typography from '../components/Utils/Typography'

const Home = () => {
  return (
    <Box>
      <Typography style = {{ marginTop: 15 }}>Shipments Flocktilla</Typography>
      <Button variant='outlined' color='primary' to={'/app1'} component={Link} >Go to app1</Button>
    </Box>
  )
}

export default Home
