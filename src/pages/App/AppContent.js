import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Experiments from '../Experiments';
import Samples from '../Samples';
import Config from '../Configs';
import Profile from '../Profile';
import Login from '../Login';

import constants  from '../../constants';

const AppContent = () => (
    <Switch>
        <Route path='/experiments' component={Experiments} />
        <Route path='/samples' component={Samples} />

        <Route path='/fileTypes' key='fileTypes' render={() => <Config name={constants.CONFIG_FILE_TYPE} />} />
        <Route path='/organisms' key='organisms' render={() => <Config name={constants.CONFIG_ORGANISM} />} />
        <Route path='/sequencers' key='sequencers' render={() => <Config name={constants.CONFIG_SEQUENCER} />} />
        <Route path='/sequencingProviders' key='sequencingProviders' render={() => <Config name={constants.CONFIG_SEQUENCING_PROVIDER} />} />
        <Route path='/sequencingTypes' key='sequencingTypes' render={() => <Config name={constants.CONFIG_SEQUENCING_TYPE} />} />
        <Route path='/statuses' key='statuses' render={() => <Config name={constants.CONFIG_STATUS} />} />

        <Route path='/profile' component={Profile} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/' render={() => <div>Welcome, click the sidebar to start</div>} />
    </Switch>
);

export default AppContent;
