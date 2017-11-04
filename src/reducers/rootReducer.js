import { combineReducers } from 'redux';

import mainReducer from './mainReducer';

const rootReducer = combineReducers({
  mainStore: mainReducer
})

export default rootReducer;
