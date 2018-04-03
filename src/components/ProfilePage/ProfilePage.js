import React, {Component} from 'react';
import { connect } from 'react-redux';
import NProgress from 'nprogress';
//user components
import ProvateProfile from './PrivateProfile';
import Wrapper from '../Utils/Wrapper';
//actions
import { getAllArticles } from "../../actions/article";
import { getProfile } from '../../actions/profile';
//selector
import { articlesSelector } from '../../reducer/article';
import { profileSelector } from '../../reducer/profile';


class ProfilePage extends Component {

	UNSAFE_componentWillMount() {
		NProgress.start();
	}

	componentDidMount() {
		this.props.getAllArticles()
			.then(this.props.getProfile(this.props.user.email))
			.then(() => NProgress.done())
	}

	render() {
		const { articles, profile, lang } = this.props;

		if (Object.keys(articles).length === 0 && Object.keys(profile).length === 0) return <div></div>

		return (
			<Wrapper>
				<ProvateProfile articles={articles} profile={profile} lang={lang} />
			</Wrapper>
		);
	}
}

function mapStateToProps(state) {
	return {
		articles: articlesSelector(state),
		profile: profileSelector(state),
		user: state.user,
		lang: state.locale.lang
	}
}

export default connect(mapStateToProps, { getAllArticles, getProfile })(ProfilePage);
