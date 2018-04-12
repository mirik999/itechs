// import { ADD_NOTIFY } from '../types';
import api from '../api';

// add comment
export const addComment = (data) => (dispatch) => {
	return api.comment.addComment(data)
}

// delete comment'
export const delComment = (data) => (dispatch) => {
	return api.comment.delComment(data)
}

//edit comments
export const editComment = (data) => (dispatch) => {
	return api.comment.editComment(data)
}

// with notifications
// export const addComment = (data) => (dispatch) => {
// 	return api.comment.addComment(data).then((newNotify) => {
// 		dispatch(newNotifyDispatch(newNotify))
// 	})
// }
//
// export const newNotifyDispatch = (newNotify) => ({
// 	type: ADD_NOTIFY,
// 	newNotify
// })