import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Experiments from '../Experiments';
import Samples from '../Samples';
import Config from '../Configs';
import Profile from '../Profile';
import Login from '../Login';

import constants from '../../constants';
import PrivateRoute from '../../components/PrivateRoute';

// TODO check if AccessToken exists and is valid
// TODO wrap all routes except login with PrivateRoute

const AppRoutes = () =>
    <Routes>
        <Route element={<PrivateRoute />}>
            <Route path='/experiments/*' element={<Experiments />} />
            <Route path='/samples/*' element={<Samples />} />

            <Route path='/fileTypes/*' element={<Config name={constants.CONFIG_FILE_TYPE} key='fileTypes' />} />
            <Route path='/organisms/*' element={<Config name={constants.CONFIG_ORGANISM} key='organisms' />} />
            <Route path='/sequencers/*' element={<Config name={constants.CONFIG_SEQUENCER} key='sequencers' />} />
            <Route path='/sequencingProviders/*' element={<Config name={constants.CONFIG_SEQUENCING_PROVIDER} key='sequencingProviders' />} />
            <Route path='/sequencingTypes/*' element={<Config name={constants.CONFIG_SEQUENCING_TYPE} key='sequencingTypes' />} />
            <Route path='/statuses/*' element={<Config name={constants.CONFIG_STATUS} key='statuses' />} />

            <Route path='/profile/*' element={<Profile />} />
            <Route path='/unauthorized' element={<h1>422 You do not have permission to view this page. Contact a system administrator. </h1>} />
            <Route path='/*' element={<h1>404 Page Invalid. </h1>} />
        </Route>
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Navigate to='/experiments' replace />} />
    </Routes>


export default AppRoutes;
