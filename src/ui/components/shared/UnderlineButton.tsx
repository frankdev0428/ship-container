import * as React from 'react'
import { Button } from '@mui/material'
import { styled } from '@mui/material/styles'

export interface UnderlineButtonProps {
  disabled?: boolean;
  active?: boolean;
  children?: any;

  onClick?: () => void;
}

const StyledTextWrapper = styled('div')(({ theme }) => ({
  margin: `0 ${theme.spacing()}`,
  zIndex: 2,
}))

const StyledUnderline = styled('span')(({ theme }) => ({
  position: 'absolute',
  width: `calc(100% - ${theme.spacing(2)})`,
  bottom: '8px',
  height: '8px',
  backgroundColor: theme.palette.secondary.main,
  zIndex: 1,
}))

const StyledButton = styled(Button)(({ theme, disabled }) => ({
  paddingLeft: disabled ? theme.spacing(2) : undefined,
  paddingRight: disabled ? theme.spacing(2) : undefined,
}))

const UnderlineButton: React.FunctionComponent<UnderlineButtonProps> = (props: UnderlineButtonProps) => {
  const { disabled, active, onClick, children } = props
  return (
    <StyledButton onClick={onClick} disabled={disabled}>
      <StyledTextWrapper>{children}</StyledTextWrapper>
      {active && <StyledUnderline />}
    </StyledButton>
  )
}

UnderlineButton.defaultProps = {
  active: false,
  disabled: false,
  onClick: () => { },
}

export default UnderlineButton
