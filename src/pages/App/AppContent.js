import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Login from '../Login/Login';
import Experiments from '../Experiments/Experiments';

const AppContent = () => (
    <Switch>
        <Route path='/experiments' component={Experiments} />
        <Route exact path='/' component={Login} />
    </Switch>
);

export default AppContent;
