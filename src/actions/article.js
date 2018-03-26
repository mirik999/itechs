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
export const getOneArticlesDispatch = (oneArticle) => ({
	type: GET_ONE_ARTICLE,
	oneArticle
})

export const getOneArticles = (id) => (dispatch) => {
	return api.article.getOneArticles(id).then(oneArticle => {
		dispatch(getOneArticlesDispatch(oneArticle))
	})
}


//like - dislike
export const like = (data) => (dispatch) => {
	return api.article.like(data)
}