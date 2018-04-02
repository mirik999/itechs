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
import ArticleContent from './components/ArticlesPage/ArticleContent';
import AuthPage from './components/AuthPage/AuthPage';
import ProfilePage from './components/ProfilePage/ProfilePage';
//actions
import { getProfile } from './actions/profile';
//selector
import {profileSelector} from "./reducer/profile";


class App extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.getProfile(this.props.user.email)
	}

	render() {
		const { location, lang, profile } = this.props;

		if (Object.keys(profile).length === 0) return <div></div>

		return (
			<IntlProvider locale={lang} messages={messages[lang]}>
				<div className="container-fluid grey-skin" style={{ backgroundColor: "#DEE1E5", minHeight: "100%" }}>
					<LeftNavBar />
					<Switch>
						<Route exact location={location} path="/" render={() => <ArticlesPage profile={profile} />} />
						<Route location={location} path="/article/:id" render={() => <ArticleContent profile={profile} /> } />
						<UserIsAuth exact location={location} path="/authorization" component={AuthPage} />
						<UserNotAuth exact location={location} path="/profile" render={() => <ProfilePage profile={profile} />} />
					</Switch>
				</div>
			</IntlProvider>
		);
	}
}

function mapStateToProps(state) {
	return {
		user: state.user,
		lang: state.locale.lang,
		profile: profileSelector(state)
	}
}


export default connect(mapStateToProps, { getProfile })(App);
