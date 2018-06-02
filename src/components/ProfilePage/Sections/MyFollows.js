import React, {PureComponent} from 'react';
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
//css
import './style.css';

class MyFollows extends PureComponent {
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
		const { socketUsers, profile, txt } = this.props;

		if (profile.myFollows.length === 0) {
			return <h4 className="text-center">{txt.nofollowing}</h4>
		}

		return (
			<section>
				<h4 className="text-center">{txt.following}</h4>
				<div className="row border-list-article no-gutters">
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
							<div className="col-12 col-md-6 no-gutters" key={idx}>
								<div className="row no-gutters p-2">
									<div className="col-2">
										<img src={user.user.useravatar} alt="useravatar" className="img-thumbnail" style={styles.img}/>
									</div>
									<div className="col-5 word-wrap">
										<small>
											<UserName me={mySocket} userprofile={user.user} userSocket={userSocket}
											          className="cursor-pointer font-weight-bold text-secondary"/>
										</small><br/>
										<small>{ user.user.email }</small>
									</div>
									<div className="col-5 d-flex align-self-end justify-content-end">
									<span className="text-secondary cursor-pointer hoverme p-2" onClick={ () => this.onFollow(user.user._id) }>
										<small><Fa icon="user-times" /> {txt.unFollow}</small>
									</span>
									</div>
								</div>
							</div>
							)
					})
					}
				</div>
			</section>
		);
	}
}

const styles = {
	img: {
		width: "50px",
		height: "50px"
	}
}

MyFollows.propTypes = {
	profile: PropTypes.object.isRequired,
	txt: PropTypes.object.isRequired,
};


function mapStateToProps(state) {
	return {
		socketUsers: onlineListSelector(state)
	}
}

export default connect(mapStateToProps)(MyFollows);
