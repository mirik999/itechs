import { SWITCH_LANG } from '../types';

// switch Language
export const setlocale = (lang) => (dispatch) => {
	localStorage.devsLang = lang;
	dispatch(setLocaleDispatch(lang))
}

export const setLocaleDispatch = (lang) => ({
	type: SWITCH_LANG,
	lang
})