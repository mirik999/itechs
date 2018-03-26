import { USER_LOGIN, USER_LOGOUT } from '../types';

export default function user(state = {}, action = {}) {
	switch (action.type) {
		case USER_LOGIN:
			return Object.assign({}, action.user);
		case USER_LOGOUT:
			return {};
		default:
			return state;
	}
}