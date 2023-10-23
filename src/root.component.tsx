import React from 'react'
import { Provider } from 'react-redux'

import { configureStore } from './store'
import App from './ui/App'

/* eslint-disable @typescript-eslint/no-var-requires */
// require('dotenv').config()
const store = configureStore()

const Root = (props: any) => (
  <Provider store={store}>
    <App />
  </Provider>
)

export default Root
