import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import 'antd/dist/antd.css';
import './App.scss';
import AppLayout from './AppLayout';

const App = () => (
    <div className='app'>
        <Router>
            <AppLayout />
        </Router>
    </div>
);

export default App;
