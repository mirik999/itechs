import { createSelector } from 'reselect';
import { GET_PROFILE } from '../types';

export default function profile(state = {}, action = {}) {
	switch(action.type) {
		case GET_PROFILE:
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