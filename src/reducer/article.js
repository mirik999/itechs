import { createSelector } from 'reselect';
import _ from 'lodash';
import { ADD_NEW_ARTICLE, GET_ALL_ARTICLES, GET_ONE_ARTICLE } from '../types';

export default function article(state = {}, action = {}) {
	switch(action.type) {
		case ADD_NEW_ARTICLE:
			return action.article
		case GET_ALL_ARTICLES:
			return action.articles
		case GET_ONE_ARTICLE:
			return action.oneArticle
		default:
			return state;
	}
}

// all articles
const allArticles = state => state.article

export const articlesSelector = createSelector(
	allArticles,
	article => [...article]
);

// each article
const eachArticle = state => state.article

export const eachArticleSelector = createSelector(
	eachArticle,
	article => article
)

// comments commentsSelector
const commentsHash = state => state.article.comments

export const commentsSelector = createSelector(
	commentsHash,
	comments => comments
)