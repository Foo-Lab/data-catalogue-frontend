/* eslint-disable react/forbid-prop-types */
import React from 'react';
import { Route, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { func, object, string } from 'prop-types';
// import { authenticationService } from '@/_services';
// TODO use <Outlet/> 

const PrivateRoute = ({ component: Component, roles, ...rest }) => {
    const currentUser = useSelector(state => (state.user));
    console.log('currentUser', currentUser);

    return (
        <Outlet>
            <Route {...rest} render={props => {
                if (!currentUser) {
                    console.log('redirecting...');
                    // not logged in so redirect to login page with the return url
                    return <Navigate to={{ pathname: '/login', state: { from: props.location } }} />
                }

                // check if route is restricted by role
                if (roles && roles.indexOf(currentUser.role) === -1) {
                    // role not authorised so redirect to home page
                    return <Navigate to={{ pathname: '/' }} />
                }

                console.log('success!');
                return <Component {...props} />
            }} />
        </Outlet>
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
