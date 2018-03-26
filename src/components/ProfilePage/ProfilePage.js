import React, {Component} from 'react';
import { connect } from 'react-redux';
//user components
import ProvateProfile from './PrivateProfile';
import Wrapper from '../Utils/Wrapper';


class ProfilePage extends Component {
	render() {
		const { user } = this.props;

		return (
			<Wrapper>
				<ProvateProfile user={user} />
			</Wrapper>
		);
	}
}

function mapStateToProps(state) {
	return {
		user: state.user
	}
}

export default connect(mapStateToProps)(ProfilePage);
