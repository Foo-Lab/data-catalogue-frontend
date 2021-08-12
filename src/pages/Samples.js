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

const name = 'sample'

const Samples = () => {
    const { url, path } = useRouteMatch();
    const pageProps = useRef({
        name: plural(name),
        icon: <ExperimentOutlined />,
        baseUrl: url,
    });

    const [ experiments, setExperiments ] = useState([]);
    const [ users, setUsers ] = useState([]);
    const [ statuses, setStatuses ] = useState([]);
    const [ organisms, setOrganisms ] = useState([]);
    const [ sequencingTypes, setSequencingTypes ] = useState([]);
    const [ sequencers, setSeqeuncers ] = useState([]);
    const [ sequencingProviders, setSequencingProviders ] = useState([]);

    useEffect(() => {
        const getOptions = async () => {
            setExperiments(await apiService.getAll('experiment'));
            setUsers(await apiService.getAll('user'));
            setStatuses(await apiService.getAll('status'));
            setOrganisms(await apiService.getAll('organism'));
            setSequencingTypes(await apiService.getAll('sequencingType'));
            setSeqeuncers(await apiService.getAll('sequencer'));
            setSequencingProviders(await apiService.getAll('sequencingProvider'));
        };

        getOptions();
    }, []);

    // TODO nested sorting not working
    const tableColumns = [
        {
            title: 'Date',
            dataIndex: 'date',
            render: (date) => moment(date).format('DD/MM/YYYY'),
            sorter: (a, b) => new Date(b.date) - new Date(a.date),
        },
        {
            title: 'Status',
            dataIndex: ['Status', 'name'],
            sorter: (a, b) => a.Status.name > b.Status.name,
        },
        {
            title: 'Code',
            dataIndex: 'code',
            sorter: (a, b) => a.code > b.code,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: (a, b) => a.name > b.name,
        },
        {
            title: 'Experiment',
            dataIndex: ['Experiment', 'name'],
            sorter: (a, b) => a.Experiment.name > b.Experiment.name,
        },
        {
            title: 'User',
            dataIndex: ['User', 'name'],
            sorter: (a, b) => a.User.name > b.User.name,
        },
    ];

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
            title: 'Experiment',
            key: ['Experiment', 'name'],
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
            title: 'Remarks',
            key: 'remarks',
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
            label: 'Date',
            name: 'date',
            required: true,
            input: <DatePicker showToday format='DD/MM/YYYY' />,
        },
        {
            label: 'Status',
            name: 'statusId',
            required: true,
            input: AddEditSelect({ options: statuses }),
        },
        {
            label: 'User',
            name: 'userId',
            required: true,
            input: AddEditSelect({ options: users }),
        },
        {
            label: 'Experiment',
            name: 'experimentId',
            required: true,
            input: AddEditSelect({ options: experiments }),
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
            input: <Input.TextArea rows={4}/>,
        },
        {
            label: 'Organism',
            name: 'organismId',
            required: true,
            input: AddEditSelect({ options: organisms }),
        },
        {
            label: 'Tissue',
            name: 'tissue',
            input: <Input.TextArea rows={2}/>,
        },
        {
            label: 'Condition',
            name: 'condition',
            input: <Input.TextArea rows={2}/>,
        },
        {
            label: 'Treatment',
            name: 'treatment',
            input: <Input.TextArea rows={2}/>,
        },
        {
            label: 'Sequencing Type',
            name: 'sequencingTypeId',
            required: true,
            input: AddEditSelect({ options: sequencingTypes }),
        },
        {
            label: 'Sequencer',
            name: 'sequencerId',
            required: true,
            input: AddEditSelect({ options: sequencers }),
        },
        {
            label: 'Sequencing Provider',
            name: 'sequencingProviderId',
            required: true,
            input: AddEditSelect({ options: sequencingProviders }),
        },
        {
            label: 'SRA',
            name: 'sra',
            input: <Input />,
        },
        {
            label: 'Remarks',
            name: 'remarks',
            input: <Input.TextArea rows={4}/>,
        },
    ];

    const getAllItems = () => apiService.getAll(name);

    const getItem = (id) => apiService.getById(name, id);

    const addItem = (record) => apiService.create(name, record);

    const updateItem =  (id, record) => apiService.update(name, id, record);

    const deleteItem = (id) => apiService.remove(name, id)

    return (
        <div className='samples-page'>
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

export default Samples;
