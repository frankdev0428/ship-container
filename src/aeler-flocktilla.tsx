import React from 'react'
import ReactDOM from 'react-dom'
import singleSpaReact from 'single-spa-react'

import Root from './root.component'
import './index.css'

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: Root,
  errorBoundary(err, info, props) {
    // Customize the root error boundary for your microfrontend here.
    console.log('err', err)
    console.log('info', info)
    console.log('props', props)
    return (
      <div>
        <h3>Something went wrong...</h3>
      </div>
    )
  },
})

export const { bootstrap, mount, unmount } = lifecycles
