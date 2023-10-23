import React from 'react'

import UnderlineButton from './UnderlineButton'

export default {
  title: 'Assets/UnderlineButton',
  component: UnderlineButton,
  decorators: [],
  includeStories: ['UnderlineDisableButtonStory', 'UnderlineButtonStory', 'UnderlineInactiveButtonStory'],
}

// Check UnderlineButonProps to know what props it expects to receive
export const UnderlineDisabledButtonExProps = {
  disabled: true,
  active: true,

  /* children: any;
  *
  * https://riptutorial.com/reactjs/example/25930/children-in-jsx
  * Children don't need to be passed in as props, they can be placed inside the component like:
  * < MyComponent > { some children (can be divs, other components, etc ) </ MyComponent > }
  */

  // For now, we can display an simple alert message on the browser
  onClick: () => alert('Clicked'),
}

export const UnderlineDisableButtonStory = () => {
  return (
    <UnderlineButton {...UnderlineDisabledButtonExProps} >This is a Disabled Button</UnderlineButton>
  )
}

export const UnderlineButtonExProps = {
  disabled: false,
  active: true,
  onClick: () => alert('Clicked'),
}

export const UnderlineButtonStory = () => {
  return (
    <UnderlineButton {...UnderlineButtonExProps} >This is an Underlined Button</UnderlineButton>
  )
}

export const UnderlineInactiveButtonExProps = {
  disabled: false,
  active: false,
  onClick: () => alert('Clicked'),
}

export const UnderlineInactiveButtonStory = () => {
  return (
    <UnderlineButton {...UnderlineInactiveButtonExProps} >This is an inactive Button</UnderlineButton>
  )
}
