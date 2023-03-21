import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { string, instanceOf, bool, func } from 'prop-types';
import { useNavigate, Link } from 'react-router-dom';
import { Table, Tooltip, Button, Empty } from 'antd';
import {
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
} from '@ant-design/icons';

import DeleteModal from '../DeleteModal';

import {
    checkIsDate,
    checkIsDateTime,
    formatDate,
    formatDateTime,
} from '../../utilities';
import { useDataReducer } from '../../hooks';
import { changePage, sortPage } from '../../store/listPageSlice';

import './ListTable.scss';


const ListTable = ({
    columns,
    getData,
    onDelete,
    referenceId,
    referenceUrl,
    showViewButton,
    showEditButton,
    showDeleteButton,
    allowClickRow,
}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [data, dataDispatch] = useDataReducer();
    const [isLoading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(null);
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
                referenceId // not provided by ListPage
            );
            setTotalRecords(count);

            Object.keys(result) // formats the values inside `result` if they are `date` or `datetime` objects
                .forEach(key => {
                    const field = result[key];
                    if (checkIsDate(field)) {
                        result[key] = formatDate(field);
                    } else if (checkIsDateTime(field)) {
                        result[key] = formatDateTime(field);
                    }
                });

            setLoading(false);
            dataDispatch({ type: "SET_DATA", value: result });
        };

        fetchData().catch(error => {
            console.error(error);
            dataDispatch({ type: "ERROR", value: error });
        });
    }, [pageNum, pageSize, sortBy, sortDir, referenceId]);

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

    const prefix = referenceUrl !== null ? `../../${referenceUrl}/` : '';

    const onClickRow = (record) => allowClickRow && navigate(`${prefix}view/${record.id}`)

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
                    to={`${prefix}view/${id}`}
                    relative='path'
                    onClick={onClickAction}
                >
                    <Tooltip title='View'>
                        <EyeOutlined />
                    </Tooltip>
                </Link>
            }
            {showEditButton &&
                <Link
                    to={`${prefix}edit/${id}`}
                    relative='path'
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
                    }}
                >
                    <Tooltip title='Delete'>
                        <DeleteOutlined />
                    </Tooltip>
                </Button>
            }
        </div>
    );
    return (
        <div>
            {data.ok ?
                <div>
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
                    />
                    {itemToDelete?.name &&
                        <DeleteModal
                            name={itemToDelete.name}
                            isOpen={itemToDelete !== null}
                            toggleItemToDelete={setItemToDelete}
                            onDelete={() => onDeleteItem(itemToDelete)}
                        />
                    }
                </div>
                : <Empty description={<span>{data.errorMessage}</span>} />
            }
        </div>
    )
}

ListTable.propTypes = {
    columns: instanceOf(Array).isRequired,
    getData: func.isRequired,
    onDelete: func,
    referenceId: string,
    referenceUrl: string,
    showViewButton: bool,
    showEditButton: bool,
    showDeleteButton: bool,
    allowClickRow: bool,
};

ListTable.defaultProps = {
    onDelete: null,
    referenceId: null,
    referenceUrl: null,
    showViewButton: true,
    showEditButton: true,
    showDeleteButton: true,
    allowClickRow: true,
};


export default ListTable;