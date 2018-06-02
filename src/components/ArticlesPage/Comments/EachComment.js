import React, {PureComponent, Fragment} from 'react';
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
import Tooltip from '@material-ui/core/Tooltip';
//user components
import HandleDate from '../../Utils/HandleDate';
import UserName from '../../Utils/UserName';
//socket setting
let socket;
if (process.env.NODE_ENV === 'production') {
	socket = io('https://itechs.info');
} else {
	socket = io('http://localhost:4000');
}


class EachComment extends PureComponent {
	constructor(props) {
		super(props)

		this.fireSockets();

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
		const { socketUsers } = this.props;

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

						// filter single user from socketOnlineList and convert to object
						const userSocket = socketUsers.filter(socket => socket.username === comment.author.username)
							.reduce((result, item, index) => {
								result[index] = item;
								return result[0];
							}, {})
						// filter my profile from socketOnlineList and convert to object
						const mySocket = socketUsers.filter(socket => socket.username === profile.username)
							.reduce((result, item, index) => {
								result[index] = item;
								return result[0];
							}, {})

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
										<UserName me={mySocket} userprofile={comment.author} userSocket={userSocket} profile={profile}
										          className="text-secondary cursor-pointer" />
										{
											comment.author.username === profile.username ?
												<span onClick={() => this.onEdit(comment)}
												      className="cursor-pointer hoverme p-2 ml-2 text-secondary">
													{ comment.handleID === target && toggle  ?
														<Fragment><small><Fa icon="close" /> {this.txt.cancel}</small></Fragment> :
														<Fragment><small><Fa icon="edit" /> {this.txt.edit}</small></Fragment> }
												</span> :
												<span className="cursor-pointer hoverme p-2 mx-1 text-secondary">
													<small><Fa icon="thumbs-o-up" /> {this.txt.like}</small>
												</span>
										}
										{
											comment.handleID === target &&
											comment.author.username === profile.username &&
											toggle &&
												<span onClick={() => this.onSave(comment.handleID)}
												      className="cursor-pointer hoverme p-2 mx-1 text-secondary">
													<small><Fa icon="check-square-o" /> {this.txt.save}</small>
												</span>
										}
										{
											comment.author.username === profile.username &&
											<span onClick={() => this.onDelete(comment.handleID)}
											      className="cursor-pointer hoverme p-2 mx-1 text-secondary">
												<small><Fa icon="trash-o" /> { this.txt.delete }</small>
											</span>
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