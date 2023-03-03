/* eslint-disable react/forbid-prop-types */
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { func, object, string } from 'prop-types';
// import { authenticationService } from '@/_services';

const PrivateRoute = ({ component: Component, roles, ...rest }) => {
    const currentUser = useSelector(state => (state.user));
    console.log('currentUser', currentUser);

    return (
        <Route {...rest} render={props => {
            if (!currentUser) {
                console.log('redirecting...');
                // not logged in so redirect to login page with the return url
                return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
            }

            // check if route is restricted by role
            if (roles && roles.indexOf(currentUser.role) === -1) {
                // role not authorised so redirect to home page
                return <Redirect to={{ pathname: '/' }} />
            }

            console.log('success!');
            return <Component {...props} />
        }} />
    )
};

PrivateRoute.propTypes = {
    component: func,
    roles: string,
    location: object
}

PrivateRoute.defaultProps = {
    component: null,
    roles: null,
    location: null
}

export default PrivateRoute;
