import React, {PureComponent} from 'react';
import { connect } from 'react-redux';
import NProgress from 'nprogress';
//user components
import PrivateProfile from './PrivateProfile';
import PublicProfile from './PublicProfile';
import Wrapper from '../Utils/Wrapper';
//actions
import { getAllArticles } from "../../actions/article";
import { getProfile, getProfileByName } from '../../actions/profile';
//selector
import { articlesSelector } from '../../reducer/article';
import { profileSelector } from '../../reducer/profile';


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

	componentDidMount() {
		NProgress.start();
		const name = this.props.match.params.name.slice(1).trim();
		this.props.getAllArticles()
			.then(() => this.props.getProfileByName(name)
				.then(() => this.props.getProfile(this.props.user.email)
					.then(() => this.setState({
						articles: this.props.articles,
						profile: this.props.profile,
						profileByName: this.props.profileByName
					}, () => NProgress.done() )
				)
			)
		)
	}

	componentDidUpdate(prevProps, prevState) {
		if(prevProps == undefined) {
			return false
		}
		const name = this.props.match.params.name.slice(1).trim();
		if (this.state.profileByName.username != name) {
			this.props.getProfileByName(name)
				.then(() => this.setState({ profileByName: this.props.profileByName }))
		}
	}

	render() {
		const { lang } = this.props;
		const { articles, profile, profileByName } = this.state;

		if (!articles && Object.keys(profile).length === 0) return <div></div>

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
		articles: articlesSelector(state),
		profile: profileSelector(state),
		profileByName: state.profileByName,
		user: state.user,
		lang: state.locale.lang
	}
}

export default connect(mapStateToProps, { getAllArticles, getProfile, getProfileByName })(ProfilePage);
