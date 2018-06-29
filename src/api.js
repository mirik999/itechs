import axios from 'axios';

export default {
	user: {
		register: (data) => {
			return axios.post('/api/auth/register', { data }).then(res => res.data.user )
		},
		enter: (data) => {
			return axios.post('/api/auth/enter', { data }).then(res => res.data.user )
		},
		fblogin: (data) => {
			return axios.post('/api/auth/fblogin', { data }).then(res => res.data.user )
		},
		gglogin: (data) => {
			return axios.post('/api/auth/gglogin', { data }).then(res => res.data.user)
		},
		editProfile: (data) => {
			return axios.put(`/api/profile/editing/:email`, { data }).then(res => res.data.userprofile)
		},
		getProfile: (email) => {
			return axios.get(`/api/profile/get-profile/${email}`).then(res => res.data.userprofile)
		},
		getProfileByName: (email) => {
			return axios.get(`/api/profile/get-profile-by-name/${email}`).then(res => res.data.userprofile)
		},
		changeAvatar: (data) => {
			return axios.put('/api/profile/change-avatar/:email', { data }).then(res => res.data.userprofile)
		},
		follow: (data) => {
			return axios.post('/api/profile/follow-user', { data }).then(res => res.data.userprofile)
		}
	},
	article: {
		addArticle: (data) => {
			return axios.post('/api/article/new-article', { data }).then(res => res.data.article)
		},
		getAllArticles: () => {
			return axios.get('/api/article/get-all-articles').then(res => res.data.articles)
		},
		getArticle: (id) => {
			return axios.get(`/api/article/get-one-article/${id}`).then(res => res.data.oneArticle)
		},
		editArticle: (data) => {
			return axios.put(`/api/article/edit-article/${data.id}`, { data }).then(res => res.data.editedArticle)
		},
		deleteArticle: (id) => {
			return axios.delete(`/api/article/delete-article/${id}`).then(res => res.data.articles)
		},
		like: (data) => {
			return axios.post('/api/article/like', { data }).then(res => res.data.like)
		}
	},
	comment: {
		addComment: (data) => {
			return axios.post('/api/comment/add-comment', { data })
		},
		delComment: (data) => {
			return axios.delete('/api/comment/del-comment/:id', { data })
		},
		editComment: (data) => {
			return axios.put('/api/comment/edit-comment/:id', { data }).then(res => res.data.commentText)
		}
	},
	feedback: {
		feedbackSend: (data) => {
			return axios.post('/api/feedback/new-feedback', { data })
		}
	},
	chat: {
		history: () => {
			return axios.get('/api/chat/get-history').then(res => res.data.messages)
		}
	}
	// notify: {
	// getNotify: (data) => {
	// 	return axios.post('/notify/get-my-nots', { data }).then(res => res.data.notify)
	//   },
	// 	delNotify: (data) => {
	// 	return axios.post('/notify/del-my-not', { data }).then(res => res.data.notify)
	// 	}
	// }
}