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

		this.closeModal = this.closeModal.bind(this);
	}

	closeModal = () => {
		this.props.closeChatModal()
	}

	render() {
		const { open, chatHistory, profile } = this.props;
		
		const outsideMsgs = chatHistory.map(msgs => msgs.message).filter(msg => msg.reciever.username === profile.username);
		const myMsgs = chatHistory.map(msgs => msgs.message).filter(msg => msg.author.username === profile.username);

		const TThistory = outsideMsgs.concat(myMsgs);

		console.log(chatHistory)
		
		
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
						TThistory.map((chat, idx) => {
							
							return (
								<div className={classNames({
									"each-sms row no-gutters": true,
									"justify-content-start": chat.author.username !== profile.username,
									"justify-content-end": chat.author.username === profile.username,
								})} key={idx}>
									
									<div className={classNames({
										"col-2 text-center": true,
										"order-1": true,
										"order-2": false
									})}>
										<img src={chat.author.useravatar} alt="user-logo" className="userlogo" />
									</div>
									
									<div className={classNames({
										"col-7 text-left sms-bg d-flex align-items-center": true,
										"order-1": false,
										"order-2": true
									})}>
										<span className="sms-text">{ `asd` }</span>
									</div>
									
								</div>
							)
						})
					}

					<div className="fixed-bottom chatbox-inputarea d-flex justify-content-between">
						<div className="d-flex align-items-center">
							<input type="text" className="chatbox-input" />
						</div>
						<div className="d-flex align-items-center">
							<span className="cursor-pointer hoverme text-secondary chatbox-sendbtn">
								<small><Fa icon="send"/> send</small>
							</span>
						</div>
					</div>

				</div>
			</Modal>
		);
	}
}

export default ChatModal;
