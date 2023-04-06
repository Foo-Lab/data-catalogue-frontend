/* eslint-disable react/forbid-prop-types */
import React from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { bool } from 'prop-types';
import { useAuth } from '../hooks';
// import { authenticationService } from '@/_services';
// TODO use <Outlet/> 

const PrivateRoute = ({ adminOnly }) => {
    const auth = useAuth();
    const location = useLocation();
    // const from = location.state?.from || location.pathname;
    // console.log(location)
    if (!auth?.name) {
        // console.log(auth)
        // console.log(from)
        return <Navigate to='/login' state={{ from: location }} replace />
    }
    return (!adminOnly || auth.isAdmin)
        ? <Outlet />
        : <Navigate to='/unauthorized' state={{ from: location }} replace /> // route is adminOnly, but !user.isAdmin
};

PrivateRoute.propTypes = {
    adminOnly: bool,
}

PrivateRoute.defaultProps = {
    adminOnly: false,
}

export default PrivateRoute;
