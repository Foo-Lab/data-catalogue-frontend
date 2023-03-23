import React, { useState, useEffect } from 'react';
import { shape, string, element, instanceOf, func, bool } from 'prop-types';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Descriptions, Tooltip, Button, Empty, Divider, Typography } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
// import { useSelector } from 'react-redux';

import PageHeader from '../PageHeader';
import DeleteModal from '../DeleteModal';
import ListTable from './ListTable';

import {
    checkIsDate,
    checkIsDateTime,
    formatDate,
    formatDateTime,
    getNestedObject,
} from '../../utilities';
import { useDataReducer } from '../../hooks';

import './ViewPage.scss';

const { Text } = Typography;
const { Item } = Descriptions;

const ViewPage = ({
    name,
    icon,
    dataDescriptors,
    getData,
    getByFk,
    deleteByFk,
    referencedBy,
    allowClickRow,
    allowView,
    listColumns,
    onDelete,
    showEditButton,
    showDeleteButton,
    showBackButton,
}) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [pageData, dispatchPageData] = useDataReducer();
    const [isModalOpen, setModalOpen] = useState(false);

    // const pageNum = useSelector(state => state.listPage.pageNum);
    // const pageSize = useSelector(state => state.listPage.pageSize);
    // const sortBy = useSelector(state => state.listPage.sortBy);
    // const sortDir = useSelector(state => state.listPage.sortDir);

    useEffect(() => {
        const fetchData = async () => {
            const { result } = await getData(id);
            // const matchingRecords = getByFk ? await getByFk(pageNum, pageSize, sortBy, sortDir, id) : {};
            // console.log('matching: ', matchingRecords);
            // Object.assign(result, { [referencedBy]: matchingRecords.result });
            Object.keys(result).forEach(key => {
                const field = result[key];
                if (checkIsDate(field)) {
                    result[key] = formatDate(field);
                } else if (checkIsDateTime(field)) {
                    result[key] = formatDateTime(field);
                }
            });
            console.log('THE RESULT', result);
            dispatchPageData({ type: "SET_DATA", value: result });
        };

        fetchData().catch(error => {
            console.error(error);
            dispatchPageData({ type: "ERROR", value: error });
        });
    }, [id]);

    const onDeleteItem = async (item) => {
        await onDelete(item.id);
        navigate(-1);
    }

    // const copyClipboard = async () => { };
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
                        <Link to='edit'>
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
                {pageData.ok
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
                                                ? getNestedObject(pageData.value, each.key) // descriptor info is in a nested object
                                                : pageData.value[each.key] // descriptor can be easily accessed
                                        }
                                    </Item>
                                ))
                            }
                        </Descriptions>
                        {referencedBy !== null &&
                            <>
                                <Divider><Text strong>{referencedBy.name} associated with this {name.slice(0, -1)}</Text></Divider>
                                <ListTable
                                    referenceUrl={referencedBy.url}
                                    columns={listColumns}
                                    getData={getByFk}
                                    onDelete={deleteByFk}
                                    referenceId={id}
                                    showViewButton={allowView}
                                    showEditButton={allowView}
                                    showDeleteButton={allowView}
                                    allowClickRow={allowClickRow}
                                />
                            </>
                        }
                    </div>
                    : <Empty description={<span>{pageData.errorMessage}</span>} />
                }
                {pageData.value?.name &&
                    <DeleteModal
                        name={pageData.value.name}
                        isOpen={isModalOpen}
                        toggleItemToDelete={setModalOpen}
                        onDelete={() => onDeleteItem(pageData.value)}
                    />
                }
            </div>
        </div>
    );
};

ViewPage.propTypes = {
    name: string.isRequired,
    icon: element,
    dataDescriptors: instanceOf(Array).isRequired,
    getData: func.isRequired,
    getByFk: func,
    deleteByFk: func,
    referencedBy:
        shape({
            url: string,
            name: string.isRequired,
        }),
    allowClickRow: bool,
    allowView: bool,
    listColumns: instanceOf(Array),
    onDelete: func,
    showEditButton: bool,
    showDeleteButton: bool,
    showBackButton: bool,
};

ViewPage.defaultProps = {
    icon: null,
    onDelete: null,
    getByFk: null,
    deleteByFk: null,
    referencedBy: null,
    allowClickRow: false,
    allowView: false,
    listColumns: null,
    showEditButton: true,
    showDeleteButton: true,
    showBackButton: true,
};

export default ViewPage;
