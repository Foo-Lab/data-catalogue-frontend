import React, { useState, useEffect } from 'react';
import { string, element, instanceOf, func, bool } from 'prop-types';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Descriptions, Tooltip, Button, Empty, List, Divider, Typography, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

import PageHeader from '../PageHeader';
import DeleteModal from '../DeleteModal';
// import ListTable from './ListTable';

import {
    checkIsDate,
    checkIsDateTime,
    formatDate,
    formatDateTime,
    getNestedObject,
} from '../../utilities';

import './ViewPage.scss';
import { useDataReducer } from '../../hooks';

const { Text } = Typography;
const { Item } = Descriptions;

const ViewPage = ({
    name,
    icon,
    baseUrl,
    dataDescriptors,
    getData,
    getByFk,
    referencedBy,
    unpackReferencedFiles,
    onDelete,
    showEditButton,
    showDeleteButton,
    showBackButton,
}) => {
    const history = useHistory();
    const { id } = useParams();
    const [data, dataDispatch] = useDataReducer();
    const [isModalOpen, setModalOpen] = useState(false);

    const pageNum = useSelector(state => state.listPage.pageNum);
    const pageSize = useSelector(state => state.listPage.pageSize);
    const sortBy = useSelector(state => state.listPage.sortBy);
    const sortDir = useSelector(state => state.listPage.sortDir);

    useEffect(() => {
        const fetchData = async () => {
            const { result } = await getData(id);
            const matchingRecords = getByFk ? await getByFk(pageNum, pageSize, sortBy, sortDir, id) : {};
            console.log('matching: ', matchingRecords);
            Object.assign(result, { [referencedBy]: matchingRecords.result });
            Object.keys(result).forEach(key => {
                const field = result[key];
                if (checkIsDate(field)) {
                    result[key] = formatDate(field);
                } else if (checkIsDateTime(field)) {
                    result[key] = formatDateTime(field);
                }
            });
            console.log('THE RESULT', result);
            dataDispatch({ type: "SET_DATA", value: result });
        };

        fetchData().catch(error => {
            console.error(error);
            dataDispatch({ type: "ERROR", value: error });
        });
    }, [id]);

    const onDeleteItem = async (item) => {
        await onDelete(item.id);
        history.goBack();
    }

    const copyClipboard = async () => { };
    // const copyClipboard = async (event) => {
    //     event.stopPropagation();
    //     const url = event.target.value
    //     try {
    //         console.log(url);
    //         // await navigator.clipboard.writeText(url);
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    return (
        <div className='view-page'>
            <PageHeader
                name={name}
                action='view'
                icon={icon}
                showBackButton={showBackButton}
            >
                <>
                    {showEditButton &&
                        <Link to={`${baseUrl}/edit/${id}`}>
                            <Tooltip title={`Edit ${name}`}>
                                <Button
                                    type='primary'
                                    shape='circle'
                                    icon={<EditOutlined />}
                                />
                            </Tooltip>
                        </Link>
                    }
                    {showDeleteButton &&
                        <Button
                            type='primary'
                            shape='circle'
                            onClick={() => setModalOpen(true)}
                        >
                            <Tooltip title='Delete'>
                                <DeleteOutlined />
                            </Tooltip>
                        </Button>
                    }
                </>
            </PageHeader>

            <div className='page-content'>
                {data.ok
                    ? <div>
                        <Descriptions
                            // column={2}
                            size='small'
                            labelStyle={{ width: '10%' }}
                            bordered
                        >
                            {
                                dataDescriptors.map(each => (
                                    <Item
                                        key={
                                            Array.isArray(each.key) // check if 'key' of a data descriptor is an array. e.g. key: ['User', 'name']
                                                ? each.key.join('.') // combines ['User', 'name'] => 'User.name'
                                                : each.key
                                        }
                                        className='view-item'
                                        label={each.title}
                                        labelStyle={{ textTransform: 'capitalize' }}
                                    >
                                        {
                                            Array.isArray(each.key) // check if 'key' of a data descriptor is an array. e.g. key: ['User', 'name']
                                                ? getNestedObject(data.value, each.key) // descriptor info is in a nested object
                                                : data.value[each.key] // descriptor can be easily accessed
                                        }
                                    </Item>
                                ))
                            }
                        </Descriptions>
                        {Array.isArray(data.value[referencedBy]) &&
                            <div className='related-data'>
                                <Divider />
                                <List // will be replaced by ListTable
                                    header={<Text strong>{referencedBy} associated with this {name.slice(0, -1)}</Text>}
                                    size='small'
                                    bordered
                                    dataSource={data.value[referencedBy].map(unpackReferencedFiles)}
                                    renderItem={(item) =>
                                        <List.Item
                                            actions={[
                                                // <Space>{item.type}</Space>,
                                                <Space onClick={copyClipboard}>{item.locUrl}</Space>,
                                                <Space onClick={copyClipboard}>{item.s3Url}</Space>,
                                                // <Space>{item.added}</Space>,
                                            ]}
                                            extra={item.remarks}
                                        >
                                            {/* <div>
                                        {item.type}
                                        {item.locUrl}
                                        {item.s3Url}
                                        {item.remarks}
                                        {item.added}
                                    </div> */}
                                            <List.Item.Meta
                                                title={`${item.type}`}
                                                description={`${item.added}`}
                                            />
                                        </List.Item>}
                                />
                            </ div>}
                    </div>
                    : <Empty description={<span>{data.errorMessage}</span>} />
                }
                {data.value?.name &&
                    <DeleteModal
                        name={data.value.name}
                        isOpen={isModalOpen}
                        toggleItemToDelete={setModalOpen}
                        onDelete={() => onDeleteItem(data.value)}
                    />
                }
            </div>
        </div>
    );
};

ViewPage.propTypes = {
    name: string.isRequired,
    icon: element,
    baseUrl: string.isRequired,
    dataDescriptors: instanceOf(Array).isRequired,
    getData: func.isRequired,
    getByFk: func,
    referencedBy: string,
    unpackReferencedFiles: func,
    onDelete: func,
    showEditButton: bool,
    showDeleteButton: bool,
    showBackButton: bool,
};

ViewPage.defaultProps = {
    icon: null,
    onDelete: null,
    getByFk: null,
    referencedBy: null,
    unpackReferencedFiles: null,
    showEditButton: true,
    showDeleteButton: true,
    showBackButton: true,
};

export default ViewPage;
