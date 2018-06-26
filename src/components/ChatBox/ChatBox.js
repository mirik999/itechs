import React, {PureComponent, Fragment} from 'react';
import { connect } from 'react-redux';
import { Fa, Input, Button, Popover, PopoverBody, PopoverHeader } from 'mdbreact';
//user components
import ChatModal from './ChatModal';
//selectors
import {onlineListSelector} from "../../reducer/user";
//css
import './chatbox.css';


class ChatBox extends PureComponent {
	constructor(props) {
		super(props);

		this.fireSockets();

		this.state = {
			chatHistory: [],
			lastMessageAuthor: [],
			open: false,
			showChatList: false,
			sobesednik: ''
		}

		this.fireSockets = this.fireSockets.bind(this);
		this.removeDuplicatesBy = this.removeDuplicatesBy.bind(this);
		this.onOpenChat = this.onOpenChat.bind(this);
		this.closeChatModal = this.closeChatModal.bind(this);
	}

	componentDidMount() {
		if (localStorage.getItem('lastAuthors')) {
			const lastMessageAuthor = JSON.parse(localStorage.getItem('lastAuthors'));
			this.setState({ lastMessageAuthor })
		}
	}

	removeDuplicatesBy = (filterBy, array) => {
		const mySet = new Set();
		return array.filter(x => {
			const key = filterBy(x);
			const isNew = !mySet.has(key);
			if (isNew) mySet.add(key);
			return isNew;
		});
	}

	closeChatModal = () => {
		this.setState({ open: !this.state.open })
	}

	onOpenChat = (author) => {
		this.setState({ open: !this.state.open, sobesednik: author })
		if (this.state.lastMessageAuthor.includes(author)) {
			const lastMessageAuthor = this.state.lastMessageAuthor.filter(uname => uname !== author)
			this.setState({ lastMessageAuthor }, () => localStorage.setItem('lastAuthors', JSON.stringify(lastMessageAuthor)))
		}
	}

	render() {
		const { chatHistory, lastMessageAuthor, open, sobesednik } = this.state;
		const { profile, onlineUsers, socket } = this.props;

		const myMessages = chatHistory.map(msgs => msgs.message).filter(msg => msg.reciever.username === profile.username);

		const filteredMessages = this.removeDuplicatesBy(x => x.author.username, myMessages);

		const wrapCount = Array.from(new Set(lastMessageAuthor));

		return (
			<Fragment>
				<div className="chatbox-circle">
					<span style={styles.chatCircle}>
						<Fa icon="comments-o" />
					</span>
					{
						wrapCount.length !== 0 &&
						<span style={styles.msgCount} className="text-center">
							{ wrapCount.length }
						</span>
					}
					<input type="checkbox" id="checkbox5" className="circle-check" />
					<div className="chatbox-users">
						{
							filteredMessages.map((msg, idx) => {

								const eachCount = lastMessageAuthor.filter(uname => uname === msg.author.username)

								if (lastMessageAuthor.includes(msg.author.username)) {
									return (
										<div className="text-center my-2 position-relative" key={idx} 
										     onClick={() => this.onOpenChat(msg.author.username)}
										>
											<img src={msg.author.useravatar} alt="User-logo" style={styles.userAvatar} />
											<span style={styles.msgCount} className="text-center">
												{ eachCount.length }
											</span>
										</div>
									)
								}
								return (
									<div className="text-center my-2" key={idx} onClick={() => this.onOpenChat(msg.author.username)}>
										<img src={msg.author.useravatar} alt="User-logo" style={styles.userAvatar} />
									</div>
								)
							})
						}
					</div>
				</div>
				<ChatModal open={open} chatHistory={chatHistory} closeChatModal={this.closeChatModal} profile={profile} 
				sobesednik={sobesednik} onlineUsers={onlineUsers} socket={socket}
				/>
			</Fragment>
		);
	}

	fireSockets = () => {
		const { socket, profile } = this.props;

		socket.emit('loadChatHistory', { myID: profile._id })

		socket.on('loadChatHistory', data => {
			console.log(data)
			this.setState({ chatHistory: data })
		})

		socket.on('privateMessageResponse', message => {
			const msg =  {id: Date.now(), message};
			this.setState({
				lastMessageAuthor: message.author.username !== this.props.profile.username ? 
													 this.state.lastMessageAuthor.concat(message.author.username) : [],
				chatHistory: this.state.chatHistory.concat(msg)
			}, () => localStorage.setItem('lastAuthors', JSON.stringify(this.state.lastMessageAuthor)))
		})
	}
}

const styles = {
	userAvatar: {
		width: "50px",
		height: "50px",
		borderRadius: "50%"
	},
	chatCircle: {
		fontSize: "24px",
		lineHeight: "50px",
		marginLeft: "10px",
		color: "Silver"
	},
	msgCount: {
		position: "absolute",
		top: "-8px",
		right: "-5px",
		width: "28px",
		height: "28px",
		backgroundColor: "#F44336",
		color: "white",
		fontSize: "10px",
		fontWeight: "bolder",
		borderRadius: "50%",
		lineHeight: "20px",
		border: "4px solid #DEE1E5"
	}
}

function mapStateToProps(state) {
	return {
		onlineUsers: onlineListSelector(state)
	}
}

export default connect(mapStateToProps)(ChatBox);
