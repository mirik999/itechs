import { combineReducers } from 'redux';

import locale from './locale';
import { user, onlineList } from './user';
import article from './article';
import { profile, profileByName } from './profile';

export default combineReducers({
  locale,
  user,
  article,
  profile,
  profileByName,
	onlineList
});