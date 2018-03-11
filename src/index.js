import React from 'react';
import ReactDOM from 'react-dom';
// MDB
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mdbreact/docs/css/mdb.min.css';
import 'mdbreact/dist/mdbreact';
//dependency
import { BrowserRouter, Route } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import ru from 'react-intl/locale-data/ru';
import az from 'react-intl/locale-data/az';

import rootReducer from './reducer/rootReducer';
import App from './App';
import { setlocale } from './actions/locale';
import registerServiceWorker from './registerServiceWorker';

addLocaleData(en)
addLocaleData(ru)
addLocaleData(az)


export const store = createStore(
	rootReducer,
	applyMiddleware(thunk)
);

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
