import React, { Component } from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NProgress from 'nprogress';
//user components
import Wrapper from '../Utils/Wrapper';
import ArticleCard from './ArticleCard';
import ArticleSearchPanel from "./ArticleSearchPanel";
//actions
import { getAllArticles } from '../../actions/article';
import { getProfile } from '../../actions/profile';
//selectors
import { articlesSelector } from "../../reducer/article";
import { profileSelector } from "../../reducer/profile";


function searching(word) {
	return function(article) {
		if (article.title.toLowerCase().includes(word.toLowerCase())) {
			return article.title.toLowerCase().includes(word.toLowerCase()) || !word;
		}
		// else if(article.content.toLowerCase().includes(word.toLowerCase())) {
		// 	return article.content.toLowerCase().includes(word.toLowerCase()) || !word;
		// }
		else if(article.author.toLowerCase().includes(word.toLowerCase())) {
			return article.author.toLowerCase().includes(word.toLowerCase()) || !word;
		}
		else if(article.tags.toLowerCase().includes(word.toLowerCase())) {
			return article.tags.toLowerCase().includes(word.toLowerCase()) || !word;
		}
	}
}

class ArticlesPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			articles: [],
			profile: {},
			searchTerm: ''
		}

		this.handleSearchFilter = this.handleSearchFilter.bind(this);
		this.update = this.update.bind(this);
	}

	UNSAFE_componentWillMount() {
		NProgress.start();
	}

	componentDidMount() {
		this.props.getAllArticles()
			.then(() => this.props.getProfile(this.props.user.email)
				.then(() => this.setState({
					articles: this.props.articles,
					profile: this.props.profile
				}, () => NProgress.done()))
			)
	}

	handleSearchFilter = (word) => {
		this.setState({ searchTerm: word })
	}

	update = () => {
		NProgress.start();
		this.props.getAllArticles()
			.then(() => NProgress.done())
	}

	render() {
		const { user, lang } = this.props;
		const { articles, profile, searchTerm } = this.state;

		if (!articles && !profile) return <div></div>;

		return (
			<Wrapper>
				<ArticleSearchPanel searchTerm={searchTerm} search={this.handleSearchFilter} />
					<div className="row justify-content-center">
						{
							articles.filter(searching(searchTerm)).map((article, idx) => {
								return (
									<ArticleCard
										key={idx}
										id={article._id}
										article={article}
										articles={articles}
										user={user}
										update={this.update}
										lang={lang}
										profile={profile}
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
	articles: PropTypes.array.isRequired,
};

function mapStateToProps(state) {
	//console.log('selector', articlesSelector(state) === articlesSelector(state))
	return {
		lang: state.locale.lang,
		articles: articlesSelector(state),
		profile: profileSelector(state),
		user: state.user
	}
}


export default connect(mapStateToProps, { getAllArticles, getProfile })(ArticlesPage);
