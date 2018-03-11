import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const UserRoute = ({ user, component: Component, ...rest }) => (
    <Route
	    { ...rest }
	    render={ props => user.username ? <Component {...props} /> : <Redirect to="/404" /> }
    />
);

export default UserRoute;
