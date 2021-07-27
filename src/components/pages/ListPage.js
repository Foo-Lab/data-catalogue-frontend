import React, { useState, useEffect }from 'react';
import { string, element, shape, bool, func } from 'prop-types';
import { Link } from 'react-router-dom';
import { Table, Tooltip, Button } from 'antd';
import {
    PlusOutlined,
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
} from '@ant-design/icons';

import PageHeader from '../PageHeader';
import DeleteModal from '../DeleteModal';

import './ListPage.scss';

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
    const [data, setData] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    useEffect(() => {
        setData(getData());
    }, []);

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    const onShowSizeChange = (current, pageSize) => {
        console.log(current, pageSize);
    };

    const renderListActions = (id, record) => (
        <div className='list-actions'>
            {showViewButton &&
                <Link to={`${baseUrl}/view/${id}`}>
                    <Tooltip title='View'>
                        <EyeOutlined />
                    </Tooltip>
                </Link>
            }
            {showEditButton &&
                <Link to={`${baseUrl}/edit/${id}`}>
                    <Tooltip title='Edit'>
                        <EditOutlined />
                    </Tooltip>
                </Link>
            }
            {showDeleteButton &&
                <Button
                    type='link'
                    onClick={() => {
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

    return (
        <div className='list-page'>
            <PageHeader
                name={name}
                icon={icon}
                backUrl={showBackButton ? baseUrl : null}
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

            <div className='page-content'>
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
                    pagination={{
                        showSizeChanger: true,
                        onShowSizeChange,
                        showTotal: (total, range) => `${range[0]} - ${range[1]} of ${total} records`,
                    }}
                    onChange={onChange}
                />
                <DeleteModal
                    data={itemToDelete}
                    isOpen={isModalOpen}
                    toggleOpen={setModalOpen}
                    onDelete={() => onDelete(itemToDelete)}
                />
            </div>
        </div>
    );
};

ListPage.propTypes = {
    name: string.isRequired,
    icon: element,
    baseUrl: string.isRequired,
    columns: shape([]).isRequired,
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
