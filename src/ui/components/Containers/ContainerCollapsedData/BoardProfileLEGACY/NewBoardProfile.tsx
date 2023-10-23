/**
 * 
 * 
 * 
 * 
 * 
 * ***************************************** IMPORTANT NOTICE *****************************************
 * 
 *    Boards V1 is deprecated!!
 *    Changes to this file should only be done to fix build errors
 * 
 * 
 * 
 * 
 * 
 * 

 * 
 * 
 * 
 */
import React, { ChangeEvent, FormEvent, useState } from 'react'
/*
FIXME: LEGACY CODE FROM BOARDS V1 -- remove it later
*/
// import {
//   Box,
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   IconButton,
//   MenuItem,
//   TextField,
//   BoxProps,
//   StandardTextFieldProps,
// } from '@mui/material'
// import ClearIcon from '@mui/icons-material/Clear'
// import { useDispatch } from 'react-redux'

// import { LabeledDatePicker } from '../../../shared/LabeledDatePicker'
// import Typography from '../../../Utils/Typography'
// import { ContainerSensorsProfileInput, ContainerSensorsProfile, BoardSourceEnum } from '../../../../../services/equipment/types'
// import BoardsPicker from '../../BoardsPicker'
// import { postBoardProfile } from '../../../../../services/thunks'

// const commonProps = {
//   variant: 'outlined' as any,
//   margin: 'dense' as any,
//   size: 'small' as any,
//   style: { minWidth: 160 },
//   fullWidth: true,
// }

// const boardSource = new Map([
//   ['aeler', 'AELER'],
//   ['kizy', 'Kizy'],
//   ['nexxiot', 'Nexxiot'],
// ])

// interface SelectableTextFieldProps extends StandardTextFieldProps {
//   label: string;
//   options: any[];
//   value: any;

//   onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
// }

// const SelectableTextField = ({ label, options, value, onChange, ...restProps }: SelectableTextFieldProps) => (
//   <TextField
//     id="outlined-select-container-size"
//     select
//     label={label}
//     value={value}
//     onChange={onChange}
//     {...commonProps}
//     {...restProps}
//   >
//     {options.map((option) => (
//       <MenuItem key={option} value={option}>
//         {option}
//       </MenuItem>
//     ))}
//   </TextField>
// )

// export interface BoardProfileDialogProps {
//   handleClose: () => void;
//   handleCreate: (sensorsProfile: ContainerSensorsProfileInput) => void;
//   profile?: ContainerSensorsProfile;
// }

// export const BoardProfileDialog = ({ profile, handleClose, handleCreate }: BoardProfileDialogProps) => {
//   const [boardProfile, setBoardProfile] = useState<ContainerSensorsProfileInput>({
//     aelerBoardId: profile?.aelerBoardId || '',
//     kizyBoardId: profile?.kizyBoardId || '',
//     nexxiotBoardId: profile?.nexxiotBoardId || '',
//     source: profile?.source || 'aeler',
//     dateFittedAeler: profile?.dateFittedAeler,
//     dateFittedNexxiot: profile?.dateFittedNexxiot,
//     dateFittedKizy: profile?.dateFittedKizy,
//   })

//   const handleSubmit = (event?: FormEvent<HTMLFormElement>) => {
//     event?.stopPropagation()
//     event?.preventDefault()
//     handleCreate({
//       source: boardProfile.source,
//       ...(boardProfile.aelerBoardId && boardProfile.aelerBoardId !== '' && { aelerBoardId: boardProfile.aelerBoardId }),
//       ...(boardProfile.kizyBoardId && boardProfile.kizyBoardId !== '' && { kizyBoardId: boardProfile.kizyBoardId }),
//       ...(boardProfile.nexxiotBoardId && boardProfile.nexxiotBoardId !== '' && { nexxiotBoardId: boardProfile.nexxiotBoardId }),
//       ...(boardProfile.dateFittedAeler && { dateFittedAeler: boardProfile.dateFittedAeler }),
//       ...(boardProfile.dateFittedNexxiot && { dateFittedNexxiot: boardProfile.dateFittedNexxiot }),
//       ...(boardProfile.dateFittedKizy && { dateFittedKizy: boardProfile.dateFittedKizy }),
//     })
//   }

//   const handleChangeDateBoard = (date: Date | null, key: string) => {
//     setBoardProfile({
//       ...boardProfile,
//       [key]: date || undefined,
//     })
//   }

//   const handleBoardProfileChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string) => {
//     setBoardProfile({
//       ...boardProfile,
//       [key]: event.target.value,
//     })
//   }

