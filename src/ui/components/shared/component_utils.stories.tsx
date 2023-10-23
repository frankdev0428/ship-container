import React from 'react'

import { CenteredContent, Loading } from './component_utils'

export default {
  title: 'Assets/ComponentUtils',
  component: [CenteredContent, Loading],
  decorators: [],
  includeStories: ['LatoTypographyStory', 'CenteredContentStory', 'LoadingStory'],
}

export const CenteredContentStory = () => {
  return (
    <CenteredContent><div>I am a centered content string</div></CenteredContent>
  )
}

export const LoadingExProps = {
  loading: true,
}

export const LoadingStory = () => {
  return (
    <Loading {...LoadingExProps}><div>I am a loading string.</div></Loading>
  )
}
