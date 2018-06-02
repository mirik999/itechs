import React, {PureComponent} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Fa } from 'mdbreact';
//user componenets
import UserName from '../../Utils/UserName';
//direct api requests
import api from '../../../api';
//selectors
import {onlineListSelector} from "../../../reducer/user";
//css
import './style.css';


class MyFollowers extends PureComponent {
	constructor(props) {
		super(props);
	}

	render() {
		const { profile, txt, socketUsers } = this.props;

		if (profile.followedUsers.length === 0) {
			return <h4 className="text-center">{txt.nofollowers}</h4>
		}

		return (
			<section>
				<h4 className="text-center">{txt.followers}</h4>
				<div className="row border-list-article no-gutters">
					{
						profile.followedUsers.map((user, idx) => {

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

							return(
								<div className="col-12 col-md-6 no-gutters p-2" key={idx}>
									<div className="row no-gutters">
										<div className="col-2">
											<img src={user.user.useravatar} alt="useravatar" className="img-thumbnail" style={styles.img}/>
										</div>
										<div className="col-10 word-wrap">
											<small>
												<UserName me={mySocket} userprofile={user.user} userSocket={userSocket}
												          className="cursor-pointer font-weight-bold text-secondary"/>
											</small><br />
											<small>{user.user.email}</small>
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

MyFollowers.propTypes = {
	profile: PropTypes.object.isRequired,
	txt: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
	return {
		socketUsers: onlineListSelector(state)
	}
}

export default connect(mapStateToProps)(MyFollowers);
