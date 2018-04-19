import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import { Fa } from 'mdbreact';
import NProgress from 'nprogress';
//direct api requests
import api from '../../../api';
//css
import './style.css';

class MyFollowers extends PureComponent {
	constructor(props) {
		super(props);
	}

	render() {
		const { profile, txt } = this.props;

		if (profile.followedUsers.length === 0) {
			return <h4 className="text-center">{txt.nofollowers}</h4>
		}

		return (
			<section>
				<h4 className="text-center">{txt.followers}</h4>
				<div className="row border-list-article no-gutters">
					{
						profile.followedUsers.map((user, idx) =>
							<div className="col-12 col-md-6 no-gutters" key={idx}>
								<div className="row no-gutters">
									<div className="col-2">
										<img src={user.user.useravatar} alt="useravatar" className="img-thumbnail" style={styles.img}/>
									</div>
									<div className="col-10 word-wrap">
										<small>{user.user.username}</small><br />
										<small>{user.user.email}</small>
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

MyFollowers.propTypes = {
	profile: PropTypes.object.isRequired,
	txt: PropTypes.object.isRequired,
};

export default MyFollowers;
