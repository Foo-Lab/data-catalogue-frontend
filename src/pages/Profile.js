import React, { useRef } from 'react';
import { Switch, Route, useRouteMatch, Link } from 'react-router-dom';
import { Input, Button, Checkbox } from 'antd';
import { UserOutlined, EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';

import ViewPage from '../components/pages/ViewPage';
import EditPage from '../components/pages/EditPage';

import apiService from '../services/apiService';
import ListPage from '../components/pages/ListPage';
import { compareStrings } from '../utilities';
import AddPage from '../components/pages/AddPage';

const PAGE_NAME = 'user';

const Profile = () => {
    const { url, path } = useRouteMatch();
    const pageProps = useRef({
        name: 'Profile',
        icon: <UserOutlined />,
        baseUrl: url,
    });
    const newPasswordRef = useRef();

    // list
    const tableColumns = [
        {
            title: 'User ID',
            dataIndex: 'id',
            width: '10%',
            sorter: (a, b) => !(a > b),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: (a, b) => compareStrings(a.name, b.name),
        },
        {
            title: 'Username',
            dataIndex: 'username',
            sorter: (a, b) => compareStrings(a.username, b.username),
        },
        {
            title: 'Admin',
            dataIndex: 'isAdmin',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            width: '35%',
            sorter: (a, b) => compareStrings(a.email, b.email),
        },
    ];

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

    const addNewFields = [

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
    ]

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
            label: 'Current Password',
            name: 'currentPassword',
            required: true,
            input: <Input.Password
                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />,
        },
        {
            label: 'New Password',
            name: 'newPassword',
            required: true,
            input: <Input.Password
                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                ref={newPasswordRef}
            />,
        },
        {
            label: 'Confirm New Password',
            name: 'confirmPassword',
            required: true,
            input: <Input.Password
                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                newpassref={newPasswordRef}
            />,
        },
        {
            label: 'Admin',
            name: 'isAdmin',
            required: false,
            adminOnly: true,
            input: <Checkbox />
        },
    ];

    const getAllItems = (page, size, sort, dir) => apiService.getAll(PAGE_NAME, page, size, sort, dir);

    const getItem = (id) => apiService.getById('user', id);

    const addItem = (record) => {
        apiService.create(PAGE_NAME, {...record, password: 'password'});
    }

    const updateItem = (id, record) => apiService.update('user', id, record);

    const deleteItem = (id) => apiService.remove(PAGE_NAME, id)

    return (
        <div className='profile-page'>
            <Switch>
                <Route exact path="/profile">
                    <div>
                        <p>Own profile should be displayed here</p>
                        <Link to='profile/all'>
                            <Button>Show all profiles</Button>
                        </Link>
                    </div>
                </Route>
                <Route path={`${path}/all`}>
                    <ListPage
                        {...pageProps.current}
                        columns={tableColumns}
                        getData={getAllItems}
                        onDelete={deleteItem} />
                </Route>
                <Route path={`${path}/add`}>
                    <AddPage
                        {...pageProps.current}
                        fields={addNewFields}
                        onAdd={addItem}
                    />
                </Route>
                <Route path={`${path}/view/:id`}>
                    <ViewPage
                        {...pageProps.current}
                        dataDescriptors={listRows}
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
                        isProfilePage
                    />
                </Route>
            </Switch>
        </div>
    );
};

export default Profile;
