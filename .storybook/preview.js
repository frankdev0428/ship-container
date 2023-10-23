// .storybook/preview.js

import React from 'react'
import { Provider } from 'react-redux'

import { addDecorator } from '@storybook/react'
import { ThemeProvider } from '@mui/material/styles'

import theme from '../src/ui/styles/coriolis-theme'
import { configureStore } from '../src/store'

addDecorator((story) => {
  const store = configureStore()

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>{story()}</ThemeProvider>
    </Provider>
  )
})
