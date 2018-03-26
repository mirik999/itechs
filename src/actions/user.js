import api from '../api';
import { USER_LOGIN, USER_LOGOUT } from '../types';

export const LoginDispatch = (user) => ({
	type: USER_LOGIN,
	user
});

// NATIVE REGISTER
export const register = (data) => (dispatch) => {
	return api.user.register(data).then(user => {
		localStorage.Login = user.token;
		dispatch(LoginDispatch(user))
	})
}

// NATIVE LOGIN
export const enter = (data) => (dispatch) => {
	return api.user.enter(data).then(user => {
		localStorage.Login = user.token;
		dispatch(LoginDispatch(user))
	})
}

// FACEBOOK LOGIN
export const facebookLogin = (data) => (dispatch) => {
	return api.user.fblogin(data).then(user => {
		localStorage.Login = user.token;
		dispatch(LoginDispatch(user))
	})
};

// GOOGLE LOGIN
export const googleLogin = (data) => (dispatch) => {
	return api.user.gglogin(data).then(user => {
		localStorage.Login = user.token;
		dispatch(LoginDispatch(user))
	})
};

// GITHUB LOGIN
// export const githubLogin = (data) => (dispatch) => {
// 	return api.user.gtlogin(data).then(user => {
// 		dispatch(LoginDispatch(user))
// 	})
// };

// LOGOUT
export const logoutDispatch = () => ({
	type: USER_LOGOUT
});

export const logout = () => (dispatch) => {
	localStorage.removeItem('Login');
	dispatch(logoutDispatch())
};

