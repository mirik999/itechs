import { SWITCH_LANG } from '../types';

export default function locale(state = { lang: "en" }, action = {}) {
	switch(action.type) {
		case SWITCH_LANG:
			return { ...state, lang: action.lang }
		default:
			return state;
	}
}