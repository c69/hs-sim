/**
 * Created by Roman Morozov <roman.morozov@bcgdv.com> on 7/17/17.
 */
import React from 'react'
import ReactDOM from 'react-dom'

import { App } from './components'

const rootEl = document.getElementById('root')
const render = Component =>
  ReactDOM.render(
    <App>
      <Component />
    </App>,
    rootEl
  )

render(App)

if (module.hot) module.hot.accept('./components/App', () => render(App))
