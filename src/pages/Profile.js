import React, { useRef } from 'react';
import {
    Switch,
    Route,
    useRouteMatch,
} from 'react-router-dom';
import { Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import ViewPage from '../components/pages/ViewPage';
import EditPage from '../components/pages/EditPage';

const Experiments = () => {
    const { url, path } = useRouteMatch();
    const pageProps = useRef({
        name: 'Profile',
        icon: <UserOutlined />,
        baseUrl: url,
    });

    const formFields = [
        {
            label: 'Name',
            name: 'name',
            required: true,
            input: <Input />,
        },
        {
            label: 'Username',
            name: 'username',
            required: true,
            input: <Input />,
        },
        {
            label: 'Email',
            name: 'email',
            required: true,
            input: <Input />,
        },
    ];

    const getItem = () => ({
        id: 1,
        name: 'Livvi Sim',
        username: 'livvis',
        email: 'livvisim@gmail.com'
    });

    const updateItem = (record) => {
        console.log('updateItem', record);
    }

    return (
        <div className='experiments-page'>
            <Switch>
                <Route exact path={path}>
                    <ViewPage
                        {...pageProps.current}
                        getData={getItem}
                        showDeleteButton={false}
                        showBackButton={false}
                    />
                </Route>
                <Route path={`${path}/edit/:id`}>
                    <EditPage
                        {...pageProps.current}
                        fields={formFields}
                        getData={getItem}
                        onEdit={updateItem}
                    />
                </Route>
            </Switch>
        </div>
    );
};

export default Experiments;
