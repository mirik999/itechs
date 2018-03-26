import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';
import messages from './messages';
// user routes
import UserIsAuth from './components/UserRoute/UserIsAuth';
import UserNotAuth from './components/UserRoute/UserNotAuth';
//components
import LeftNavBar from './components/LeftNavBar/LeftNavBar';
import ArticlesPage from './components/ArticlesPage/ArticlesPage';
import AuthPage from './components/AuthPage/AuthPage';
import ProfilePage from './components/ProfilePage/ProfilePage';


class App extends Component {
	render() {
		const { location, lang } = this.props;
		return (
			<IntlProvider locale={lang} messages={messages[lang]}>
				<div className="container-fluid grey-skin" style={{ backgroundColor: "#DEE1E5", minHeight: "100%" }}>
					<LeftNavBar />
					<Switch>
						<Route exact location={location} path="/" component={ArticlesPage} />
						<UserIsAuth exact location={location} path="/authorization" component={AuthPage} />
						<UserNotAuth exact location={location} path="/profile" component={ProfilePage} />
					</Switch>
				</div>
			</IntlProvider>
		);
	}
}

function mapStateToProps(state) {
	return {
		lang: state.locale.lang,
	}
}


export default connect(mapStateToProps)(App);
