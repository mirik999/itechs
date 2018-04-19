import React, {PureComponent} from 'react';
import { connect } from 'react-redux';
import NProgress from 'nprogress';
//user components
import PrivateProfile from './PrivateProfile';
import PublicProfile from './PublicProfile';
import Wrapper from '../Utils/Wrapper';
//direct api requests
import api from '../../api';


class ProfilePage extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			articles: [],
			profile: {},
			profileByName: {},
			update: false
		}
	}

	async componentDidMount() {
		NProgress.start();
		const name = this.props.match.params.name.slice(1).trim();
		const articles = await api.article.getAllArticles()
		const profileByName = await api.user.getProfileByName(name)
		const profile = await api.user.getProfile(this.props.user.email)
		await this.setState({
			articles,
			profile,
			profileByName
		}, () => NProgress.done() )
	}

	async componentDidUpdate(prevProps, prevState) {
		if(prevProps == undefined) {
			return false
		}
		const name = this.props.match.params.name.slice(1).trim();
		if (this.state.profileByName.username != name) {
			const profileByName = await api.user.getProfileByName(name)
			await this.setState({ profileByName })
		}
	}

	render() {
		const { lang } = this.props;
		const { articles, profile, profileByName } = this.state;

		if (articles.length === 0 && Object.keys(profile).length === 0) return <div></div>

		if (profile.username === profileByName.username) {
			return (
				<Wrapper>
					<PrivateProfile articles={articles} profile={profile} lang={lang} />
				</Wrapper>
			);
		}

		return (
			<Wrapper>
				<PublicProfile articles={articles} profile={profileByName} lang={lang}/>
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
