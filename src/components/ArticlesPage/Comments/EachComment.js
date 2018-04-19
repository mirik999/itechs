import React, {PureComponent, Fragment} from 'react';
import { Link } from 'react-router-dom';
import renderHTML from 'react-render-html';
import { FormattedMessage } from 'react-intl';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import validator from 'validator';
import { stateFromHTML } from 'draft-js-import-html';
import { ToastContainer, toast } from 'react-toastify';
import _ from 'lodash';
import io from 'socket.io-client';
import { Fa } from 'mdbreact';
import Tooltip from 'material-ui/Tooltip';
//user components
import HandleDate from '../../Utils/HandleDate';
//socket setting
if (process.env.NODE_ENV === 'production') {
	var socket = io('https://itechs.info');
} else {
	var socket = io('http://localhost:4000');
}


class EachComment extends PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			comments: [],
			profile: {},
			editorState: EditorState.createEmpty(),
			toggle: false,
			target: "",
			errors: {}
		};

		this.txt = {
			noneComment: <FormattedMessage id="comment.empty" />,
			edit: <FormattedMessage id="edit" />,
			cancel: <FormattedMessage id="reject" />,
			delete: <FormattedMessage id="delete" />,
			save: <FormattedMessage id="save" />,
			like: <FormattedMessage id="button.like" />,
			editorArea: <FormattedMessage id="editor.area" />,
		}

		this.onDelete = this.onDelete.bind(this)
		this.onEdit = this.onEdit.bind(this)
		this.onSave = this.onSave.bind(this)
		this.validate = this.validate.bind(this)
		this.onEditorStateChange = this.onEditorStateChange.bind(this)
		this.fireSockets = this.fireSockets.bind(this)
	}

	async componentDidMount() {
		await this.setState({
			comments: this.props.comments,
			profile: this.props.profile
		})
		this.fireSockets();
	}

	onEditorStateChange = (editorState) => {
		this.setState({ editorState })
	}

	onDelete = (id) => {
		const data = {
			handleID: id,
			articleid: this.props.id
		}
		socket.emit('delComment', data)
	}

	onSave = async (id) => {
		const htmlContent = await draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));
		const data = {
			handleID: id,
			articleID: this.props.id,
			text: htmlContent,
		}
		const errors = await this.validate(data)
		this.setState({ errors })
		if (Object.keys(errors).length === 0) {
			await socket.emit('editComment', data)
			this.setState({toggle: !this.state.toggle})
		}
	}

	onEdit = async (comment) => {
		const target = await this.state.comments.filter(com => com.handleID === comment.handleID)[0]
		const editorState = await EditorState.createWithContent(stateFromHTML(comment.text))
		this.setState({
			target: target.handleID,
			toggle: !this.state.toggle,
			editorState: editorState
		})
	}

	validate = (data) => {
		const errors = {};
		if (!data.text || !validator.isLength(data.text, { min: 10 }) ) {
			toast.warn(this.txt.editorArea)
			errors.text = this.txt.editorArea;
		}

		return errors;
	}

	render() {
		const { comments, profile, editorState, toggle, target } = this.state;

		return (
			<div className="comments">
				{
					comments && comments.length === 0 ?
						<div className="all-comments text-center">
							<span style={{color: "silver"}}>
								{ this.txt.noneComment }
							</span>
						</div>
						:
					comments && comments.map((comment, idx) => {
						return (
							<div className="comment-wrap" key={idx}>
								<div className="photo">
									<Tooltip id="comment-author" title={comment.author.username}>
										<img src={comment.author.useravatar} alt="user-logo" style={styles.logoImg} />
									</Tooltip>
								</div>
								<div className="comment-block">
							  {
							  comment.handleID === target ? // if
								  (!toggle ? renderHTML(comment.text) : // if else
								 	 <div>
								 		 <Editor
								 			 wrapperClassName="toolbar-disable"
										   editorClassName={toggle && "bgColor"}
								 			 editorState={editorState}
								 			 handlePastedText={() => false}
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
								 	 </div>) :
								  renderHTML(comment.text)
							  }
								<div className="bottom-comment">
									<div className="comment-date pt-2"><HandleDate date={comment.date} /></div>
									<ul className="comment-actions pt-2">
										<li className="complain">
											<Link to={`/profile/@${comment.author.username}`}>{ comment.author.username }</Link>
										</li>
										<li className="reply">
											{
												comment.author.username === profile.username ?
													<span onClick={() => this.onEdit(comment)}>
														{ comment.handleID === target && toggle  ?
															<Fragment><Fa icon="close" /> {this.txt.cancel}</Fragment> :
															<Fragment><Fa icon="edit" /> {this.txt.edit}</Fragment> }
													</span> : <span><Fa icon="thumbs-o-up" /> {this.txt.like}</span>
											}
										</li>
										{
											comment.handleID === target &&
											comment.author.username === profile.username &&
											toggle && <li className="reply complain">
												<span onClick={() => this.onSave(comment.handleID)} className="mr-1">
													<Fa icon="check-square-o" /> {this.txt.save}
												</span>
											</li>
										}
										{
											comment.author.username === profile.username &&
											<li className="reply">
												<span onClick={() => this.onDelete(comment.handleID)}>
													<Fa icon="trash-o" /> { this.txt.delete }
												</span>
											</li>
										}
									</ul>
								</div>
								</div>
							</div>
						)
					})
				}
				<ToastContainer />
			</div>
		);
	}
	// handle sockets
	fireSockets = () => {
		socket.on('onComment', async (res) => {
			try {
				const currentComments = await _.clone(this.state.comments).concat(res);
				this.setState({ ...this.state, comments: currentComments })
			}
			catch(err) {
				console.log('error', err.message)
			}
		})

		socket.on('editComment', (res) => {
			this.setState({ ...this.state, comments: res })
		})

		socket.on('delComment', res => {
			this.setState({ ...this.state, comments: res })
		})
	}

}

const styles = {
	logoImg: {
		width: "50px",
		height: "50px",
		borderRadius: "50%",
		marginRight: "10px"
	}
}

export default EachComment;