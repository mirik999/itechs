import React, {PureComponent, Fragment} from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Fa, Button, Popover, PopoverBody, PopoverHeader } from 'mdbreact';
//user components
import UserImage from './UserImage';
//selectors
import { onlineListSelector } from '../../reducer/user';
//css
import './style.css';


class UserName extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			message: ''
		}

		this.onMessage = this.onMessage.bind(this)
		this.onChange = this.onChange.bind(this)
	}

	onChange = (e) => {
		this.setState({ message: e.target.value })
	}
	
	onMessage = (e) => {
		console.log(this.state.message)
	}

	render() {
		const { userprofile, me, className, online } = this.props;
		const onlineUsers = online.length !== 0 && online.map(users => users.username);
		const checkForStatus = onlineUsers && onlineUsers.indexOf(userprofile.author.username) > -1;
		const load2image = "http://res.cloudinary.com/developers/image/upload/v1524312085/load2image_b3hqn9.jpg";

		return (
			<section className="d-inline-flex">
				<Popover component="span" placement="right" popoverBody={userprofile.author.username}
				         className={className}>
					<PopoverHeader className="p-0">
						<UserImage image={userprofile.author.bgImg} load2image={userprofile.author.smallImage} style={styles.bgImg}/>
						<UserImage image={userprofile.author.useravatar} load2image={load2image} style={styles.avatarImg} />
						<span className={classNames({
							"user-online": checkForStatus,
							"user-offline": !checkForStatus,
						})}></span>
						<div className="my-4">&nbsp;</div>
						<div className="text-center text-secondary font-weight-bold">
							<span>{userprofile.author.username}</span>
						</div>
						<div className="text-center text-secondary font-weight-bold">
							<small>{userprofile.author.email}</small>
						</div>
						<div className="text-secondary font-weight-bold p-2 word-wrap">
							{ userprofile.author.about &&
							<Fragment><small>About: <em>{ userprofile.author.about }</em></small><br/></Fragment> }
							{ userprofile.author.github &&
							<Fragment><small>GitHub: <em>{ userprofile.author.github }</em></small><br/></Fragment> }
							{ userprofile.author.contact &&
							<Fragment><small>Contact: <em>{ userprofile.author.contact }</em></small><br/></Fragment> }
							{ userprofile.author.portfolio &&
							<Fragment><small>Portfolio: <em>{ userprofile.author.portfolio }</em></small></Fragment> }
						</div>
					</PopoverHeader>
					<PopoverBody>
						<div className="row">
							<div className="col-12 d-inline-flex">
								<form className="form-inline">
									{
										me.username ? (userprofile.author.username !== me.username ?
											<div className="input-group mb-2 mr-sm-2">
												<input type="text" className="form-control" id="inlineFormInputGroupUsername2"
												       placeholder={`msg for @${userprofile.author.username}`}
												       value={this.state.message} onChange={this.onChange} />
												<div className="input-group-prepend">
													<div className="input-group-text cursor-pointer hoverme" onClick={this.onMessage}>
														<Fa icon="send" />
													</div>
												</div>
											</div> :
											<span className="text-center"><small>For more information - <Link
												to={`/profile/@${userprofile.author.username}`} className="text-secondary font-weight-bold">
												click</Link></small>
											</span>) :
											<span className="text-center text-secondary font-weight-bold">
												<small>Please <Link
													to="/authorization" className="text-secondary font-weight-bold">
													sign in</Link> for sending message</small>
											</span>
									}
								</form>
							</div>
						</div>
					</PopoverBody>
				</Popover>
			</section>
		);
	}
}

const styles = {
	bgImg: {
		position: "relative",
		width: "100%",
		height: "125px",
	},
	avatarImg: {
		position: "absolute",
		top: "75px",
		left: "90px",
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
		online: onlineListSelector(state)
	}
}

export default connect(mapStateToProps)(UserName);
