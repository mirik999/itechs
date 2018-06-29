import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const UserRoute = ({ socket, user, component: Component, ...rest }) => {
	return(
		<Route
			{ ...rest }
			render={ props => user.email ? <Component socket={socket} {...props} /> : <Redirect to="/" /> }
		/>
	);
}

function mapStateToProps(state) {
	return {
		user: state.user
	}
}

export default connect(mapStateToProps)(UserRoute);
