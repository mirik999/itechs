import { combineReducers } from 'redux';

import locale from './locale';
import user from './user';
import article from './article';
import profile from './profile';

export default combineReducers({
  locale,
  user,
  article,
  profile
});