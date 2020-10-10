import { combineReducers } from 'redux';
import AlertReducer from './AlertReducer';
import AuthReducer from './AuthReducer';
import ProfileReducer from './ProfileReducer';
import PostReducer from './PostReducer';

export default combineReducers({
  alert: AlertReducer,
  auth: AuthReducer,
  profile: ProfileReducer,
  post: PostReducer,
});
