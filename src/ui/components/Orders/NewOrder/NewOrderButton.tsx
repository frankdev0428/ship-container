import { Box, BoxProps, Button } from '@mui/material'
import React, { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'

import { ContractStatusEnum, EquipmentLeaseInput, OrderStatusEnum } from '../../../../services/lease/types'
import { createNewOrder } from '../../../../services/thunks'
import AEDialog from '../../shared/Form/AEDialog'
import { getTimeLabel } from '../../shared/utils'

import AllocateContainerForm from './AllocateContainerForm'
import NewOrderForm from './NewOrderForm'
import SummaryForm from './SummaryForm'

const newOrderDefaultValue = {
  orderId: `XXXX-${getTimeLabel(new Date(), 'yearFistDate')}-${ContractStatusEnum.Ael}`,
  customerId: '',
  timePlaced: new Date(),
  returnDate: new Date(),
  pickupLocation: '',
  dropoffLocation: '',
  executionDate: new Date(),
  contractStatus: ContractStatusEnum.Ael as any,
  units: 0,
  customersBookingNumber: undefined,
}

export interface FormErrorsProps {
  customerId: boolean,
  pickupLocation: boolean,
  dropoffLocation: boolean,
  units: boolean,
}

export interface AllocatableEquipmentsProps { equipmentId: string, id: string /* id should be containerId */ }

const NewOrderDialog = ({ onClose } : { onClose: () => void }) => {
  const [activeStep, setActiveStep] = useState(0)
  const [newOrder, setNewOrder] = useState<EquipmentLeaseInput>(newOrderDefaultValue)
  const [allocatableEquipments, setAllocatableEquipments] = useState<AllocatableEquipmentsProps[]>([])
  const [formErrors, setFormErrors] = useState<FormErrorsProps>({
    customerId: false,
    pickupLocation: false,
    dropoffLocation: false,
    units: false,
  })

  const _dispatch = useDispatch()

  const handleOrderDetailsChange = useCallback((newOrder: any) => {
    setNewOrder(newOrder)
  }, [])

  const handleChangeEquipments = useCallback((equipments: AllocatableEquipmentsProps[]) => {
    setAllocatableEquipments(equipments)
  }, [])

  const handleChangeFormErrors = useCallback((newFormErrors: FormErrorsProps) => {
    setFormErrors(newFormErrors)
  }, [JSON.stringify(formErrors)])

  const handleStepperNext = useCallback(() => {
    setActiveStep(activeStep + 1)
  }, [activeStep/* , JSON.stringify(newOrder) */])

  const handleFormErrors = useCallback(() => {
    setFormErrors({
      customerId: newOrder.customerId === '' || !newOrder.customerId,
      units: newOrder.units === 0 || !newOrder.units || newOrder.units === null,
      dropoffLocation: newOrder.dropoffLocation === '' || !newOrder.dropoffLocation,
      pickupLocation: newOrder.pickupLocation === '' || !newOrder.pickupLocation,
    })
  }, [JSON.stringify(newOrder)])

  const handleStepperBack = useCallback(() => {
    setActiveStep(activeStep - 1)
  }, [activeStep])

  const handleSubmit = useCallback(() => {
    const equipmentIds = allocatableEquipments.map((e) => e.equipmentId)
    _dispatch(createNewOrder({ ...newOrder, timePlaced: new Date() }, equipmentIds, onClose))
  }, [allocatableEquipments.length, JSON.stringify(newOrder)])

  return (
    <AEDialog
      dialogMaxWidth={activeStep === 1 ? 'lg' : 'sm'}
      dialogTitle={`New order ${newOrder.orderId || ''}`}
      ActionProps={{
        submitLabel: 'Create order',
        onCancel: onClose,
        onSubmit: handleSubmit,
        handleFormErrors: handleFormErrors,
      }}
      StepperProps={{
        activeStep: activeStep,
        steps: ['ORDER DETAILS', 'ALLOCATED CONTAINERS', 'SUMMARY'],
        skipStep: activeStep === 1 && allocatableEquipments.length === 0,
        onNext: handleStepperNext,
        onBack: handleStepperBack,
      }}
    >
      { activeStep === 0 &&
        <NewOrderForm
          newOrder={newOrder}
          formErrors={formErrors}
          onChange={handleOrderDetailsChange}
          handleChangeFormErrors={handleChangeFormErrors}
        />
      }
      {
        activeStep === 1 &&
        <AllocateContainerForm
          order={newOrder}
          handleChangeEquipments={handleChangeEquipments}
          allocatableEquipments={allocatableEquipments}
        />
      }
      {
        activeStep === 2 &&
        <SummaryForm
          order={newOrder}
          allocatableContainersIds={allocatableEquipments.map((e) => e.id)}
          />
        }
    </AEDialog>

  )
}

interface NewOrderButtonProps extends BoxProps {
  onCreate?: (container: EquipmentLeaseInput, status?: OrderStatusEnum) => Promise<any>
}

const NewOrderButton = ({ ...boxProps }:NewOrderButtonProps): JSX.Element => {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <Box {...boxProps}>
      <Button color='primary' size='small' disabled={false} onClick={() => setDialogOpen(true)} variant='contained'>
        NEW ORDER
      </Button>
      { dialogOpen && <NewOrderDialog onClose={() => setDialogOpen(false)}/> }
    </Box>
  )
}

export default NewOrderButton
