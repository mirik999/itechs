import React, {PureComponent} from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { FormattedMessage } from 'react-intl';
import NProgress from 'nprogress';
import validator from 'validator';
import { ToastContainer, toast } from 'react-toastify';
import { Fa } from 'mdbreact';
//user compoenents
import Wrapper from '../Utils/Wrapper'
//direct api requests
import api from '../../api';
//selectors
import {profileSelector} from "../../reducer/profile";
//css
import './Editor/react-draft-wysiwyg.css';
import './style.css';



class ArticleEdit extends PureComponent {
	constructor(props){
		super(props);
		this.state = {
			article: {},
			profile: {},
			editorState: '',
			articleImages: [],
			errors: {}
		}

		this.txt = {
			placeholder: <FormattedMessage id="profile.article"/>,
			contentErr: <FormattedMessage id="error.share-content" />,
			edit: <FormattedMessage id="edit" />,
		}

		this.onEditorStateChange = this.onEditorStateChange.bind(this)
		this.uploadImageCallBack = this.uploadImageCallBack.bind(this)
		this.onReSave = this.onReSave.bind(this)
	}

	async componentDidMount() {
		NProgress.start()
		const { id } = this.props.match.params;
		//const { email } = this.props.user;
		const article = await api.article.getArticle(id)
		// const profile = await api.user.getProfile(email)
		const editorState = await EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(article.content).contentBlocks))
		this.setState({
			article,
			profile: this.props.profile,
			editorState,
			articleImages: article.articleImages
		}, () => NProgress.done())
	}

	uploadImageCallBack = (file) => {
		return new Promise(
			(resolve, reject) => {
				const xhr = new XMLHttpRequest();
				xhr.open('POST', 'https://api.imgur.com/3/image');
				xhr.setRequestHeader('Authorization', 'Client-ID 4ce544cd34aeea7');
				const data = new FormData();
				data.append('image', file);
				xhr.send(data);
				xhr.addEventListener('load', () => {
					const response = JSON.parse(xhr.responseText);
					this.setState({ articleImages: this.state.articleImages.concat(response.data.link) })
					resolve(response);
				});
				xhr.addEventListener('error', () => {
					const error = JSON.parse(xhr.responseText);
					reject(error);
				});
			}
		);
	}

	onEditorStateChange = (editorState) => {
		this.setState({ editorState })
	}

	onReSave = async () => {
		NProgress.start();
			const content = {
				id: this.state.article._id,
				editorState: draftToHtml(convertToRaw(this.state.editorState.getCurrentContent())),
				articleImages: this.state.articleImages
			}
			const errors = await this.validate(content);
			this.setState({ errors })
			if (Object.keys(errors).length === 0) {
				await api.article.editArticle(content)
				return window.location.href = `/profile/@${this.state.article.author.username}`;
			} else {
				NProgress.done();
			}

	}

	validate = (content) => {
		const errors = {};
		if (!content.editorState.toString() || !validator.isLength(content.editorState.toString(), { min: 50 }) ) {
			toast.warn(this.txt.contentErr)
			errors.editorState = this.txt.contentErr
		}
		return errors;
	}

	render() {
		const { article, profile, editorState } = this.state;

		if (Object.keys(editorState).length === 0) return <div></div>
		if (article.author.username !== profile.username) return <Redirect to="/404" />

		return (
			<Wrapper>
				<div className="row justify-content-center">
					<div className="col-12 col-md-10 col-xl-8 mt-3 p-3" style={styles.bgEditor}>
						<div className="my-1 d-flex justify-content-end">
							<span className="text-secondary p-2 edit-button" onClick={this.onReSave}><Fa icon="edit" /> {this.txt.edit}</span>
						</div>
						<Editor
							editorState={editorState}
							handlePastedText={() => false}
							toolbar={{
								options: ['inline', 'image', 'colorPicker','blockType', 'list', 'textAlign', 'link' ],
								inline: { inDropdown: false, options:  ['bold', 'italic', 'monospace'] },
								blockType: { inDropdown: true },
								list: { inDropdown: true },
								textAlign: { inDropdown: true },
								link: { inDropdown: true },
								image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: false }, previewImage: true},
							}}
							onEditorStateChange={this.onEditorStateChange}
							placeholder={this.txt.placeholder}
						/>
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
		height: "calc(100vh - 4em)"
	},
	bg: {
		backgroundColor: "#fff"
	}
}

ArticleEdit.propTypes = {};

function mapStateToProps(state) {
	return {
		user: state.user,
		profile: profileSelector(state),
		lang: state.locale.lang
	}
}

export default connect(mapStateToProps)(ArticleEdit);
