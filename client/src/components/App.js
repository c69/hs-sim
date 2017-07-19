/**
 * Created by Roman Morozov <sublimeye.ua@gmail.com> on 7/18/17.
 */
import React, { Component } from 'react'
import { injectGlobal } from 'styled-components'

injectGlobal`
  body {
    margin: 0;
    padding: 0;
  }
`

import { Board } from './'

export default class App extends Component {
  render () {
    // TODO: Add router here (try something new instead of react router)
    return (
      <div>
        <Board/>
      </div>
    )
  }
}
