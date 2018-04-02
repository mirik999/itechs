import api from '../api';
import { GET_PROFILE } from '../types';

// EditProfile
export const editProfile = (data) => (dispatch) => {
	return api.user.editProfile(data)
}

//GET PROFILE
export const getProfile = (data) => (dispatch) => {
	return api.user.getProfile(data).then(profile => {
		dispatch(getProfileDispatch(profile))
	})
}

export const getProfileDispatch = (profile) => ({
	type: GET_PROFILE,
	profile
});

// CHANGE PROFILE COVER
export const changeCover = (data) => (dispatch) => {
	return api.user.changeCover(data).then(profile => {
		dispatch(getProfileDispatch(profile))
	})
}

// FOLLOW USER
export const follow = (data) => (dispatch) => {
	return api.user.follow(data)
}