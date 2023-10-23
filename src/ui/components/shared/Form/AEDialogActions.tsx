import React, { RefObject } from 'react'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import { Box, Button, DialogActions, styled } from '@mui/material'

const StyledDialogActions = styled(DialogActions)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  padding: '0px 24px 16px 24px',
})

const StyledRightButtons = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: 20,
  width: '100%',
})

const StyledCancelButton = styled(Button)(({ theme }) => ({ color: theme.palette.text.unselected }))

export interface AEDialogActionStepperProps {
  onNext?: () => void
  onBack?: () => void
  canGoBack?: boolean
  canGoNext?: boolean
  skipStep?: boolean
}

export interface AEDialogActionsProps {
  myForm: RefObject<HTMLFormElement>
  canSubmit: boolean
  submitLabel?: string
  StepperProps?: AEDialogActionStepperProps

  onSubmit: () => void
  onCancel: () => void
  handleFormErrors: () => void
}

const AEDialogActions = ({ StepperProps, myForm, canSubmit, submitLabel, onSubmit, onCancel, handleFormErrors }: AEDialogActionsProps): JSX.Element => {
  const validateFormAndAct = () => {
    if (myForm.current) {
      if (!myForm.current.checkValidity()) {
        myForm.current.reportValidity()
        handleFormErrors && handleFormErrors()
      } else {
        if (canSubmit) {
          onSubmit()
          return
        }

        StepperProps?.onNext && StepperProps?.onNext()
      }
    }
  }

  return (
    <StyledDialogActions>
      {
        StepperProps && StepperProps?.canGoBack && StepperProps?.onBack !== undefined &&
          <Button variant='outlined' startIcon={<KeyboardArrowLeftIcon/>} onClick={StepperProps.onBack}>
            {'Back'}
          </Button>
      }
      <StyledRightButtons>
        <StyledCancelButton onClick={onCancel}> Cancel </StyledCancelButton>
        <Button
          key={`${canSubmit}${StepperProps?.skipStep}`}
          color={StepperProps?.skipStep ? undefined : 'primary'}
          variant={StepperProps?.skipStep ? 'outlined' : 'contained'}
          {...StepperProps?.canGoNext && { endIcon: <KeyboardArrowRightIcon/> }}
          onClick={validateFormAndAct}
        >
          {canSubmit ? submitLabel : StepperProps?.skipStep ? 'Skip' : 'Next'}
      </Button>
      </StyledRightButtons>
    </StyledDialogActions>
  )
}

export default AEDialogActions
