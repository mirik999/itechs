import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';
import messages from './messages';
//components
import MainPage from './components/MainPage/MainPage';
import SideNavBar from './components/LeftNavBar/LeftNavBar';


class App extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		const { location, lang } = this.props;
		return (
			<IntlProvider locale={lang} messages={messages[lang]}>
				<div className="container-fluid">
					<Switch>
						<Route exact location={location} path="/" component={MainPage} />
					</Switch>
				</div>
			</IntlProvider>
		);
	}
}

function mapStateToProps(state) {
	return {
		lang: state.locale.lang
	}
}


export default connect(mapStateToProps)(App);
