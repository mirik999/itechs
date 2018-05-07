import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import { Fa } from 'mdbreact';
import NProgress from 'nprogress';
//direct api requests
import api from '../../../api';
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
		const { profile, txt } = this.props;

		if (profile.myFollows.length === 0) {
			return <h4 className="text-center">{txt.nofollowing}</h4>
		}

		return (
			<section>
				<h4 className="text-center">{txt.following}</h4>
				<div className="row border-list-article no-gutters">
					{
						profile.myFollows.map((user, idx) =>
							<div className="col-12 col-md-6 no-gutters" key={idx}>
								<div className="row no-gutters p-2">
									<div className="col-2">
										<img src={user.user.useravatar} alt="useravatar" className="img-thumbnail" style={styles.img}/>
									</div>
									<div className="col-5 word-wrap">
										<small>@{user.user.username}</small><br />
										<small>{user.user.email}</small>
									</div>
									<div className="col-5 d-flex align-self-end justify-content-end">
									<span className="text-secondary cursor-pointer hoverme p-2" onClick={ () => this.onFollow(user.user._id) }>
										<small><Fa icon="user-times" /> {txt.unFollow}</small>
									</span>
									</div>
								</div>
							</div>
						)
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

export default MyFollows;
