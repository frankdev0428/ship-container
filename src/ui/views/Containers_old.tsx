import React from 'react'
import Checkbox from '@mui/material/Checkbox'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
// import { Link } from 'react-router-dom'
import {
  Box,
  Button,
  // AppBar,
  // Toolbar,
  // IconButton,
  // InputBase,
  // Badge,
  MenuItem,
  // Menu,
  // InputLabel,
  // FormHelperText,
  // FormControl,
  Select,
  TextField,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material'
// import MenuIcon from '@mui/icons-material/Menu'
// import SearchIcon from '@mui/icons-material/Search'
// import AccountCircle from '@mui/icons-material/AccountCircle'
// import MailIcon from '@mui/icons-material/Mail'
// import NotificationsIcon from '@mui/icons-material/Notifications'
// import MoreIcon from '@mui/icons-material/MoreVert'

import Typography from '../components/Utils/Typography'

const TagProps = {
  boolean: true,
  label: 'NEXT TEST',
  date: 2021,
}
const top100Films = [
  { title: 'Container 1' },
  { title: 'Container 2' },
  { title: 'Container 3' },
]

const Home = () => {
  return (
    <Box>
    <Box sx={{ width: '300px', marginTop: '50px', marginLeft: '50px' }}>

<Autocomplete
      id="combo-box-demo"
      options={top100Films}
      getOptionLabel={(option) => option.title}
      sx={{ width: '300px' }}
      renderInput={(params) => <TextField {...params} label="Search" variant="outlined" />}
    />

</Box>
<Box sx={{ marginTop: '-70px', marginLeft: '400px' }}>
<Button
      variant="outlined"
      sx={{
        backgroundColor: '#ffffff',
        color: '#2B303A',
        borderColor: '#2B303A',
        borderWidth: '2px',
        width: '150px',
        marginLeft: 0,
        marginTop: '20px',
      }}>
          NEW ORDER
          </Button>
          <Button
      variant="outlined"
      sx={{
        backgroundColor: '#ffffff',
        color: '#2B303A',
        borderColor: '#2B303A',
        borderWidth: '2px',
        width: '200px',
        marginLeft: '50px',
        marginTop: '20px',
      }}>
          CHANGE STATUS
          </Button>

          <Button
      variant="outlined"
      sx={{
        backgroundColor: '#2B303A',
        color: '#ffffff',
        borderColor: '#2B303A',
        borderWidth: '2px',
        width: '200px',
        marginLeft: '750px',
        marginTop: '-75px',
      }}>
          NEW CONTAINER
          </Button>

</Box>

<TableContainer component={Paper} style ={{ width: '1350px', marginLeft: '25px' }}>
      <Table aria-label="customized table">
        <TableHead sx={{
          backgroundColor: '#F4F5F8',
          color: '#2B303A',
          border: '#F4F5F8',
          fontSize: 17,
        }}>
          <TableRow>
          <TableCell align="right" sx={{
            borderWidth: 0,
            borderRightWidth: '1px',
            borderColor: '#E1E3E9',
            borderStyle: 'solid',
          }}
        padding="checkbox">

        <Checkbox/>
{/* <InputLabel id="demo-simple-select-label">Age</InputLabel> */}
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
        >
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>

          </TableCell>
            <TableCell align="right" sx={{
              borderWidth: 0,
              borderRightWidth: '1px',
              borderColor: '#E1E3E9',
              borderStyle: 'solid',
            }} >
              <Typography
              sx={{
                fontFamily: 'Lato',
                fontWeight: 400,
                fontSize: 17,
                letterSpacing: 0.5,
                color: '#2B303A',
              }}
              >Container N0
              </Typography>
              </TableCell>
            <TableCell align="right" sx={{
              borderWidth: 0,
              borderRightWidth: '1px',
              borderColor: '#E1E3E9',
              borderStyle: 'solid',
            }}>
            <Typography
              sx={{
                fontFamily: 'Lato',
                fontWeight: 400,
                fontSize: 17,
                letterSpacing: 0.5,
                color: '#2B303A',
              }}
              >Client
              </Typography>
            </TableCell>
            <TableCell align="right" sx={{
              borderWidth: 0,
              borderRightWidth: '1px',
              borderColor: '#E1E3E9',
              borderStyle: 'solid',
            }}>
              <Typography
              sx={{
                fontFamily: 'Lato',
                fontWeight: 400,
                fontSize: 17,
                letterSpacing: 0.5,
                color: '#2B303A',
              }}
              >Transit State
              </Typography></TableCell>
            <TableCell align="right" sx={{
              borderWidth: 0,
              borderRightWidth: '1px',
              borderColor: '#E1E3E9',
              borderStyle: 'solid',
            }}>
            <Typography
              sx={{
                fontFamily: 'Lato',
                fontWeight: 400,
                fontSize: 17,
                letterSpacing: 0.5,
                color: '#2B303A',
              }}
              >
                 Availibility
              </Typography>
            </TableCell>
            <TableCell align="right" sx={{
              borderWidth: 0,
              borderRightWidth: '1px',
              borderColor: '#E1E3E9',
              borderStyle: 'solid',
            }}>
            <Typography
              sx={{
                fontFamily: 'Lato',
                fontWeight: 400,
                fontSize: 17,
                letterSpacing: 0.5,
                color: '#2B303A',
              }}
              >
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell align="right"
            padding="checkbox"
            sx={{ width: '200px' }}>
              <Typography
              sx={{
                fontFamily: 'Lato',
                fontWeight: 400,
                fontSize: 17,
                letterSpacing: 0.5,
                color: '#2B303A',
              }}
              >
                <Checkbox/>
              CAVU 0000060
              </Typography>
              </TableCell>
            <TableCell align="right">
            <Typography
              sx={{
                fontFamily: 'Lato',
                fontWeight: 400,
                fontSize: 17,
                letterSpacing: 0.5,
                color: '#2B303A',
              }}
              >
                <FiberManualRecordIcon sx={{ color: '#698D3C' }} /> Available
              </Typography>
              </TableCell>
              <TableCell align="right">
            <Typography
              sx={{
                fontFamily: 'Lato',
                fontWeight: 400,
                fontSize: 17,
                letterSpacing: 0.5,
                color: '#2B303A',
              }}
              >
                AELER
              </Typography>
              </TableCell>
              <TableCell align="right">
            <Typography
              sx={{
                fontFamily: 'Lato',
                fontWeight: 400,
                fontSize: 17,
                letterSpacing: 0.5,
                color: '#2B303A',
              }}
              >
                EMPLY
              </Typography>
              </TableCell>
            <TableCell align="right">
            <Typography
              sx={{
                fontFamily: 'Lato',
                fontWeight: 400,
                fontSize: 17,
                letterSpacing: 0.5,
                color: '#2B303A',
              }}
              >
                2021-07-20 DEHAM
                </Typography>
                </TableCell>
                <TableCell>
                <div style={{
                  margin: '4px',
                  borderRadius: '4px',
                  border: '1px solid #FA8E1E',
                  backgroundColor: '#F29450',
                  width: '125px',
                }}>
                  <Typography
                  sx={{
                    fontFamily: 'Lato',
                    fontWeight: 400,
                    fontSize: 10,
                    letterSpacing: 0.31,
                    color: '#2B303A',
                  }}>
                      NEXT TEST: 2021-10
                  </Typography>
                </div>
                </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="right"
            padding="checkbox"
            sx={{ width: '200px' }}>
              <Typography
              sx={{
                fontFamily: 'Lato',
                fontWeight: 400,
                fontSize: 17,
                letterSpacing: 0.5,
                color: '#2B303A',
              }}
              >
                <Checkbox/>
              CAVU 0000060
              </Typography>
              </TableCell>
            <TableCell align="right">
            <Typography
              sx={{
                fontFamily: 'Lato',
                fontWeight: 400,
                fontSize: 17,
                letterSpacing: 0.5,
                color: '#2B303A',
              }}
              >
                <FiberManualRecordIcon sx={{ color: '#698D3C' }} /> Available
              </Typography>
              </TableCell>
              <TableCell align="right">
            <Typography
              sx={{
                fontFamily: 'Lato',
                fontWeight: 400,
                fontSize: 17,
                letterSpacing: 0.5,
                color: '#2B303A',
              }}
              >
                AELER
              </Typography>
              </TableCell>
              <TableCell align="right">
            <Typography
              sx={{
                fontFamily: 'Lato',
                fontWeight: 400,
                fontSize: 17,
                letterSpacing: 0.5,
                color: '#2B303A',
              }}
              >
                EMPLY
              </Typography>
              </TableCell>
            <TableCell align="right">
            <Typography
              sx={{
                fontFamily: 'Lato',
                fontWeight: 400,
                fontSize: 17,
                letterSpacing: 0.5,
                color: '#2B303A',
              }}
              >
                2021-07-20 DEHAM
                </Typography>
                </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="right"
            padding="checkbox"
            sx={{ width: '200px' }}>
              <Typography
              sx={{
                fontFamily: 'Lato',
                fontWeight: 400,
                fontSize: 17,
                letterSpacing: 0.5,
                color: '#2B303A',
              }}
              >
                <Checkbox/>
              CAVU 0000060
              </Typography>
              </TableCell>
            <TableCell align="right">
            <Typography
              sx={{
                fontFamily: 'Lato',
                fontWeight: 400,
                fontSize: 17,
                letterSpacing: 0.5,
                color: '#2B303A',
              }}
              >
                <FiberManualRecordIcon sx={{ color: '#D64933' }} /> Allocated
              </Typography>
              </TableCell>
              <TableCell align="right">
            <Typography
              sx={{
                fontFamily: 'Lato',
                fontWeight: 400,
                fontSize: 17,
                letterSpacing: 0.5,
                color: '#2B303A',
              }}
              >
                Leschaco
              </Typography>
              </TableCell>
              <TableCell align="right">
            <Typography
              sx={{
                fontFamily: 'Lato',
                fontWeight: 400,
                fontSize: 17,
                letterSpacing: 0.5,
                color: '#2B303A',
              }}
              >
                LOAD/ON VESSEL
              </Typography>
              </TableCell>
            <TableCell align="right">
            <Typography
              sx={{
                fontFamily: 'Lato',
                fontWeight: 400,
                fontSize: 17,
                letterSpacing: 0.5,
                color: '#2B303A',
              }}
              >
                2021-07-20 DEHAM
                </Typography>
                </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="right"
            padding="checkbox"
            sx={{ width: '200px' }}>
              <Typography
              sx={{
                fontFamily: 'Lato',
                fontWeight: 400,
                fontSize: 17,
                letterSpacing: 0.5,
                color: '#2B303A',
              }}
              >
                <Checkbox/>
              CAVU 0000060
              </Typography>
              </TableCell>
            <TableCell align="right">
            <Typography
              sx={{
                fontFamily: 'Lato',
                fontWeight: 400,
                fontSize: 17,
                letterSpacing: 0.5,
                color: '#2B303A',
              }}
              >
                <FiberManualRecordIcon sx={{ color: '#D64933' }} /> Allocated
              </Typography>
              </TableCell>
              <TableCell align="right">
            <Typography
              sx={{
                fontFamily: 'Lato',
                fontWeight: 400,
                fontSize: 17,
                letterSpacing: 0.5,
                color: '#2B303A',
              }}
              >
                Leschaco
              </Typography>
              </TableCell>
              <TableCell align="right">
            <Typography
              sx={{
                fontFamily: 'Lato',
                fontWeight: 400,
                fontSize: 17,
                letterSpacing: 0.5,
                color: '#2B303A',
              }}
              >
                LOAD/ON VESSEL
              </Typography>
              </TableCell>
            <TableCell align="right">
            <Typography
              sx={{
                fontFamily: 'Lato',
                fontWeight: 400,
                fontSize: 17,
                letterSpacing: 0.5,
                color: '#2B303A',
              }}
              >
                2021-07-20 DEHAM
                </Typography>
                </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="right"
            padding="checkbox"
            sx={{ width: '200px' }}>
              <Typography
              sx={{
                fontFamily: 'Lato',
                fontWeight: 400,
                fontSize: 17,
                letterSpacing: 0.5,
                color: '#2B303A',
              }}
              >
                <Checkbox/>
              CAVU 0000060
              </Typography>
              </TableCell>
            <TableCell align="right">
            <Typography
              sx={{
                fontFamily: 'Lato',
                fontWeight: 400,
                fontSize: 17,
                letterSpacing: 0.5,
                color: '#2B303A',
              }}
              >
                <FiberManualRecordIcon sx={{ color: '#D64933' }} /> Allocated
              </Typography>
              </TableCell>
              <TableCell align="right">
            <Typography
              sx={{
                fontFamily: 'Lato',
                fontWeight: 400,
                fontSize: 17,
                letterSpacing: 0.5,
                color: '#2B303A',
              }}
              >
                Leschaco
              </Typography>
              </TableCell>
              <TableCell align="right">
            <Typography
              sx={{
                fontFamily: 'Lato',
                fontWeight: 400,
                fontSize: 17,
                letterSpacing: 0.5,
                color: '#2B303A',
              }}
              >
                LOAD/ON VESSEL
              </Typography>
              </TableCell>
            <TableCell align="right">
            <Typography
              sx={{
                fontFamily: 'Lato',
                fontWeight: 400,
                fontSize: 17,
                letterSpacing: 0.5,
                color: '#2B303A',
              }}
              >
                2021-07-20 DEHAM
                </Typography>
                </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="right"
            padding="checkbox"
            sx={{ width: '200px' }}>
              <Typography
              sx={{
                fontFamily: 'Lato',
                fontWeight: 400,
                fontSize: 17,
                letterSpacing: 0.5,
                color: '#2B303A',
              }}
              >
                <Checkbox/>
              CAVU 0000060
              </Typography>
              </TableCell>
            <TableCell align="right">
            <Typography
              sx={{
                fontFamily: 'Lato',
                fontWeight: 400,
                fontSize: 17,
                letterSpacing: 0.5,
                color: '#2B303A',
              }}
              >
                <FiberManualRecordIcon sx={{ color: '#D64933' }} /> Allocated
              </Typography>
              </TableCell>
              <TableCell align="right">
            <Typography
              sx={{
                fontFamily: 'Lato',
                fontWeight: 400,
                fontSize: 17,
                letterSpacing: 0.5,
                color: '#2B303A',
              }}
              >
                Leschaco
              </Typography>
              </TableCell>
              <TableCell align="right">
            <Typography
              sx={{
                fontFamily: 'Lato',
                fontWeight: 400,
                fontSize: 17,
                letterSpacing: 0.5,
                color: '#2B303A',
              }}
              >
                LOAD/ON VESSEL
              </Typography>
              </TableCell>
            <TableCell align="right">
            <Typography
              sx={{
                fontFamily: 'Lato',
                fontWeight: 400,
                fontSize: 17,
                letterSpacing: 0.5,
                color: '#2B303A',
              }}
              >
                2021-07-20 DEHAM
                </Typography>
                </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="right"
            padding="checkbox"
            sx={{ width: '200px' }}>
              <Typography
              sx={{
                fontFamily: 'Lato',
                fontWeight: 400,
                fontSize: 17,
                letterSpacing: 0.5,
                color: '#2B303A',
              }}
              >
                <Checkbox/>
              CAVU 0000060
              </Typography>
              </TableCell>
            <TableCell align="right">
            <Typography
              sx={{
                fontFamily: 'Lato',
                fontWeight: 400,
                fontSize: 17,
                letterSpacing: 0.5,
                color: '#2B303A',
              }}
              >
                <FiberManualRecordIcon sx={{ color: '#698D3C' }} /> Available
              </Typography>
              </TableCell>
              <TableCell align="right">
            <Typography
              sx={{
                fontFamily: 'Lato',
                fontWeight: 400,
                fontSize: 17,
                letterSpacing: 0.5,
                color: '#2B303A',
              }}
              >
                AELER
              </Typography>
              </TableCell>
              <TableCell align="right">
            <Typography
              sx={{
                fontFamily: 'Lato',
                fontWeight: 400,
                fontSize: 17,
                letterSpacing: 0.5,
                color: '#2B303A',
              }}
              >
                EMPLY
              </Typography>
              </TableCell>
            <TableCell align="right">
            <Typography
              sx={{
                fontFamily: 'Lato',
                fontWeight: 400,
                fontSize: 17,
                letterSpacing: 0.5,
                color: '#2B303A',
              }}
              >
                2021-07-20 DEHAM
                </Typography>
                </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="right"
            padding="checkbox"
            sx={{ width: '200px' }}>
              <Typography
              sx={{
                fontFamily: 'Lato',
                fontWeight: 400,
                fontSize: 17,
                letterSpacing: 0.5,
                color: '#2B303A',
              }}
              >
                <Checkbox/>
              CAVU 0000060
              </Typography>
              </TableCell>
            <TableCell align="right">
            <Typography
              sx={{
                fontFamily: 'Lato',
                fontWeight: 400,
                fontSize: 17,
                letterSpacing: 0.5,
                color: '#2B303A',
              }}
              >
                <FiberManualRecordIcon sx={{ color: '#FA8E1E' }} /> M and R
              </Typography>
              </TableCell>
              <TableCell align="right">
            <Typography
              sx={{
                fontFamily: 'Lato',
                fontWeight: 400,
                fontSize: 17,
                letterSpacing: 0.5,
                color: '#2B303A',
              }}
              >
                AELER
              </Typography>
              </TableCell>
              <TableCell align="right">
            <Typography
              sx={{
                fontFamily: 'Lato',
                fontWeight: 400,
                fontSize: 17,
                letterSpacing: 0.5,
                color: '#2B303A',
              }}
              >
                EMPLY
              </Typography>
              </TableCell>
            <TableCell align="right">
            <Typography
              sx={{
                fontFamily: 'Lato',
                fontWeight: 400,
                fontSize: 17,
                letterSpacing: 0.5,
                color: '#2B303A',
              }}
              >
                2021-07-20 DEHAM
                </Typography>
                </TableCell>
          </TableRow>
      </TableBody>
      </Table>
      </TableContainer>

    </Box>
  )
}

export default Home
