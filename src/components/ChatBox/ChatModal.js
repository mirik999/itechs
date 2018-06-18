import React, {PureComponent} from 'react';
import { Fa, Input } from 'mdbreact';
import Modal from 'react-modal';
import classNames from 'classnames';

const customStyles = {
	content : {
		top                   : '50%',
		left                  : '50%',
		right                 : 'auto',
		bottom                : 'auto',
		marginRight           : '-50%',
		transform             : 'translate(-50%, -50%)'
	}
};

Modal.setAppElement('#root');

class ChatModal extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			data: {
				chatInput: '',
				disChatInput: false
			}
		}

		this.closeModal = this.closeModal.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onClick = this.onClick.bind(this);
	}

	onChange = (e) => {
		this.setState({ [e.target.name]: e.target.value })
	}

	onClick = (mySocket, userSocket) => {
		const data = {
			text: this.state.chatInput,
			author: mySocket,
			reciever: userSocket
		}

		this.props.socket.emit('privateMessage', data)
		this.setState({ message: '', disChatInput: true })
		setTimeout(() => {
			this.setState({ disChatInput: false })
		}, 2000);
	}

	closeModal = () => {
		this.props.closeChatModal()
	}

	render() {
		const { chatInput, disChatInput } = this.state;
		const { open, chatHistory, profile, sobesednik, onlineUsers } = this.props;

		const privateChatHistory = chatHistory.filter(history => history.message.author.username === sobesednik || 
			history.message.author.username === this.props.profile.username).filter(subhistory => subhistory.message.reciever.username 
			=== sobesednik || subhistory.message.reciever.username === this.props.profile.username)

		const mySocket = onlineUsers.filter(user => user.username === profile.username)
											.reduce((result, item, index) => {
																result[index] = item;
																return result[0];
															}, {})

		const userSocket = onlineUsers.filter(user => user.username === sobesednik)
												.reduce((result, item, index) => {
																result[index] = item;
																return result[0];
															}, {})
		
		return (
			<Modal
				isOpen={open}
				onRequestClose={this.closeModal}
				style={customStyles}
				contentLabel="Chat Box"
				overlayClassName="Overlay"
			>
				<div className="chatting-wrap d-flex flex-column">

					{
						privateChatHistory.map((chat, idx) => {
							
							return (
								<div className={classNames({
									"each-sms row no-gutters": true,
									"justify-content-start": chat.message.author.username !== profile.username,
									"justify-content-end": chat.message.author.username === profile.username,
								})} key={idx}>
									
									<div className={classNames({
										"col-2 text-center": true,
										"order-1": chat.message.author.username !== profile.username,
										"order-2": chat.message.author.username === profile.username
									})}>
										<img src={chat.message.author.useravatar} alt="user-logo" className="userlogo" />
									</div>
									
									<div className={classNames({
										"col-7 sms-bg d-flex align-items-center": true,
										"order-1 justify-content-end": chat.message.author.username === profile.username,
										"order-2": chat.message.author.username !== profile.username
									})}>
										<span className="sms-text">{ chat.message.text }</span>
									</div>
									
								</div>
							)
						})
					}
				</div>
				<div className="chatbox-inputarea d-flex justify-content-between">
					<div className="d-flex align-items-center">
						<input type="text" className="chatbox-input" name="chatInput" value={chatInput || ' '} onChange={this.onChange} 
									 disabled={disChatInput}
						/>
					</div>
					<div className="d-flex align-items-center">
						<span className="cursor-pointer hoverme text-secondary chatbox-sendbtn" 
									onClick={() => this.onClick(mySocket, userSocket)}
						>
							<small><Fa icon="send"/> send</small>
						</span>
					</div>
				</div>
			</Modal>
		);
	}
}

export default ChatModal;
