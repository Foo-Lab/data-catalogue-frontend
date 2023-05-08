import React, { useRef } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Input, Checkbox } from 'antd';
import { UserOutlined, EyeTwoTone, EyeInvisibleOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';

import ViewPage from '../components/pages/ViewPage';
import EditPage from '../components/pages/EditPage';
import ListPage from '../components/pages/ListPage';
import AddPage from '../components/pages/AddPage';

import apiService from '../services/apiService';
import { matchExistingUsername, matchExistingEmail } from '../services/authService';
import { compareStrings } from '../utilities';
import { useAuth, usePrivateAxios } from '../hooks';
import PrivateRoute from '../components/PrivateRoute';
import { getColumnSearchProps } from '../components/pages/ListTable';

const PAGE_NAME = 'user';

const Profile = () => {
    const pageProps = useRef({
        name: 'profile',
        icon: <UserOutlined />,
    });
    const auth = useAuth();
    const axiosPrivate = usePrivateAxios();

    // list
    const tableColumns = [
        {
            title: 'User ID',
            dataIndex: 'id',
            width: '10%',
            sorter: (a, b) => !(a > b),
            ...getColumnSearchProps('id')
        },
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: (a, b) => compareStrings(a.name, b.name),
            ...getColumnSearchProps('name')
        },
        {
            title: 'Username',
            dataIndex: 'username',
            sorter: (a, b) => compareStrings(a.username, b.username),
            ...getColumnSearchProps('username')
        },
        {
            title: 'Admin',
            dataIndex: 'isAdmin',
            width: '10%',
            filters: [{ text: 'Admin', value: true }, { text: 'user', value: false }],
            onFilter: (value, record) => record.isAdmin === value,
            render: (isAdmin) => (isAdmin ? <CheckOutlined /> : <CloseOutlined />)
        },
        {
            title: 'Email',
            dataIndex: 'email',
            width: '35%',
            sorter: (a, b) => compareStrings(a.email, b.email),
            ...getColumnSearchProps('email')
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
            rules: [{
                min: 3,
                max: 50,
                message: 'Name must be between 3 and 50 characters.'
            }]
        },
        {
            label: 'Username',
            name: 'username',
            required: true,
            input: <Input />,
            rules: [{
                min: 3,
                max: 20,
                message: 'Username must be between 3 and 20 characters.'
            }]
        },
        {
            label: 'Email',
            name: 'email',
            required: true,
            input: <Input />,
            rules: [{
                min: 3,
                max: 50,
                message: 'Email must be between 3 and 50 characters.'
            }, {
                type: 'email',
                message: 'Please enter a valid email address.'
            }]
        },
    ]

    const editFields = [
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
            rules: [{
                type: 'email',
                message: 'The input is not valid E-mail!',
            }]
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
            />,
            rules: [{
                min: 8,
                message: 'Password must be at least 8 characters long.'
            }]
        },
        {
            label: 'Confirm New Password',
            name: 'confirmPassword',
            required: true,
            input: <Input.Password
                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />,
            dependencies: ['newPassword'],
            rules: [
                ({ getFieldValue }) => ({
                    validator: async (_, value) => {
                        const newPassword = getFieldValue('newPassword');
                        console.log('value: ', value, 'newPassword: ', newPassword);
                        if (value === newPassword) {
                            return Promise.resolve();
                        }
                        return Promise.reject(new Error('Passwords do not match.'));
                    },
                })
            ]
        },
        {
            label: 'Admin',
            name: 'isAdmin',
            required: false,
            adminOnly: true,
            input: <Checkbox />
        },
    ];

    const getAllItems = (page, size, sort, dir) => apiService.getAll(axiosPrivate, PAGE_NAME, page, size, sort, dir);

    const getItem = (id) => apiService.getById(axiosPrivate, 'user', id);

    const addItem = async (record) => {
        const usernameFound = await matchExistingUsername(record.username).catch(() => { });
        const emailFound = await matchExistingEmail(record.email).catch(() => { });
        if (usernameFound) { throw new Error('Username already exists.') };
        if (emailFound) { throw new Error('Email already exists.') };
        return apiService.create(axiosPrivate, PAGE_NAME, { ...record, password: 'password' });
    }

    const updateItem = async (id, record) => {
        const usernameFound = await matchExistingUsername(record.username).catch(() => { });
        const emailFound = await matchExistingEmail(record.email).catch(() => { });
        if (usernameFound && await id !== String(usernameFound?.result.id)) { throw new Error('Username already exists.') };
        if (emailFound && await id !== String(emailFound?.result.id)) { throw new Error('Email already exists.') };
        return apiService.update(axiosPrivate, 'user', id, record);
    }
    const deleteItem = (id) => apiService.remove(axiosPrivate, PAGE_NAME, id)

    return (
        <div className='profile-page'>
            <Routes>
                <Route path="/" element={
                    !auth?.isAdmin // TODO change to a check if the user is not an admin
                        ? <Navigate to={`${auth.userId}`} replace />
                        : (
                            <ListPage
                                {...pageProps.current}
                                columns={tableColumns}
                                getData={getAllItems}
                                onDelete={deleteItem}
                            />
                        )}
                />
                <Route element={<PrivateRoute adminOnly />}>
                    <Route path="add" element={
                        <AddPage
                            {...pageProps.current}
                            fields={addNewFields}
                            onAdd={addItem}
                        />}
                    />
                </Route>
                <Route path=":id" element={
                    <ViewPage
                        {...pageProps.current}
                        dataDescriptors={listRows}
                        getData={getItem}
                        showDeleteButton={false}
                        showBackButton={false}
                    />}
                />
                <Route path=":id/edit" element={
                    <EditPage
                        {...pageProps.current}
                        fields={editFields}
                        getData={getItem}
                        onEdit={updateItem}
                    />}
                />
            </Routes>
        </div>
    );
};

export default Profile;
