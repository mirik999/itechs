import React, { PureComponent } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';
import messages from './messages';
import io from 'socket.io-client';
//user routes
import UserIsAuth from './components/UserRoute/UserIsAuth';
import UserNotAuth from './components/UserRoute/UserNotAuth';
//components
import LeftNavBar from './components/LeftNavBar/LeftNavBar';
import ArticlesPage from './components/ArticlesPage/ArticlesPage';
import ArticleContent from './components/ArticlesPage/ArticleContent';
import ArticleCreate from './components/ArticlesPage/ArticleCreate';
import ArticleEdit from './components/ArticlesPage/ArticleEdit';
import Enter from './components/AuthPage/Enter';
import Register from './components/AuthPage/Register';
import DocumentationPage from './components/DocumentationPage/DocumentationPage';
import ProfilePage from './components/ProfilePage/ProfilePage';
import ChatBox from './components/ChatBox/ChatBox';
import NotFound from './components/404-Constructor/NotFound';
//actions
import { getProfile } from './actions/profile'
//direct api requests
import api from './api';
//socket setting
let socket;
if (process.env.NODE_ENV === 'production') {
	socket = io('https://itechs.info');
} else {
	socket = io('http://localhost:4000');
}


class App extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			profile: {}
		}
	}
	
	async componentDidMount() {
		if (Object.keys(this.props.user).length !== 0) {
			const profile = await api.user.getProfile(this.props.user.email)
			this.setState({ profile });
			socket.emit('userOnline', {
				myID: profile._id
			});
		}

	}

	render() {
		const { profile } = this.state;
		const { location, lang } = this.props;

		return (
			<IntlProvider locale={lang} messages={messages[lang]}>
				<div className="container-fluid grey-skin" style={{ backgroundColor: "#DEE1E5", minHeight: "100%" }}>
					<LeftNavBar />
					{/*{ Object.keys(profile).length !== 0 && <ChatBox profile={profile} socket={socket} /> }*/}
					<Switch>
						<Route exact location={location} path="/" component={ArticlesPage} />
						<Route location={location} path="/article/read/:id" component={ArticleContent} />
						<UserNotAuth location={location} path="/article/create" component={ArticleCreate} />
						<UserNotAuth location={location} path="/article/edit/:id" component={ArticleEdit} />
						<UserIsAuth exact location={location} path="/user/enter" component={Enter} />
						<UserIsAuth exact location={location} path="/user/register" component={Register} />
						<UserNotAuth exact location={location} path="/profile/:name" socket={socket} component={ProfilePage} />
						<UserNotAuth exact location={location} path="/documentation" component={DocumentationPage} />
						<Route exact location={location} path="*" component={NotFound} />
					</Switch>
				</div>
			</IntlProvider>
		);
	}
}

function mapStateToProps(state) {
	return {
		lang: state.locale.lang,
		user: state.user
	}
}


export default connect(mapStateToProps, { getProfile })(App);
