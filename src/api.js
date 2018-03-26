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
			return axios.put('/api/profile/editing/:id', { data })
		},
		getProfile: (data) => {
			return axios.get(`/api/profile/get-profile/${data}`, { data }).then(res => res.data.profile)
		},
		changeCover: (data) => {
			return axios.put('/api/profile/change-cover/:id', { data }).then(res => res.data.profile)
		}
	},
	article: {
		addArticle: (data) => {
			return axios.post('/api/article/new-article', { data }).then(res => res.data.article)
		},
		getAllArticles: () => {
			return axios.get('/api/article/get-all-articles').then(res => res.data.articles)
		},
		getOneArticles: (id) => {
			return axios.get('/api/article/get-one-article/:id', { id }).then(res => res.data.oneArticle)
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
	// notify: {
	// getNotify: (data) => {
	// 	return axios.post('/notify/get-my-nots', { data }).then(res => res.data.notify)
	//   },
	// 	delNotify: (data) => {
	// 	return axios.post('/notify/del-my-not', { data }).then(res => res.data.notify)
	// 	}
	// }
}