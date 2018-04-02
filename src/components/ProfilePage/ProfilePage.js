import React, {Component} from 'react';
import { connect } from 'react-redux';
import NProgress from 'nprogress';
//user components
import ProvateProfile from './PrivateProfile';
import Wrapper from '../Utils/Wrapper';
//actions
import { getAllArticles } from "../../actions/article";
//selector
import { articlesSelector } from '../../reducer/article';


class ProfilePage extends Component {

	componentWillMount() {
		NProgress.start();
	}

	componentDidMount() {
		this.props.getAllArticles()
			.then(() => NProgress.done())
	}

	render() {
		const { articles, profile } = this.props;
		console.log(profile)

		if (Object.keys(profile).length === 0) return <div></div>

		return (
			<Wrapper>
				<ProvateProfile articles={articles} profile={profile} />
			</Wrapper>
		);
	}
}

function mapStateToProps(state) {
	return {
		articles: articlesSelector(state)
	}
}

export default connect(mapStateToProps, { getAllArticles })(ProfilePage);
