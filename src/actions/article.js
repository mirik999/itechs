import { ADD_NEW_ARTICLE, GET_ALL_ARTICLES, GET_ONE_ARTICLE } from '../types';
import api from '../api';

// add new article
export const NewArticledispatch = (article) => ({
	type: ADD_NEW_ARTICLE,
	article
})

export const addNewArticle = (data) => (dispatch) => {
	return api.article.addArticle(data).then(article => {
		dispatch(NewArticledispatch(article))
	})
}

//get all articles
export const getAllArticlesDispatch = (articles) => ({
	type: GET_ALL_ARTICLES,
	articles
})

export const getAllArticles = () => (dispatch) => {
	return api.article.getAllArticles().then(articles => {
		dispatch(getAllArticlesDispatch(articles))
	})
}

//get one article
export const getArticleDispatch = (oneArticle) => ({
	type: GET_ONE_ARTICLE,
	oneArticle
})

export const getArticle = (id) => (dispatch) => {
	return api.article.getArticle(id).then(article => {
		dispatch(getArticleDispatch(article))
	})
}


//like - dislike
export const like = (data) => (dispatch) => {
	return api.article.like(data)
}