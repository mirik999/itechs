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
		const profile = Object.keys(this.props.user).length !== 0 && await api.user.getProfile(this.props.user.email)
		this.setState({
			articles,
			profile
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
		const { lang } = this.props;
		const { articles, profile, searchTerm } = this.state;

		if (Object.keys(articles).length === 0 && Object.keys(profile).length === 0) return <div></div>;
	
		return (
			<Wrapper>
				<ArticleSearchPanel searchTerm={searchTerm} search={this.handleSearchFilter} />
					<div className="row justify-content-center">
						{
							articles.filter(this.onFilter(searchTerm)).map((article, idx) => {
								return (
									<ArticleCard
										key={idx}
										id={article._id}
										article={article}
										articles={articles}
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
	user: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
	//console.log('selector', articlesSelector(state) === articlesSelector(state))
	return {
		lang: state.locale.lang,
		user: state.user
	}
}


export default connect(mapStateToProps)(ArticlesPage);
