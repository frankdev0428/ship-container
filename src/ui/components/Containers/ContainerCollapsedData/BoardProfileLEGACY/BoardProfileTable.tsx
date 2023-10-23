import React, { Fragment } from 'react'
/*
FIXME: LEGACY CODE FROM BOARDS V1 -- remove it later
*/

// import { Box, Grid, TextField, Button } from '@mui/material'
// import { useSelector } from 'react-redux'

// import { AppState } from '../../../../../store'
// import GenericTable from '../../../shared/GenericTable/Table'
// import { Loading } from '../../../shared/component_utils'
// import BoardRow, { mapToBoardRow, BoardRowProps } from '../../../Boards/BoardRow'
// import Typography from '../../../Utils/Typography'
// import { inititalBoardHeadCells } from '../../../../views/Boards'
// import { ContainerWithProfile } from '../../../../../services/equipment/types'

// import NewBoardProfile from './NewBoardProfile'

// const NoData = () => {
//   return (
//     <Box margin={'4px auto'} width='80%'>
//       <Typography align='center' variant='subtitle2'>{'There are no depotments yet.'}</Typography>
//     </Box>
//   )
// }

// interface BoardProfileTableProps {
//   containerId?: string;
//   boardIds?: string[];
// }

// const ContainerBoards = ({ container }: {container?: ContainerWithProfile}) => {
//   const containerBoardProfile = (container?.containersensorsprofiles && container?.containersensorsprofiles.length > 0) ? container?.containersensorsprofiles[0] : undefined

//   const commonProps = {
//     margin: 'dense' as const,
//     variant: 'outlined' as const,
//     // InputLabelProps: { shrink: true },
//   }
//   return (<Fragment>
//     {
//       (container && containerBoardProfile)
//         ? <Box display='flex' sx={{ gap: '8px' }}>
//           <TextField {...commonProps} label="Provider" value={containerBoardProfile.source || ''} InputLabelProps={{ shrink: true }} />
//           <TextField {...commonProps} label="Aeler device ID" value={containerBoardProfile.aelerBoardId || ''} InputLabelProps={{ shrink: true }} />
//           <TextField {...commonProps} label="Date fitted Aeler" value={containerBoardProfile.dateFittedAeler?.toISOString() || ''} InputLabelProps={{ shrink: true }} />
//           <TextField {...commonProps} label="Nexxiot device ID" value={containerBoardProfile.nexxiotBoardId || ''} InputLabelProps={{ shrink: true }} />
//           <TextField {...commonProps} label="Date fitted Nexxiot" value={containerBoardProfile.dateFittedNexxiot?.toISOString() || ''} InputLabelProps={{ shrink: true }} />
//           <TextField {...commonProps} label="Kizy device ID" value={containerBoardProfile.kizyBoardId || ''} InputLabelProps={{ shrink: true }} />
//           <TextField {...commonProps} label="Date fitted Kizy" value={containerBoardProfile.dateFittedKizy?.toISOString() || ''} InputLabelProps={{ shrink: true }} />
//           <TextField {...commonProps} label="update" value={containerBoardProfile.createdAt?.toISOString() || ''} InputLabelProps={{ shrink: true }} />
//           {/* <Button variant='contained' color='primary' size='small' onClick={() => onUpdate(containerBoardProfile)}>Modify device pairing</Button> */}
//         </Box>
//         : <Box>No Container boards profile available</Box>
//     }
//     {container && <NewBoardProfile containerId={container.containerId} profile={containerBoardProfile} />}
//     </Fragment>)
// }

// const BoardProfileTable = ({ containerId, boardIds }: BoardProfileTableProps) => {
//   const { boards, loadingStatusAeler, loadingStatusKizy, loadingStatusNexxiot, loadingStatusContainerId } = useSelector((state: AppState) => state.boards)
//   const containers = useSelector((state: AppState) => state.equipment.containers)
//   const container = containers.find(c => c.containerId === containerId)

//   const loadingStatus = (loadingStatusAeler && loadingStatusKizy && loadingStatusNexxiot && loadingStatusContainerId)

//   return (
//     <Box id='boards-table-wrapper' display='flex' flexDirection={'column'} maxHeight='50vh'>
//       <Loading loading={loadingStatus}>
//         <Box display='flex' flexDirection='column' overflow='hidden' height={'100%'}>
//           <ContainerBoards container={container}/>
//         </Box>
//       </Loading>
//     </Box>
//   )
// }

// export default BoardProfileTable
