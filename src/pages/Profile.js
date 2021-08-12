import React, { useRef } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { Input } from 'antd';
import { UserOutlined, EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';

import ViewPage from '../components/pages/ViewPage';
import EditPage from '../components/pages/EditPage';

import apiService from '../services/apiService';

const Profile = () => {
    const { url, path } = useRouteMatch();
    const pageProps = useRef({
        name: 'Profile',
        icon: <UserOutlined />,
        baseUrl: url,
    });

    const listRows = [
        {
            title: 'Name',
            key: 'name',
        },
        {
            title: 'Username',
            key: 'username',
        },
        {
            title: 'Email',
            key: 'email',
        },
        {
            title: 'Created At',
            key: 'createdAt',
        },
        {
            title: 'Updated At',
            key: 'updatedAt',
        },
    ];

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
        {
            label: 'Password',
            name: 'password',
            required: true,
            input: <Input.Password
                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />,
        },
    ];

    const getItem = (id) => apiService.getById('user', id);

    const updateItem =  (id, record) => apiService.update('user', id, record);

    return (
        <div className='profile-page'>
            <Switch>
                <Route path={`${path}/view/:id`}>
                    <ViewPage
                        {...pageProps.current}
                        rows={listRows}
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

export default Profile;
