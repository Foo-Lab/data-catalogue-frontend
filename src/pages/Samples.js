import React, { useRef, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import { Input, DatePicker } from 'antd';
import { ExperimentOutlined, FileOutlined } from '@ant-design/icons';
import moment from 'moment';
import { plural } from 'pluralize';

import ListPage from '../components/pages/ListPage';
import AddPage from '../components/pages/AddPage';
import ViewPage from '../components/pages/ViewPage';
import EditPage from '../components/pages/EditPage';
import ListTable from '../components/pages/ListTable';
import TitledDivider from '../components/TitledDivider';
import AddEditSelect from '../components/AddEditSelect';

import { clearPageState } from '../store/listPageSlice';
import apiService from '../services/apiService';
import { compareStrings } from '../utilities';

const PAGE_NAME = 'sample';

const Samples = () => {
    const dispatch = useDispatch();
    // const { url, path } = useRouteMatch();
    const pageProps = useRef({
        name: plural(PAGE_NAME),
        referencedBy: { name: 'Sample Files' },
        icon: <ExperimentOutlined />,
    });

    const [experiments, setExperiments] = useState([]);
    const [users, setUsers] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [organisms, setOrganisms] = useState([]);
    const [sequencingTypes, setSequencingTypes] = useState([]);
    const [sequencers, setSeqeuncers] = useState([]);
    const [sequencingProviders, setSequencingProviders] = useState([]);

    useEffect(() => {
        const getOption = async (option) => {
            const { result } = await apiService.getAll(option);
            return result;
        }
        const getOptions = async () => {
            setExperiments(await getOption('experiment'));
            setUsers(await getOption('user'));
            setStatuses(await getOption('status'));
            setOrganisms(await getOption('organism'));
            setSequencingTypes(await getOption('sequencingType'));
            setSeqeuncers(await getOption('sequencer'));
            setSequencingProviders(await getOption('sequencingProvider'));
        };
        getOptions();

        return () => {
            dispatch(clearPageState());
        };
    }, []);

    // list
    const tableColumns = [
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

    // view
    const listRows = [
        {
            title: 'Date',
            key: 'date',
        },
        {
            title: 'Status',
            key: ['Status', 'name'],
        },
        {
            title: 'User',
            key: ['User', 'name'],
        },
        {
            title: 'Sequencing Type',
            key: ['SequencingType', 'name'],
        },
        {
            title: 'Sequencer',
            key: ['Sequencer', 'name'],
        },
        {
            title: 'Sequencing Provider',
            key: ['SequencingProvider', 'name'],
        },
        {
            title: 'SRA',
            key: 'sra',
        },
        {
            title: 'Experiment',
            key: ['Experiment', 'name'],
        },
        {
            title: 'Sample ID',
            key: 'code',
        },
        {
            title: 'Sample Name',
            key: 'name',
        },
        {
            title: 'Organism',
            key: ['Organism', 'name'],
        },
        {
            title: 'Tissue',
            key: 'tissue',
        },
        {
            title: 'Condition',
            key: 'condition',
        },
        {
            title: 'Treatment',
            key: 'treatment',
        },
        {
            title: 'Description',
            key: 'description',
        },
        {
            title: 'Remarks',
            key: 'remarks',
        },
    ];
    // list SampleFiles
    const sampleFileCols = [
        {
            title: 'Type',
            dataIndex: ['FileType', 'name'],
            sorter: (a, b) => compareStrings(a.Status.name, b.Status.name),
        },
        {
            title: 'Added',
            dataIndex: 'createdAt',
            render: (date) => moment(date).format('DD/MM/YYYY'),
            sorter: (a, b) => new Date(b.date) - new Date(a.date),
        },
        {
            title: 'URL',
            dataIndex: 'locationUrl',
        },
        {
            title: 'S3 URL',
            dataIndex: 'locationS3Url',
        },
        {
            title: 'remarks',
            dataIndex: 'remarks',
        },
    ];

    // add edit
    const formFields = [
        {
            label: 'Date',
            name: 'date',
            required: true,
            input: <DatePicker showToday format='DD/MM/YYYY' />,
        },
        {
            label: 'Status',
            name: 'statusId',
            required: true,
            input: AddEditSelect({ options: statuses, field: 'status' }),
        },
        {
            label: 'User',
            name: 'userId',
            required: true,
            input: AddEditSelect({ options: users, field: 'user' }),
        },
        {
            label: 'Experiment',
            name: 'experimentId',
            required: true,
            input: AddEditSelect({ options: experiments, field: 'experiment' }),
        },
        {
            label: 'Sample ID',
            name: 'code',
            required: true,
            input: <Input />,
        },
        {
            label: 'Sample Name',
            name: 'name',
            required: true,
            input: <Input />,
        },
        {
            label: 'Description',
            name: 'description',
            input: <Input.TextArea rows={4} />,
        },
        {
            label: 'Organism',
            name: 'organismId',
            required: true,
            input: AddEditSelect({ options: organisms, field: 'organism' }),
        },
        {
            label: 'Tissue',
            name: 'tissue',
            required: true,
            input: <Input.TextArea rows={2} />,
        },
        {
            label: 'Condition',
            name: 'condition',
            required: true,
            input: <Input.TextArea rows={2} />,
        },
        {
            label: 'Treatment',
            name: 'treatment',
            required: true,
            input: <Input.TextArea rows={2} />,
        },
        {
            label: 'Sequencing Type',
            name: 'sequencingTypeId',
            required: true,
            input: AddEditSelect({ options: sequencingTypes, field: 'sequencing type' }),
        },
        {
            label: 'Sequencer',
            name: 'sequencerId',
            required: true,
            input: AddEditSelect({ options: sequencers, field: 'sequencer' }),
        },
        {
            label: 'Sequencing Provider',
            name: 'sequencingProviderId',
            required: true,
            input: AddEditSelect({ options: sequencingProviders, field: 'sequencing provider' }),
        },
        {
            label: 'SRA',
            name: 'sra',
            required: true,
            input: <Input />,
        },
        {
            label: 'Remarks',
            name: 'remarks',
            input: <Input.TextArea rows={4} />,
        },
    ];

    // api calls for samples
    const getAllItems = (page, size, sort, dir) => apiService.getAll(PAGE_NAME, page, size, sort, dir);

    const getItem = (id) => apiService.getById(PAGE_NAME, id);

    const getBySample = (page, size, sort, dir, id) => apiService.getAllWhere(PAGE_NAME, page, size, sort, dir, { route: 'sampleFile', id });

    const addItem = (record) => apiService.create(PAGE_NAME, record);

    const updateItem = (id, record) => apiService.update(PAGE_NAME, id, record);

    const deleteItem = (id) => apiService.remove(PAGE_NAME, id);

    // const addSampleFile = (record) => apiService.create(PAGE_NAME, record);

    const deleteSampleFile = (id) => apiService.remove('sampleFile', id)

    return (
        <div className='samples-page'>
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
                <Route path="/:id/new" element={
                    <AddPage
                        name='Sample File'
                        icon={<FileOutlined />}
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
                        getByFk={getBySample}
                        deleteByFk={deleteSampleFile}
                        listColumns={sampleFileCols}
                        referenceListPage={<>
                            <TitledDivider title={`${pageProps.current.referencedBy.name} associated with this ${pageProps.current.name.slice(0, -1)}`} />
                            <ListTable
                                referenceUrl={pageProps.current.referencedBy.url}
                                columns={sampleFileCols}
                                getData={getBySample}
                                onDelete={deleteSampleFile}
                                allowClickRow={false}
                            />
                        </>}
                    />
                }
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

export default Samples;
