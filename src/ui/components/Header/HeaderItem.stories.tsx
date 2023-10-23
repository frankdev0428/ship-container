import React from 'react'

import HeaderItem from './HeaderItem'

export default {
  title: 'Navigation/Headeritem',
  component: HeaderItem,
  decorators: [],
  includeStories: ['HeaderItem', 'HeaderItemWithProps'],
}

export const HeaderItemExampleProps = {
  date: new Date('Jan 1 2020'),
  test: 'Some Text',
  selected: false,
}

export const HeaderItemDefault = () => (
  <div>Fix me </div>
  // <HeaderItem/>
)
