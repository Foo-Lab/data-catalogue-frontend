import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { string, element, instanceOf, bool, func } from 'prop-types';
import { useHistory, Link } from 'react-router-dom';
import { Table, Tooltip, Button } from 'antd';
import {
    PlusOutlined,
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
} from '@ant-design/icons';

import PageHeader from '../PageHeader';
import DeleteModal from '../DeleteModal';

import { changePage, sortPage } from '../../store/listPageSlice';

import './ListPage.scss';
import { useDataReducer } from '../../hooks';

const ListPage = ({
    name,
    icon,
    baseUrl,
    columns,
    getData,
    onDelete,
    showAddButton,
    showViewButton,
    showEditButton,
    showDeleteButton,
    showBackButton,
    allowClickRow,
}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const pageContent = useRef();

    const [data, dataDispatch] = useDataReducer();
    const [isLoading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const pageNum = useSelector(state => state.listPage.pageNum);
    const pageSize = useSelector(state => state.listPage.pageSize);
    const sortBy = useSelector(state => state.listPage.sortBy);
    const sortDir = useSelector(state => state.listPage.sortDir);

    useEffect(() => {
        setLoading(true);

        const fetchData = async () => {
            const { count, result } = await getData(
                pageNum,
                pageSize,
                sortBy,
                sortDir,
            );
            setTotalRecords(count);
            // setData(result);

            pageContent.current.scrollTo({ top: 0, behavior: 'instant' });
            setLoading(false);
            dataDispatch({ type: "SET_DATA", value: result });
        }
        fetchData().catch(error => {
            console.error(error);
            dataDispatch({ type: "ERROR", value: error });
        });
    }, [pageNum, pageSize, sortBy, sortDir]);

    const onChange = (pagination, filters, sorter, extra) => {
        const { action } = extra;
        switch (action) {
            case 'paginate': {
                const { current, pageSize: size } = pagination;
                dispatch(changePage({
                    pageNum: current,
                    pageSize: size,
                }));
                break;
            }
            case 'sort': {
                const { field, order } = sorter;
                dispatch(sortPage({
                    sortBy: Array.isArray(field)
                        ? field.join('.')
                        : field,
                    sortDir: order === 'ascend' ? 'asc' : 'desc',
                }));
                break;
            }
            case 'filter': {
                break;
            }
            default:
        }
    };

    const onClickRow = (record) => allowClickRow && history.push(`${baseUrl}/view/${record.id}`)

    const onClickAction = (event) => {
        event.stopPropagation();
    }

    const onDeleteItem = async (item) => {
        await onDelete(item.id);
        // setData(d => d.filter(e => e.id !== item.id));
        dataDispatch({ type: "DELETE_RECORD", value: item.id });
    }

    const renderListActions = (id, record) => (
        <div className='list-actions'>
            {showViewButton &&
                <Link
                    to={`${baseUrl}/view/${id}`}
                    onClick={onClickAction}
                >
                    <Tooltip title='View'>
                        <EyeOutlined />
                    </Tooltip>
                </Link>
            }
            {showEditButton &&
                <Link
                    to={`${baseUrl}/edit/${id}`}
                    onClick={onClickAction}
                >
                    <Tooltip title='Edit'>
                        <EditOutlined />
                    </Tooltip>
                </Link>
            }
            {showDeleteButton &&
                <Button
                    type='link'
                    onClick={(event) => {
                        event.stopPropagation();
                        setItemToDelete(record);
                        setModalOpen(true);
                    }}
                >
                    <Tooltip title='Delete'>
                        <DeleteOutlined />
                    </Tooltip>
                </Button>
            }
        </div>
    );

    // TODO when setting a page in the middle of range, too many pagination buttons show
    // TODO when scrolling, can see row behind sticky header
    return (
        <div className='list-page'>
            <PageHeader
                name={name}
                icon={icon}
                showBackButton={showBackButton}
            >
                {showAddButton &&
                    <Link to={`${baseUrl}/add`}>
                        <Tooltip title='Add'>
                            <Button
                                type='primary'
                                shape='circle'
                                icon={<PlusOutlined />}
                            />
                        </Tooltip>
                    </Link>
                }
            </PageHeader>

            <div className='page-content' ref={pageContent}>
                {data.ok ?
                    <Table
                        columns={
                            (showViewButton || showEditButton || showDeleteButton)
                                ? [
                                    ...columns,
                                    {
                                        title: 'Actions',
                                        dataIndex: 'id',
                                        width: 100,
                                        render: (id, record) => renderListActions(id, record),
                                    }
                                ]
                                : columns
                        }
                        dataSource={data.value}
                        rowKey='id'
                        onChange={onChange}
                        onRow={(record) => ({
                            onClick: () => onClickRow(record),
                        })}
                        sticky
                        loading={isLoading}
                        pagination={{
                            current: pageNum,
                            pageSize,
                            showSizeChanger: true,
                            total: totalRecords,
                            showTotal: (total, range) => `${range[0]} - ${range[1]} of ${total} records`,
                        }}
                    /> :
                    <p>{`${data.errorMessage}`}</p>
                }
                {itemToDelete?.name &&
                    <DeleteModal
                        name={itemToDelete.name}
                        isOpen={isModalOpen}
                        toggleOpen={setModalOpen}
                        onDelete={() => onDeleteItem(itemToDelete)}
                    />
                }
            </div>
        </div>
    );
};

ListPage.propTypes = {
    name: string.isRequired,
    icon: element,
    baseUrl: string.isRequired,
    columns: instanceOf(Array).isRequired,
    getData: func.isRequired,
    onDelete: func,
    showAddButton: bool,
    showViewButton: bool,
    showEditButton: bool,
    showDeleteButton: bool,
    showBackButton: bool,
    allowClickRow: bool,
};

ListPage.defaultProps = {
    icon: null,
    onDelete: null,
    showAddButton: true,
    showViewButton: true,
    showEditButton: true,
    showDeleteButton: true,
    showBackButton: false,
    allowClickRow: true,
};

export default ListPage;
