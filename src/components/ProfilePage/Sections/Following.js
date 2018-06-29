import React, {PureComponent, Fragment} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Fa } from 'mdbreact';
import NProgress from 'nprogress';
//user components
import UserName from '../../Utils/UserName';
//direct api requests
import api from '../../../api';
//selectors
import { onlineListSelector } from '../../../reducer/user';


class Following extends PureComponent {
	constructor(props) {
		super(props);

		this.onFollow = this.onFollow.bind(this);
	}

	onFollow = async (id) => {
		NProgress.start();
		const data = {
			followUserID: id,
			myID: this.props.profile._id,
		}
		const delFollowUser = await api.user.follow(data)
		this.props.deleteFollower(delFollowUser)
		NProgress.done();
	}

	render() {
		const { socketUsers, profile, txt, socket } = this.props;

		if (profile.myFollows.length === 0) {
			return <h4 className="text-center">{txt.nofollowing}</h4>
		}

		return (
			<div className="row justify-content-start">
				{
					profile.myFollows.map((user, idx) => {

						// filter single user from socketOnlineList and convert to object
						const userSocket = socketUsers.filter(socket => socket.username === user.user.username)
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
							<div className="col-6 col-sm-4 col-lg-4 d-flex my-2 my-lg-0" key={idx}>
								<div className="f-img">
									<img src={user.user.useravatar} alt="useravatar"
									     className="user-avatar"
									/>
								</div>
								<div className="f-data d-flex flex-column justify-content-between">
									<small className="px-2">
										<UserName me={mySocket} userprofile={user.user} userSocket={userSocket} socket={socket}
										          className="cursor-pointer text-secondary"/>
									</small>
									<span className="text-secondary cursor-pointer px-2" onClick={ () => this.onFollow(user.user._id) }>
										<small><Fa icon="user-times" /> {txt.unFollow}</small>
									</span>
								</div>
							</div>
						)
					})
				}
			</div>
		);
	}
}

Following.propTypes = {
	profile: PropTypes.object.isRequired,
	txt: PropTypes.object.isRequired,
};


function mapStateToProps(state) {
	return {
		socketUsers: onlineListSelector(state)
	}
}

export default connect(mapStateToProps)(Following);

