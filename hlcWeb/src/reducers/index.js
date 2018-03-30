import { combineReducers } from 'redux';
import user from './user';
import come from './come';

const rootReducer = combineReducers({
  user,
  come
});

export default rootReducer;
