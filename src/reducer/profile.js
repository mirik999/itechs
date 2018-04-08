import { createSelector } from 'reselect';
import { GET_PROFILE, GET_PROFILE_BY_NAME } from '../types';

export function profile(state = {}, action = {}) {
	switch(action.type) {
		case GET_PROFILE:
			return Object.assign({}, action.profile);
		default:
			return state;
	}
}

export function profileByName(state = {}, action = {}) {
	switch(action.type) {
		case GET_PROFILE_BY_NAME:
			return Object.assign({}, action.profile);
		default:
			return state;
	}
}

// cache data if it is not update
const profileHash = state => state.profile

export const profileSelector = createSelector(
	profileHash,
	profile => profile
)