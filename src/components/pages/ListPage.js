import React, { useState, useEffect, useRef }from 'react';
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
import { useQueryParams } from '../../hooks';

import './ListPage.scss';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT_DIR = 'asc';

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
}) => {
    const history = useHistory();
    const query = useQueryParams();
    const pageContent = useRef();

    const [data, setData] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const [pageNum, setPageNum] = useState(DEFAULT_PAGE);
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
    const [sortCol, setSortCol] = useState(null);
    const [sortDir, setSortDir] = useState(DEFAULT_SORT_DIR);

    useEffect(() => {
        const queryPage = query.get('page');
        const querySize = query.get('size');
        const querySort = query.get('sort');
        const queryDir = query.get('dir')

        if (queryPage) {
            setPageNum(queryPage);
        }
        if (querySize) {
            setPageSize(querySize);
        }
        if (querySort) {
            setSortCol(querySort);
        }
        if (queryDir) {
            setSortDir(queryDir);
        }
    }, []);

    useEffect(() => {
        setLoading(true);

        const fetchData = async () => {
            const { count, result } = await getData(
                pageNum,
                pageSize,
                sortCol,
                sortDir,
            );
            setTotalRecords(count);
            setData(result);
            setLoading(false);
            pageContent.current.scrollTo({top: 0, behavior: 'instant'});
        }

        const params = new URLSearchParams({
            page: pageNum,
            size: pageSize,
            ...sortCol && {
                sort: sortCol,
                dir: sortDir,
            }
        });
        history.push({ search: params.toString() });

        fetchData();
    }, [pageNum, pageSize, sortCol, sortDir]);

    const onChange = (pagination, filters, sorter, extra) => {
        const { action } = extra;
        switch(action) {
            case 'paginate': {
                const { current, pageSize: size } = pagination;
                setPageNum(current);
                setPageSize(size);
                break;
            }
            case 'sort': {
                const { field, order } = sorter;
                setPageNum(DEFAULT_PAGE);
                setSortCol(
                    Array.isArray(field)
                        ? field.join('.')
                        : field
                );
                setSortDir(order === 'ascend' ? 'asc' : 'desc');
                break;
            }
            case 'filter': {
                break;
            }
            default:
        }
    };

    const onClickRow = (record) => history.push(`${baseUrl}/view/${record.id}`)

    const onClickAction = (event) => {
        event.stopPropagation();
    }

    const onDeleteItem = async (item) => {
        await onDelete(item.id);
        setData(d => d.filter(e => e.id !== item.id));
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
                    dataSource={data}
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
};

ListPage.defaultProps = {
    icon: null,
    onDelete: null,
    showAddButton: true,
    showViewButton: true,
    showEditButton: true,
    showDeleteButton: true,
    showBackButton: false,
};

export default ListPage;
