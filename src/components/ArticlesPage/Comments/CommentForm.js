import React, {PureComponent} from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import validator from 'validator';
import { Button, Fa } from 'mdbreact';
import io from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
//socket setting
let socket;
if (process.env.NODE_ENV === 'production') {
	socket = io('https://itechs.info');
} else {
	socket = io('http://localhost:4000');
}


class CommentForm extends PureComponent {
	constructor(props){
		super(props)

		const html = '';
		const contentBlock = htmlToDraft(html);

		if (contentBlock) {
			const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
			const editorState = EditorState.createWithContent(contentState);
			this.state = {
				editorState,
				errors: {}
			};
		}

		this.txt = {
			onComment: <FormattedMessage id="resolve" />,
			onClean: <FormattedMessage id="reject" />,
			noAuth: <FormattedMessage id="notauth.login" />,
			typeComment: <FormattedMessage id="comment.write" />,
			editorArea: <FormattedMessage id="editor.area" />,
		}

		this.onEditorStateChange = this.onEditorStateChange.bind(this)
		this.onComment = this.onComment.bind(this)
		this.validate = this.validate.bind(this)
	}

	onEditorStateChange = (editorState) => {
		this.setState({ editorState })
	}

	onComment = async (e) => {
		e.preventDefault();
		const { id, profile } = this.props;
		const html = '';
		const draftContent = await htmlToDraft(html)

		const htmlContent = await draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));

		const data = {
			author: {
				username: profile.username,
				useravatar: profile.useravatar
			},
			handleID: Math.floor(Math.random() * 99195279999),
			articleID: id,
			userID: profile._id,
			text: htmlContent
		}
		const errors = await this.validate(data);
		this.setState({ errors })
		if (Object.keys(errors).length === 0) {
			await socket.emit('onComment', data);
			if (draftContent) {
				const contentState = await ContentState.createFromBlockArray(draftContent.contentBlocks);
				const editorState = await EditorState.createWithContent(contentState);
				this.setState({ editorState })
			}
		}
	}

	validate = (data) => {
		const errors = {};
		if (!validator.isLength(data.text.toString(), { min: 10 })) {
			toast.warn(this.txt.editorArea)
			errors.text = this.txt.editorArea;
		}
		return errors;
	}

	render() {
		const { editorState } = this.state;
		const { profile } = this.props;

		if (Object.keys(profile).length === 0) return <div className="text-center">
			<span className="cursor-pointer hoverme p-2">
				<Link className="text-secondary" to="/user/enter">{ this.txt.noAuth }</Link>
			</span>
		</div>

		return (
			<div className="comments">
				<Editor
					wrapperClassName="toolbar-disable"
					editorClassName="to-hight"
					editorState={editorState}
					placeholder={this.txt.typeComment}
					toolbar={{
						options: ['inline', 'blockType', 'list', 'textAlign', 'colorPicker', 'link'],
						inline: { inDropdown: false, options:  ['bold', 'italic'] },
						blockType: { options: ['Normal', 'Blockquote', 'Code'], inDropdown: false },
						list: { inDropdown: true },
						textAlign: { inDropdown: true },
						link: { inDropdown: true },
					}}
					onEditorStateChange={this.onEditorStateChange}
				/>
				<section className="bottom-comment">
					<ul className="comment-actions">
						<span onClick={this.onComment}
						      className="cursor-pointer hoverme p-2 mx-1 text-secondary">
							<small><Fa icon="send-o"/> {this.txt.onComment}</small>
						</span>
					</ul>
				</section>
				<ToastContainer />
			</div>
		);
	}
}

export default CommentForm;
