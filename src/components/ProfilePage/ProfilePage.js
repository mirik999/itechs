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

	componentWillMount() {
		NProgress.start();
	}

	componentDidMount() {
		this.props.getAllArticles()
			.then(this.props.getProfile(this.props.user.email))
			.then(() => NProgress.done())
	}

	render() {
		const { user, articles, profile } = this.props;

		if (Object.keys(this.props.profile).length === 0) return <div></div>

		return (
			<Wrapper>
				<ProvateProfile user={user} articles={articles} profile={profile} />
			</Wrapper>
		);
	}
}

function mapStateToProps(state) {
	return {
		user: state.user,
		articles: articlesSelector(state),
		profile: profileSelector(state)
	}
}

export default connect(mapStateToProps, { getAllArticles, getProfile })(ProfilePage);
