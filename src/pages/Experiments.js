import React, { useRef, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import { Input, DatePicker } from 'antd';
import { DotChartOutlined } from '@ant-design/icons';
import moment from 'moment';
import { plural } from 'pluralize';

import ListPage from '../components/pages/ListPage';
import AddPage from '../components/pages/AddPage';
import ViewPage from '../components/pages/ViewPage';
import EditPage from '../components/pages/EditPage';
import TitledDivider from '../components/TitledDivider';
import ListTable from '../components/pages/ListTable';
import AddEditSelect from '../components/AddEditSelect';

import { clearPageState } from '../store/listPageSlice';
import apiService from '../services/apiService';
import { compareStrings } from '../utilities';

const PAGE_NAME = 'experiment';

const Experiments = () => {
    const dispatch = useDispatch();
    const pageProps = useRef({
        name: plural(PAGE_NAME),
        referencedBy: { name: 'Samples', url: 'samples' },
        icon: <DotChartOutlined />,
    });

    const [users, setUsers] = useState([]);

    useEffect(() => {
        const getOptions = async () => {
            const { result } = await apiService.getAll('user');
            setUsers(result);
        };
        try {
            getOptions();
        } catch (error) {
            console.log(error)
        }
        return () => {
            dispatch(clearPageState());
        };
    }, []);

    // list
    const tableColumns = [
        {
            title: 'User',
            dataIndex: ['User', 'name'],
            sorter: (a, b) => compareStrings(a.User.name, b.User.name),
        },
        {
            title: 'Experiment Name',
            dataIndex: 'name',
            sorter: (a, b) => compareStrings(a.name, b.name),
        },
        {
            title: 'Seq ID',
            dataIndex: 'code',
            sorter: (a, b) => compareStrings(a.code, b.code),
        },
        {
            title: 'Date',
            dataIndex: 'date',
            render: (date) => moment(date).format('DD/MM/YYYY'),
            sorter: (a, b) => new Date(b.date) - new Date(a.date),
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
            title: 'Experiment Name',
            key: 'name',
        },
        {
            title: 'Seq ID',
            key: 'code',
        },
        {
            title: 'Date',
            key: 'date',
        },
        {
            title: 'Description',
            key: 'description',
        },
    ];
    // list Samples
    const sampleCols = [
        {
            title: 'Date',
            dataIndex: 'date',
            render: (date) => moment(date).format('DD/MM/YYYY'),
            sorter: (a, b) => new Date(b.date) - new Date(a.date),
        },
        {
            title: 'Seq Type',
            dataIndex: ['SequencingType', 'name'],
            sorter: (a, b) => compareStrings(a.Status.name, b.Status.name),
        },
        {
            title: 'Sample ID',
            dataIndex: 'code',
            sorter: (a, b) => compareStrings(a.code, b.code),
        },
        {
            title: 'Sample Name',
            dataIndex: 'name',
            sorter: (a, b) => compareStrings(a.name, b.name),
        },
        {
            title: 'Experiment',
            dataIndex: ['Experiment', 'name'],
            sorter: (a, b) => compareStrings(a.Experiment.name, b.Experiment.name),
        },
        {
            title: 'User',
            dataIndex: ['User', 'name'],
            sorter: (a, b) => compareStrings(a.User.name, b.User.name),
        },
    ];

    // add edit
    const formFields = [
        {
            label: 'User',
            name: 'userId',
            required: true,
            input: AddEditSelect({ options: users, field: 'user' }),
        },
        {
            label: 'Date',
            name: 'date',
            required: true,
            input: <DatePicker showToday format='DD/MM/YYYY' />,
        },
        {
            label: 'Seq ID',
            name: 'code',
            required: true,
            input: <Input />,
        },
        {
            label: 'Experiment Name',
            name: 'name',
            required: true,
            input: <Input />,
        },
        {
            label: 'Description',
            name: 'description',
            input: <Input.TextArea rows={8} />,
        },
    ];

    // api calls
    const getAllItems = (page, size, sort, dir) => apiService.getAll(PAGE_NAME, page, size, sort, dir);

    const getItem = (id) => apiService.getById(PAGE_NAME, id);

    const getByExpt = (page, size, sort, dir, id) => apiService.getAllWhere(PAGE_NAME, page, size, sort, dir, { route: 'sample', id });

    const addItem = (record) => apiService.create(PAGE_NAME, record);

    const updateItem = (id, record) => apiService.update(PAGE_NAME, id, record);

    const deleteItem = (id) => apiService.remove(PAGE_NAME, id)

    const deleteSampleItem = (id) => apiService.remove('sample', id)

    return (
        <div className='experiments-page'>
            <Routes>
                <Route path="/" element={
                    <ListPage
                        {...pageProps.current}
                        columns={tableColumns}
                        getData={getAllItems}
                        onDelete={deleteItem}
                    />}
                />
                <Route path="add" element={
                    <AddPage
                        {...pageProps.current}
                        fields={formFields}
                        onAdd={addItem}
                    />}
                />
                <Route path=":id" element={
                    <ViewPage
                        {...pageProps.current}
                        dataDescriptors={listRows}
                        getData={getItem}
                        onDelete={deleteItem}
                        referenceListPage={<>
                            <TitledDivider title={`${pageProps.current.referencedBy.name} associated with this ${pageProps.current.name.slice(0, -1)}`} />
                            <ListTable
                                referenceUrl={pageProps.current.referencedBy.url}
                                columns={sampleCols}
                                getData={getByExpt}
                                onDelete={deleteSampleItem}
                                allowClickRow
                                allowView
                            />
                        </>}
                    />}
                />
                <Route path=":id/edit" element={
                    <EditPage
                        {...pageProps.current}
                        fields={formFields}
                        getData={getItem}
                        onEdit={updateItem}
                    />}
                />
            </Routes>
        </div>
    );
};

export default Experiments;
