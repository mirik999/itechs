import React, { PureComponent } from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NProgress from 'nprogress';
//user components
import Wrapper from '../Utils/Wrapper';
import ArticleCard from './ArticleCard';
import ArticleSearchPanel from "./ArticleSearchPanel";
//direct api requests
import api from '../../api';
//selectors
import {profileSelector} from "../../reducer/profile";
import {onlineListSelector} from "../../reducer/user";


class ArticlesPage extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			articles: [],
			profile: {},
			searchTerm: ''
		}

		this.handleSearchFilter = this.handleSearchFilter.bind(this);
		this.onFilter = this.onFilter.bind(this);
	}

	async componentDidMount() {
		NProgress.start();
		const articles = await api.article.getAllArticles()
		// const profile = Object.keys(this.props.user).length !== 0 && await api.user.getProfile(this.props.user.email)
		this.setState({
			articles,
			profile: this.props.profile
		}, () => NProgress.done())
	}

	onFilter = (word) => (article) => {
		if (article.title.toLowerCase().includes(word.toLowerCase())) {
			return article.title.toLowerCase().includes(word.toLowerCase()) || !word;
		}
		// else if(article.content.toLowerCase().includes(word.toLowerCase())) {
		// 	return article.content.toLowerCase().includes(word.toLowerCase()) || !word;
		// }
		else if(article.author.username.toLowerCase().includes(word.toLowerCase())) {
			return article.author.username.toLowerCase().includes(word.toLowerCase()) || !word;
		}
		else if(article.tags.toLowerCase().includes(word.toLowerCase())) {
			return article.tags.toLowerCase().includes(word.toLowerCase()) || !word;
		}
	}

	handleSearchFilter = (word) => {
		this.setState({ searchTerm: word })
	}

	render() {
		const { lang, socketUsers } = this.props;
		const { articles, profile, searchTerm } = this.state;

		if (Object.keys(articles).length === 0 && Object.keys(profile).length === 0) return <div></div>;

		return (
			<Wrapper>
				<ArticleSearchPanel searchTerm={searchTerm} search={this.handleSearchFilter} />
					<div className="row justify-content-center">
						{
							articles.filter(this.onFilter(searchTerm)).map((article, idx) => {
								// filter single user from socketOnlineList and convert to object
								const userSocket = socketUsers.filter(socket => socket.username === article.author.username)
									.reduce((result, item, index) => {
										result[index] = item;
										return result[0];
									}, {})
								// filter my profile from socketOnlineList and convert to object
								const mySocket = socketUsers.filter(socket => socket.username === profile.username)
									.reduce((result, item, index) => {
										result[index] = item;
										return result[0];
									}, {})

								return (
									<ArticleCard
										key={idx}
										id={article._id}
										article={article}
										articles={articles}
										lang={lang}
										profile={mySocket}
										userSocket={userSocket}
									/>
								)
							})
						}
					</div>
			</Wrapper>
		)
	}
}

ArticlesPage.propTypes = {
	user: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
	//console.log('selector', articlesSelector(state) === articlesSelector(state))
	return {
		socketUsers: onlineListSelector(state),
		lang: state.locale.lang,
		profile: profileSelector(state),
		user: state.user
	}
}


export default connect(mapStateToProps)(ArticlesPage);
