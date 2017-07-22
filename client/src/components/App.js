/**
 * Created by Roman Morozov <sublimeye.ua@gmail.com> on 7/18/17.
 */
// Vendors
import React, { Component } from 'react'
import localForage from 'localforage'
import { persistStore } from 'redux-persist'
import { Provider } from 'react-redux'

// Services
import configureStore from '../modules/store'
import '../styles/global'

// Components
import { Board } from './'

const store = configureStore({}, {middleware: []})

export default class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      rehydrated: false
    }
  }

  componentWillMount () {
    persistStore(store, {}, () => {
      this.setState({
        rehydrated: true,
        storage: localForage
      })
    })
  }

  render () {
    // TODO: Add router here (try something new instead of react router)
    return (
      <Provider store={store}>
        <Board />
      </Provider>
    )
  }
}
