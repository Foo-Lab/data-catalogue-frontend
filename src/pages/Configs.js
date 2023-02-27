import React, { useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { string } from 'prop-types';
import { Input } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { plural } from 'pluralize';

import ListPage from '../components/pages/ListPage';
import AddPage from '../components/pages/AddPage';
import EditPage from '../components/pages/EditPage';

import { clearPageState } from '../store/listPageSlice';
import apiService from '../services/apiService';
import { splitCamelCase, compareStrings } from '../utilities';

const Configs = ({ name }) => {
    const dispatch = useDispatch();
    const { url, path } = useRouteMatch();
    const pageProps = useRef({
        name: splitCamelCase(plural(name)),
        icon: <SettingOutlined />,
        baseUrl: url,
    });

    useEffect(() => () => {
        dispatch(clearPageState());
    }, []);

    // list
    const tableColumns = [
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: (a, b) => compareStrings(a.name, b.name),
        },
    ];

    // add edit
    const formFields = [
        {
            label: 'Name',
            name: 'name',
            required: true,
            input: <Input />,
        },
    ];

    // api calls
    const getAllItems = (page, size, sort, dir) => apiService.getAll(name, page, size, sort, dir);

    const getItem = (id) => apiService.getById(name, id);

    const addItem = (record) => apiService.create(name, record);

    const updateItem =  (id, record) => apiService.update(name, id, record);

    const deleteItem = (id) => apiService.remove(name, id)

    return (
        <div className='configs-page'>
            <Switch>
                <Route exact path={path}>
                    <ListPage
                        {...pageProps.current}
                        columns={tableColumns}
                        getData={getAllItems}
                        onDelete={deleteItem}
                        showViewButton={false}
                        allowClickRow={false}
                    />
                </Route>
                <Route path={`${path}/add`}>
                    <AddPage
                        {...pageProps.current}
                        fields={formFields}
                        onAdd={addItem}
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

Configs.propTypes = {
    name: string.isRequired,
};

export default Configs;
