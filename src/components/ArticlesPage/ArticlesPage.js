import React, { Component } from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NProgress from 'nprogress';
//user components
import Wrapper from '../Utils/Wrapper';
import ArticleCard from './ArticleCard';
//actions
import { getAllArticles } from '../../actions/article';
//selectors
import { articlesSelector } from "../../reducer/article";
import ArticleSearchPanel from "./ArticleSearchPanel";

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
			searchTerm: ''
		}

		this.handleSearchFilter = this.handleSearchFilter.bind(this);
		this.update = this.update.bind(this);
	}

	componentWillMount() {
		NProgress.start();
	}

	componentDidMount() {
		this.props.getAllArticles()
			.then(() => {
				NProgress.done();
			})
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
		const { articles, user, lang } = this.props;
		const { searchTerm } = this.state;

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
			              content={article.content}
			              avatar={article.avatar}
			              image={article.image}
			              author={article.author}
			              tags={article.tags}
			              title={article.title}
			              added={article.added}
										user={user}
										update={this.update}
										lang={lang}
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
		user: state.user
	}
}


export default connect(mapStateToProps, { getAllArticles })(ArticlesPage);
