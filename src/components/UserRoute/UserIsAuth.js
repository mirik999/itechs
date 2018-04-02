import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const UserRoute = ({ user, component: Component, ...rest }) => (
  <Route
    { ...rest }
    render={ props => !user.email ? <Component {...props} /> : <Redirect to="/404" /> }
  />
);

function mapStateToProps(state) {
	return {
		user: state.user
	}
}

export default connect(mapStateToProps)(UserRoute);
