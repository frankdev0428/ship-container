import React, { ReactNode, useRef } from 'react'
import ClearIcon from '@mui/icons-material/Clear'
import { Box, Breakpoint, Dialog, DialogContent, DialogTitle, IconButton, Step, StepLabel, Stepper, styled, Typography } from '@mui/material'

import AEDialogActions, { AEDialogActionsProps, AEDialogActionStepperProps } from './AEDialogActions'

const StyledStepLabel = styled(StepLabel)(({ theme }) => ({
  '.MuiStepLabel-label': {
    fontSize: '10px',
    letterSpacing: '1px',
    lineHeight: '1.8',
  },
  '.MuiStepLabel-label.MuiStepLabel-alternativeLabel': {
    marginTop: '5px',
  },
  '.MuiStepLabel-label.Mui-active': {
    fontWeight: 'normal',
    color: theme.palette.primary.highlight,
  },
  '.MuiStepLabel-label.Mui-completed': {
    fontWeight: 'normal',
    color: theme.palette.text.unselected,
  },
  '.css-1a3vqng-MuiSvgIcon-root-MuiStepIcon-root.Mui-active': {
    color: theme.palette.primary.highlight,
  },
  '.css-1a3vqng-MuiSvgIcon-root-MuiStepIcon-root.Mui-completed': {
    color: theme.palette.text.unselected,
  },
}))

const StyledStepper = styled(Stepper)({
  width: '90%',
})

export interface AEDialogActionProps extends AEDialogActionStepperProps {
  steps?: string[];
  activeStep?: number,
}

interface GenericDialogProps {
  children: ReactNode;
  dialogTitle: string;
  dialogMaxWidth?: false | Breakpoint;
  ActionProps: Omit<AEDialogActionsProps, 'canSubmit' | 'myForm'>
  StepperProps?: AEDialogActionProps;
}

const GenericDialog = ({
  dialogTitle,
  dialogMaxWidth,
  children,
  StepperProps,
  ActionProps,
}: GenericDialogProps): JSX.Element => {
  const myForm = useRef<HTMLFormElement>(null)

  const {
    steps = [],
    onNext,
    onBack,
    activeStep,
    skipStep,
  } = StepperProps || {}

  const canGoBack = Boolean(StepperProps) && activeStep !== 0
  const canGoNext = Boolean(StepperProps) && steps && activeStep !== steps?.length - 1
  const canSubmit = !StepperProps || (steps?.length > 0 && activeStep === steps?.length - 1)

  return (
    <Dialog open={true} maxWidth={dialogMaxWidth || 'md'} fullWidth onClose={ActionProps.onCancel}>
      <form ref={myForm}>
        <DialogTitle>
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Typography variant={'h6'}>{dialogTitle}</Typography>
            <Box justifyContent={'flex-end'}>
              <IconButton size='small' onClick={ActionProps.onCancel}>
                <ClearIcon/>
              </IconButton>
            </Box>
          </Box>
          </DialogTitle>
          <DialogContent>
            {
              StepperProps?.steps?.length &&
                <Box display='flex' justifyContent='center' alignItems='center' pb={3}>
                <StyledStepper activeStep={StepperProps.activeStep} alternativeLabel>
                  {
                    StepperProps?.steps.map((step) => (
                      <Step key={step}>
                        <StyledStepLabel> {step.toUpperCase()} </StyledStepLabel>
                      </Step>
                    ))
                  }
                </StyledStepper>
              </Box>
            }
            {children}
          </DialogContent>
          <AEDialogActions
            myForm={myForm}
            submitLabel={ActionProps.submitLabel}
            onSubmit={ActionProps.onSubmit}
            onCancel={ActionProps.onCancel}
            canSubmit={canSubmit}
            handleFormErrors={ActionProps.handleFormErrors}
            StepperProps={{
              onNext,
              onBack,
              canGoBack,
              canGoNext,
              skipStep,
            }}
          />
        </form>
    </Dialog>
  )
}

export default GenericDialog
