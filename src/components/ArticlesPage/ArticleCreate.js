import React, {PureComponent} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import validator from 'validator';
import NProgress from 'nprogress';
import { ToastContainer, toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';
//user components
import Wrapper from '../Utils/Wrapper';
import MyEditor from './Editor/Editor';
import NewEditor from './Editor/NewEditor';
import Settings from './Editor/Settings';
//direct api requests
import api from '../../api';


class ArticleCreate extends PureComponent {
	constructor(props) {
		super(props);
		
		this.state = {
			profile: {},
			content: {},
			settings: {},
			articleImages: [],
			errors: {}
		}
		
		this.txt = {
			titleErr: <FormattedMessage id="error.share-title" />,
			contentErr: <FormattedMessage id="error.share-content" />
		}

		this.getContent = this.getContent.bind(this)
		this.getSettingsAndPush = this.getSettingsAndPush.bind(this)
	}


	async componentDidMount() {
		const profile = await api.user.getProfile(this.props.user.email)
		this.setState({ profile })
	}

	getContent = (content) => {
		this.setState({ articleImages: content.articleImages, content: content.editorState })
	}

	getSettingsAndPush = async (settings) => {
		NProgress.start();
		await this.setState({ settings })
		const errors =  await this.validate(this.state);
		this.setState({ errors })
		if (Object.keys(errors).length === 0) {
			const data = {
				me: this.state.profile._id,
				content: this.state.content,
				settings: this.state.settings,
				articleImages: this.state.articleImages
			}
			await api.article.addArticle(data)
			return window.location.href = '/';
		}
		NProgress.done();
	}

	validate = (data) => {
		const errors = {};
		if (!data.settings.title || !validator.isLength(data.settings.title, { min: 10, max: 40 }) ) {
			toast.warn(this.txt.titleErr)
			errors.title = this.txt.titleErr
		}
		if (!data.content.toString() || !validator.isLength(data.content.toString(), { min: 50 }) ) {
			toast.warn(this.txt.contentErr)
			errors.content = this.txt.contentErr
		}
		return errors;
	}

	render() {
		const { profile } = this.state;
		const { lang } = this.props;

		if (Object.keys(profile).length === 0) return <div></div>
		
		return (
			<Wrapper>
				<div className="row justify-content-center">
					<div className="col-12 col-md-10 col-xl-8 mt-3 p-3" style={styles.bg}>
						<Settings getSettings={this.getSettingsAndPush} lang={lang} />
					</div>
					<div className="col-12 col-md-10 col-xl-8 mt-3 px-3" style={styles.bgEditor}>
						<MyEditor getContent={this.getContent} lang={lang} />
						{/*<NewEditor /> development - best editor */}
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
		lang: state.locale.lang
	}
}

export default connect(mapStateToProps)(ArticleCreate);
