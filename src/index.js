import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter, Route } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import decode from 'jwt-decode';
import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import ru from 'react-intl/locale-data/ru';
import az from 'react-intl/locale-data/az';
// MDB and NPROGRESS
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mdbreact/docs/css/mdb.min.css';
import 'mdbreact/dist/mdbreact';
import '../node_modules/nprogress/nprogress.css';
// user components
import rootReducer from './reducer/rootReducer';
import App from './App';
//actions
import { setlocale } from './actions/locale';
import { LoginDispatch } from './actions/user';
import { getProfile } from './actions/profile';
// initial locale languages
addLocaleData(en)
addLocaleData(ru)
addLocaleData(az)
// create store
export const store = createStore (
	rootReducer,
	composeWithDevTools(applyMiddleware(thunk))
);

if (localStorage.Login) {
	const payload = decode(localStorage.Login);
	const user = {
		email: payload.email,
		token: localStorage.Login
	};
	store.dispatch(LoginDispatch(user))
	store.dispatch(getProfile(user.email))
}

if (localStorage.devsLang) {
	store.dispatch(setlocale(localStorage.devsLang))
}


ReactDOM.render(
	<BrowserRouter>
		<Provider store={store}>
			<Route component={App} />
		</Provider>
	</BrowserRouter>,
	document.getElementById('root'));
registerServiceWorker();
