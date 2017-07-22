/**
 * Created by Roman Morozov <sublimeye.ua@gmail.com> on 7/21/17.
 */
import { combineReducers } from 'redux'

import { gameReducer, gameConstants } from './index'

export default combineReducers({
  [gameConstants.name]: gameReducer
})