//   return (
//     <Dialog open={true} maxWidth={'sm'} fullWidth onClose={(event, reason) => { if (reason !== 'backdropClick') handleClose() }} >
//       <DialogTitle>
//         <Box display='flex' justifyContent='space-between' alignItems='center'>
//           <Typography variant={'h6'}>
//             { `${profile ? 'Edit' : 'New'} Board Profile`}</Typography>
//           <Box justifyContent={'flex-end'}>
//             <IconButton size='small' onClick={handleClose}><ClearIcon/></IconButton>
//           </Box>
//         </Box>
//         </DialogTitle>
//       <form onSubmit={handleSubmit}>
//         <DialogContent>
//         <Box display='flex' flexDirection='column' >
//             <Box mt={2} mb={1} >
//               <Typography>Boards</Typography>
//             </Box>
//             <Box display='flex'>
//               {/* <TextField {...commonProps} label="AELER Board Id" type='text' value={boardProfile.aelerBoardId} onChange={e => handleBoardProfileChange(e, 'aelerBoardId')} /> */}
//               <Box width='50%' pr={0.5}>
//               <BoardsPicker
//                 value={boardProfile.aelerBoardId}
//                 label={'Aeler device ID'}
//                 required={false}
//                 type={BoardSourceEnum.Aeler}
//                 callback={id => {
//                   setBoardProfile({
//                     ...boardProfile,
//                     aelerBoardId: id,
//                   })
//                 }}/>
//               </Box>
//               <Box width='50%' pr={0.5}>
//               <LabeledDatePicker
//                 label="Date fitted"
//                 value={boardProfile.dateFittedAeler || null}
//                 onChange={date => handleChangeDateBoard(date, 'dateFittedAeler')}
//                 disabled={boardProfile.aelerBoardId === ''}
//               />
//             </Box>
//             </Box>
//             {/* <TextField {...commonProps} label="Kizy Board Id" type='text' value={boardProfile.kizyBoardId} onChange={e => handleBoardProfileChange(e, 'kizyBoardId')} /> */}
//             <Box display='flex'>
//               {/* <TextField {...commonProps} label="Nexxiot Board Id" type='text' value={boardProfile.nexxiotBoardId} onChange={e => handleBoardProfileChange(e, 'nexxiotBoardId')} /> */}
//               <Box width='50%' pr={0.5}>
//               <BoardsPicker
//                 value={boardProfile.nexxiotBoardId}
//                 label={'Nexxiot device ID'}
//                 required={false}
//                 type={BoardSourceEnum.Nexxiot}
//                 callback={id => {
//                   setBoardProfile({
//                     ...boardProfile,
//                     nexxiotBoardId: id,
//                   })
//                 }}/>
//               </Box>
//               <Box width='50%' pr={0.5}>
//               <LabeledDatePicker
//                 label="Date fitted"
//                 value={boardProfile.dateFittedNexxiot || null}
//                 onChange={date => handleChangeDateBoard(date, 'dateFittedNexxiot')}
//                 disabled={boardProfile.nexxiotBoardId === ''}
//               />
//             </Box>
//             </Box>
//             <Box display='flex'>
//               <Box width='50%' pr={0.5}>
//                 <BoardsPicker
//                   value={boardProfile.kizyBoardId}
//                   label={'Kizy device ID'}
//                   required={false}
//                   type={BoardSourceEnum.Kizy}
//                   callback={id => {
//                     setBoardProfile({
//                       ...boardProfile,
//                       kizyBoardId: id,
//                     })
//                   }}/>
//                 </Box>
//                 <Box width='50%' pr={0.5}>
//                 <LabeledDatePicker
//                   label="Date fitted"
//                   value={boardProfile.dateFittedKizy || null}
//                   onChange={date => handleChangeDateBoard(date, 'dateFittedKizy')}
//                   disabled={boardProfile.kizyBoardId === ''}
//                 />
//               </Box>
//               </Box>
//             <SelectableTextField
//               label={'Source'}
//               options={Array.from(boardSource.keys())}
//               value={boardProfile.source}
//               onChange={e => handleBoardProfileChange(e, 'source')}
//             />
//           </Box>
//         </DialogContent>
//         <DialogActions>
//           <Button color='primary' onClick={handleClose}>Close</Button>
//           <Button color='primary' size='small' variant='contained' type='submit' >
//             { profile ? 'Edit' : 'Create'}
//           </Button>
//         </DialogActions>
//       </form>
//     </Dialog>
//   )
// }

// interface NewBoardProfileProps extends BoxProps {
//   containerId: string;
//   profile?: ContainerSensorsProfile;
// }

// const NewBoardProfile = ({ containerId, profile, ...boxProps }: NewBoardProfileProps) => {
//   const [open, setOpen] = useState(false)
//   const _dispatch = useDispatch()

//   const handleCreate = (sensorsProfile: ContainerSensorsProfileInput) => {
//     setOpen(false)
//     _dispatch(postBoardProfile(containerId, sensorsProfile))
//   }

//   return (
//     <Box {...boxProps} >
//       <Button variant='contained' size='small' color='primary' disabled={false} onClick={() => setOpen(true)}>
//         { profile ? 'Edit profile' : 'New profile'}
//       </Button>
//       { open && <BoardProfileDialog profile={profile} handleClose={() => setOpen(false)} handleCreate={handleCreate}/>}
//     </Box>
//   )
// }

// export default NewBoardProfile
