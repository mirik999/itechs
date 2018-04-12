import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import validator from 'validator';
import NProgress from 'nprogress';
import { ToastContainer, toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';
//user components
import Wrapper from '../Utils/Wrapper';
import MyEditor from './Editor/Editor';
import Settings from './Editor/Settings';
//actions
import { addNewArticle } from '../../actions/article';
import { getProfile } from '../../actions/profile';
//selector
import {profileSelector} from "../../reducer/profile";


class ArticleCreate extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			thumbnail: [],
			content: '',
			settings: '',
			me: '',
			errors: {}
		}
		
		this.txt = {
			titleErr: <FormattedMessage id="error.share-title" />,
			contentErr: <FormattedMessage id="error.share-content" />
		}

		this.getContent = this.getContent.bind(this)
		this.getSettingsAndPush = this.getSettingsAndPush.bind(this)
	}


	componentDidMount() {
		this.props.getProfile(this.props.user.email)
			.then(() => this.setState({ me: this.props.profile._id }))
	}

	getContent = (content) => {
		this.setState({ thumbnail: content.thumbnail, content: content.editorState })
	}

	getSettingsAndPush = (settings) => {
		NProgress.start();
		this.setState({ settings }, () => {
			const errors = this.validate(this.state);
			this.setState({ errors })
			if (Object.keys(errors).length === 0) {
				this.props.addNewArticle(this.state)
					.then(() => {
						return window.location.href = '/'
					})
			} else {
				NProgress.done();
			}
		})
	}

	validate = (data) => {
		console.log(data)
		const errors = {};
		if (!data.settings.title || !validator.isLength(data.settings.title, { min: 10, max: 50 }) ) {
			toast.warn(this.txt.titleErr)
			errors.title = this.txt.titleErr
		}
		if (!data.content || !validator.isLength(data.content, { min: 50 }) ) {
			toast.warn(this.txt.contentErr)
			errors.content = this.txt.contentErr
		}
		return errors;
	}

	render() {
		const { profile } =this.props;
		
		if (Object.keys(profile).length === 0) return <div></div>
		
		return (
			<Wrapper>
				<div className="row justify-content-center">
					<div className="col-12 col-md-10 col-xl-8 mt-3 p-3" style={styles.bg}>
						<Settings getSettings={this.getSettingsAndPush} />
					</div>
					<div className="col-12 col-md-10 col-xl-8 mt-3 px-3" style={styles.bgEditor}>
						<MyEditor getContent={this.getContent} />
					</div>
				</div>
				<ToastContainer />
			</Wrapper>
		);
	}
}

const styles = {
	bgEditor: {
		backgroundColor: "#fff",
		height: "calc(100vh - 11em)"
	},
	bg: {
		backgroundColor: "#fff"
	}
}

ArticleCreate.propTypes = {};

function mapStateToProps(state) {
	return {
		user: state.user,
		profile: profileSelector(state)
	}
}

export default connect(mapStateToProps, { addNewArticle, getProfile })(ArticleCreate);
