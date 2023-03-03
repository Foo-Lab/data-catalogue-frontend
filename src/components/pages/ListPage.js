import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { string, element, instanceOf, bool, func } from 'prop-types';
import { Link } from 'react-router-dom';
import { Tooltip, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import PageHeader from '../PageHeader';
import ListTable from './ListTable';

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
    allowClickRow,
}) => {
    const pageContent = useRef();

    const pageNum = useSelector(state => state.listPage.pageNum);

    useEffect(() => {
        pageContent.current.scrollTo({ top: 0, behavior: 'instant' });
    }, [pageNum]);

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
                <ListTable 
                    baseUrl={baseUrl}
                    columns={columns}
                    getData={getData}
                    onDelete={onDelete}
                    showViewButton={showViewButton}
                    showEditButton={showEditButton}
                    showDeleteButton={showDeleteButton}
                    allowClickRow={allowClickRow}
                />
                {/* {data.ok ?
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
                    : <Empty description={<span>{data.errorMessage}</span>} />

                }
            </div>
            {itemToDelete?.name &&
                <DeleteModal
                    name={itemToDelete.name}
                    isOpen={itemToDelete !== null}
                    toggleItemToDelete={setItemToDelete}
                    onDelete={() => onDeleteItem(itemToDelete)}
                />
            } */}
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
