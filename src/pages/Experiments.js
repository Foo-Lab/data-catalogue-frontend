import React, { useRef, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Input, DatePicker, Tooltip, Button } from 'antd';
import { DotChartOutlined, ExperimentOutlined } from '@ant-design/icons';
import moment from 'moment';
import { plural } from 'pluralize';

import ListPage from '../components/pages/ListPage';
import AddPage from '../components/pages/AddPage';
import ViewPage from '../components/pages/ViewPage';
import EditPage from '../components/pages/EditPage';
import ListTable, { getColumnSearchProps } from '../components/pages/ListTable';
import AddEditSelect from '../components/AddEditSelect';

import { clearPageState } from '../store/listPageSlice';
import apiService from '../services/apiService';
import { compareStrings } from '../utilities';
import PageHeader from '../components/PageHeader';
import { useAuth, usePrivateAxios } from '../hooks';

const PAGE_NAME = 'experiment';

const Experiments = () => {
    const dispatch = useDispatch();
    const auth = useAuth();
    const axiosPrivate = usePrivateAxios();

    const pageProps = useRef({
        name: plural(PAGE_NAME),
        referencedBy: { name: 'Sample', url: 'samples' },
        icon: <DotChartOutlined />,
    });

    const [users, setUsers] = useState([]);

    useEffect(() => {
        const getOptions = async () => {
            const { result } = await apiService.getAll(axiosPrivate, 'user');
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
            ...getColumnSearchProps(['User', 'name'])
        },
        {
            title: 'Experiment Name',
            dataIndex: 'name',
            sorter: (a, b) => compareStrings(a.name, b.name),
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Seq ID',
            dataIndex: 'code',
            sorter: (a, b) => compareStrings(a.code, b.code),
            ...getColumnSearchProps('code'),
        },
        {
            title: 'Date',
            dataIndex: 'date',
            render: (date) => moment(date).format('DD/MM/YYYY'),
            sorter: (a, b) => new Date(b.date) - new Date(a.date),
            ...getColumnSearchProps('date'),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            ellipsis: true,
            width: '35%',
            ...getColumnSearchProps('description'),
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
            initialValue: auth.userId,
        },
        {
            label: 'Date',
            name: 'date',
            required: true,
            input: <DatePicker showToday format='DD/MM/YYYY' />,
            initialValue: moment(new Date().getDate(), 'DD/MM/YYYY')
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
    const getAllItems = (page, size, sort, dir) => apiService.getAll(axiosPrivate, PAGE_NAME, page, size, sort, dir);

    const getItem = (id) => apiService.getById(axiosPrivate, PAGE_NAME, id);

    const getByExpt = (page, size, sort, dir, id) => apiService.getAllWhere(axiosPrivate, PAGE_NAME, page, size, sort, dir, { route: 'sample', id });

    const addItem = (record) => apiService.create(axiosPrivate, PAGE_NAME, record);

    const updateItem = (id, record) => apiService.update(axiosPrivate, PAGE_NAME, id, record);

    const deleteItem = (id) => apiService.remove(axiosPrivate, PAGE_NAME, id)

    const deleteSampleItem = (id) => apiService.remove(axiosPrivate, 'sample', id)

    const refPage = () => {
        const { pathname } = useLocation();
        const experimentId = pathname.split("/")[pathname.split("/").length - 1]
        return (<>
            <PageHeader
                name={`Related ${plural(pageProps.current.referencedBy.name)}`}
                icon={<ExperimentOutlined />}
                showBackButton={false}
                showBreadCrumbs={false}
            >
                <Tooltip title={`Add new ${pageProps.current.referencedBy.name}`} >
                    <Link to={`/samples/add?experimentId=${experimentId}`}>
                        <Button type='primary' shape='circle' icon={<ExperimentOutlined />} />
                    </Link>
                </Tooltip>
            </PageHeader>
            <ListTable
                referenceUrl={pageProps.current.referencedBy.url}
                columns={sampleCols}
                getData={getByExpt}
                onDelete={deleteSampleItem}
                allowClickRow
                allowView
            />
        </>)
    }

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
                        referenceListPage={refPage()}
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
