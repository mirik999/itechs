import { createSelector } from 'reselect';
import { USER_LOGIN, USER_LOGOUT, SET_STATUS } from '../types';

export function user(state = {}, action = {}) {
	switch (action.type) {
		case USER_LOGIN:
			return Object.assign({}, action.user);
		case USER_LOGOUT:
			return {};
		default:
			return state;
	}
}

export function onlineList(state = {}, action = {}) {
	switch (action.type) {
		case SET_STATUS:
			return Object.assign({}, action.users);
		default:
			return state;
	}
}

// cache data if it is not update
const usersInOnline = state => state.onlineList

export const onlineListSelector = createSelector(
	usersInOnline,
	onlineUsers => Object.values(onlineUsers)
)