import React, {PureComponent, Fragment} from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Fa, Button } from 'mdbreact';
import Popover from 'react-popover';
import Tooltip from 'material-ui/Tooltip';
import { FormattedMessage } from 'react-intl';
import io from 'socket.io-client';
//user components
import UserImage from './UserImage';
//css
import './style.css';
//socket setting
let socket;
if (process.env.NODE_ENV === 'production') {
	socket = io('https://itechs.info');
} else {
	socket = io('http://localhost:4000');
}

class UserName extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			message: '',
			privateMessages: [],
			info: null,
			showPopover: false,
			disChatInput: false
		}

		this.onMessage = this.onMessage.bind(this)
		this.onChange = this.onChange.bind(this)
		this.onShowInfo = this.onShowInfo.bind(this)
		this.onShowPopover = this.onShowPopover.bind(this)
		this.onShowPopover = this.onShowPopover.bind(this)

		this.txt = {
			about: <FormattedMessage id="profile.about" />,
			github: <FormattedMessage id="profile.git" />,
			contact: <FormattedMessage id="profile.contact" />,
			portfolio: <FormattedMessage id="profile.ptf" />,
		}

	}

	onChange = (e) => {
		this.setState({ message: e.target.value })
	}

	onShowPopover = (e) => {
		this.setState({ showPopover: !this.state.showPopover })
	}

	onShowInfo = (e) => {
		e == "about" && this.setState({ info: "about" })
		e == "gitlink" && this.setState({ info: "gitlink" })
		e == "contact" && this.setState({ info: "contact" })
		e == "portfolio" && this.setState({ info: "portfolio" })
	}
	
	onMessage = (e, author, reciever) => {
		if (e.key == "Enter") {
			const { message } = this.state;
			const data = {
				text: message,
				author,
				reciever
			}
			socket.emit('privateMessage', data)
			this.setState({ message: '', disChatInput: true })
			setTimeout(() => {
				this.setState({ disChatInput: false })
			}, 2000);
		}
	}

	renderPopoverContent = (state, props) => {

		const { message, info, disChatInput } = state;
		const { userprofile, me, userSocket } = props;

		const load2image = "http://res.cloudinary.com/developers/image/upload/v1524312085/load2image_b3hqn9.jpg";

		return (
			<div className="username-pop-wrap">
				<div className="p-0" style={{ backgroundColor: "#2f3136" }}>
					<div className="useravatar-wrap d-flex justify-content-center py-3" style={{ backgroundColor: "#202225" }}>
						<UserImage image={userprofile.useravatar} load2image={load2image} style={styles.avatarImg} />
					</div>
					{/* online / offline circle */}
					<span className={classNames({
						"user-online": userSocket.online,
						"user-offline": !userSocket.online,
					})}></span>
					{/* online / offline circle */}
					<div className="text-center text-cardlight font-weight-bold mt-2">
						<span>{userprofile.username}</span>
					</div>
					<div className="text-center text-cardlight font-weight-bold">
						<small>{userprofile.email}</small>
					</div>
					<div className="text-cardlight font-weight-bold pt-2 word-wrap d-flex justify-content-center">
						<Tooltip title={this.txt.about}>
								<span className="mx-3 cursor-pointer p-2 card-icons-hover" onClick={() => this.onShowInfo('about') }>
									<Fa icon="address-card-o" />
								</span>
						</Tooltip>
						<Tooltip title={this.txt.github}>
								<span className="mx-3 cursor-pointer p-2 card-icons-hover" onClick={() => this.onShowInfo('gitlink') }>
									<Fa icon="github" />
								</span>
						</Tooltip>
						<Tooltip title={this.txt.contact}>
								<span className="mx-3 cursor-pointer p-2 card-icons-hover" onClick={() => this.onShowInfo('contact') }>
									<Fa icon="envelope-o" />
								</span>
						</Tooltip>
						<Tooltip title={this.txt.portfolio}>
								<span className="mx-3 cursor-pointer p-2 card-icons-hover" onClick={() => this.onShowInfo('portfolio') }>
									<Fa icon="briefcase" />
								</span>
						</Tooltip>
					</div>
					<div className="text-cardlight text-center font-weight-bold p-2 word-wrap br-bottom">
							<span className="mx-2 cursor-pointer font-weight-light" style={{ fontSize: "14px" }}>
								{ info !== null && info == "about" && userprofile.about }
								{ info !== null && info == "gitlink" && userprofile.github }
								{ info !== null && info == "contact" && userprofile.contact }
								{ info !== null && info == "portfolio" && userprofile.portfolio }
							</span>
					</div>
				</div>
				<div style={{ backgroundColor: "#2f3136" }}>
					<div className="row">
						<div className="col-12 d-inline-flex">
							{
								me.username ? (userprofile.username !== me.username ?
									<div className="card-input-wrap">
										<input type="text" className="profile-card-input" id="inlineFormInputGroupUsername2"
										       placeholder={`msg for @${userprofile.username}`}
										       value={message} onChange={this.onChange} disabled={disChatInput}
										       onKeyPress={(e) => this.onMessage(e, me, userSocket)} autoComplete="off" />
									</div> :
									<span className="text-center p-3"><small className="text-secondary">Go to your - <Link
										to={`/profile/@${userprofile.username}`} className="text-cardlight font-weight-bold">
											profile</Link></small>
										</span>) :
									<span className="text-center text-cardlight font-weight-bold p-3">
										<small>Please <Link
											to="/authorization" className="text-cardlight font-weight-bold">
											sign in</Link> for sending message</small>
									</span>
							}
						</div>
					</div>
				</div>
			</div>
		)
	}

	render() {
		const { showPopover, privateMessages } = this.state;
		const { userprofile, me, userSocket } = this.props;

		// if (Object.keys(userSocket).length === 0 && Object.keys(me).length === 0) return <div></div>

		return (
			<Fragment>
				<Popover
					body={this.renderPopoverContent(this.state, this.props)}
					place="right"
					isOpen={showPopover}
					onOuterAction={this.onShowPopover}
				>
					<span className="text-secondary cursor-pointer font-weight-bold" onClick={this.onShowPopover}>
						{userprofile.username}
					</span>
				</Popover>
			</Fragment>
		)
	}
}

const styles = {
	avatarImg: {
		width: "100px",
		height: "100px",
		borderRadius: "50%",
		zIndex: "5"
	}
}


UserName.propTypes = {
	userprofile: PropTypes.object.isRequired,
	me: PropTypes.oneOfType([ PropTypes.object, PropTypes.bool ]).isRequired,
};

function mapStateToProps(state) {
	return {
		lang: state.locale.lang
	}
}

export default connect(mapStateToProps)(UserName);
