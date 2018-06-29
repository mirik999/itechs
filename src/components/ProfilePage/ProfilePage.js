import React, {PureComponent} from 'react';
import { connect } from 'react-redux';
import NProgress from 'nprogress';
//user components
import PrivateProfile from './PrivateProfile';
import Wrapper from '../Utils/Wrapper';
//direct api requests
import api from '../../api';
//css
import './ProfilePage.css';


class ProfilePage extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			articles: [],
			profile: {},
			update: false
		}
	}

	async componentDidMount() {
		NProgress.start();
		const articles = await api.article.getAllArticles()
		const profile = await api.user.getProfile(this.props.user.email)
		await this.setState({
			articles,
			profile,
		}, () => NProgress.done())
	}

	render() {
		const { lang, socket } = this.props;
		const { articles, profile } = this.state;

		if (articles.length === 0 && Object.keys(profile).length === 0) return <div></div>

		return (
			<Wrapper>
				<PrivateProfile articles={articles} profile={profile} socket={socket} lang={lang} />
			</Wrapper>
		);

	}
}

function mapStateToProps(state) {
	return {
		user: state.user,
		lang: state.locale.lang
	}
}

export default connect(mapStateToProps)(ProfilePage);
