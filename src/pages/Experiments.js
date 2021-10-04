import React, { useRef, useState, useEffect} from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { Input, DatePicker } from 'antd';
import { ExperimentOutlined } from '@ant-design/icons';
import moment from 'moment';
import { plural } from 'pluralize';

import ListPage from '../components/pages/ListPage';
import AddPage from '../components/pages/AddPage';
import ViewPage from '../components/pages/ViewPage';
import EditPage from '../components/pages/EditPage';
import AddEditSelect from '../components/AddEditSelect';

import apiService from '../services/apiService';
import { compareStrings } from '../utilities';

const PAGE_NAME = 'experiment';

const Experiments = () => {
    const { url, path } = useRouteMatch();
    const pageProps = useRef({
        name: plural(PAGE_NAME),
        icon: <ExperimentOutlined />,
        baseUrl: url,
    });

    const [ users, setUsers ] = useState([]);

    useEffect(() => {
        const getOptions = async () => {
            const { result } = await apiService.getAll('user');
            setUsers(result);
        };

        getOptions();
    }, []);

    // list
    const tableColumns = [
        {
            title: 'User',
            dataIndex: ['User', 'name'],
            sorter: (a, b) => compareStrings(a.User.name, b.User.name),
        },
        {
            title: 'Date',
            dataIndex: 'date',
            render: (date) => moment(date).format('DD/MM/YYYY'),
            sorter: (a, b) => new Date(b.date) - new Date(a.date),
        },
        {
            title: 'Code',
            dataIndex: 'code',
            sorter: (a, b) => compareStrings(a.code, b.code),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: (a, b) => compareStrings(a.name, b.name),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            ellipsis: true,
            width: '35%',
        },
    ];

    // view
    const listRows = [
        {
            title: 'User',
            key: ['User', 'name'],
        },
        {
            title: 'Date',
            key: 'date',
        },
        {
            title: 'Code',
            key: 'code',
        },
        {
            title: 'Name',
            key: 'name',
        },
        {
            title: 'Description',
            key: 'description',
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

    // add edit
    const formFields = [
        {
            label: 'User',
            name: 'userId',
            required: true,
            input: AddEditSelect({ options: users }),
        },
        {
            label: 'Date',
            name: 'date',
            required: true,
            input: <DatePicker showToday format='DD/MM/YYYY' />,
        },
        {
            label: 'Code',
            name: 'code',
            required: true,
            input: <Input />,
        },
        {
            label: 'Name',
            name: 'name',
            required: true,
            input: <Input />,
        },
        {
            label: 'Description',
            name: 'description',
            input: <Input.TextArea rows={8}/>,
        },
    ];

    // api calls
    const getAllItems = (page, size, sort, dir) => apiService.getAll(PAGE_NAME, page, size, sort, dir);

    const getItem = (id) => apiService.getById(PAGE_NAME, id);

    const addItem = (record) => apiService.create(PAGE_NAME, record);

    const updateItem =  (id, record) => apiService.update(PAGE_NAME, id, record);

    const deleteItem = (id) => apiService.remove(PAGE_NAME, id)

    return (
        <div className='experiments-page'>
            <Switch>
                <Route exact path={path}>
                    <ListPage
                        {...pageProps.current}
                        columns={tableColumns}
                        getData={getAllItems}
                        onDelete={deleteItem}
                    />
                </Route>
                <Route path={`${path}/add`}>
                    <AddPage
                        {...pageProps.current}
                        fields={formFields}
                        onAdd={addItem}
                    />
                </Route>
                <Route path={`${path}/view/:id`}>
                    <ViewPage
                        {...pageProps.current}
                        rows={listRows}
                        getData={getItem}
                        onDelete={deleteItem}
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
