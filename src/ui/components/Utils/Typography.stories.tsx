import React, { Fragment } from 'react'

import Typography, { TypoVariants } from './Typography'

export default {
  title: 'Utils/Typography',
  component: [Fragment, Typography],
  decorators: [],
}

export const ExtendedTypography = () => {
  const variants = [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'body1',
    'body1',
    'caption',
    'button',
    'overline',
    'label',
    'specialTag',
    'specialError',
    'specialHelper',
  ] as TypoVariants[]

  return (
    <div>
      { variants.map((v: TypoVariants, idx: number) => (
        <div key={idx}>
          <Typography variant={v}>This is a {v} typography element</Typography>
        </div>
      ))}
    </div>
  )
}
