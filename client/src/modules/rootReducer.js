/**
 * Created by Roman Morozov <sublimeye.ua@gmail.com> on 7/21/17.
 */
import { combineReducers } from 'redux';

import { gameReducer, gameDuckConstants } from './index';

export default combineReducers({
  [gameDuckConstants.name]: gameReducer,
});
