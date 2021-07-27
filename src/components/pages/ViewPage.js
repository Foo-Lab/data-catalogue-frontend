import React, { useState, useEffect } from 'react';
import { string, element, func, bool } from 'prop-types';
import { Link, useParams } from 'react-router-dom';
import { Descriptions, Tooltip, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

import PageHeader from '../PageHeader';
import DeleteModal from '../DeleteModal';

import './ViewPage.scss';

const { Item } = Descriptions;

const ViewPage = ({
    name,
    icon,
    baseUrl,
    getData,
    onDelete,
    showEditButton,
    showDeleteButton,
    showBackButton,
}) => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        setData(getData());
    }, []);

    return (
        <div className='view-page'>
            <PageHeader
                name={name}
                action='view'
                icon={icon}
                backUrl={showBackButton ? baseUrl : null}
            >
                <>
                    {showEditButton &&
                        <Link to={`${baseUrl}/edit/${id}`}>
                            <Tooltip title='Edit'>
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
                <Descriptions
                    column={1}
                    bordered
                >
                    {data && Object.keys(data).map(key => {
                        const label = key.replace('_', ' ')
                        return (
                            <Item
                                key={label}
                                className='view-item'
                                label={label}
                                labelStyle={{ textTransform: 'capitalize' }}
                            >
                                {data[key]}
                            </Item>
                        );
                    })}
                </Descriptions>
                <DeleteModal
                    data={data}
                    isOpen={isModalOpen}
                    toggleOpen={setModalOpen}
                    onDelete={() => onDelete(data)}
                />
            </div>
        </div>
    );
};

ViewPage.propTypes = {
    name: string.isRequired,
    icon: element,
    baseUrl: string.isRequired,
    getData: func.isRequired,
    onDelete: func,
    showEditButton: bool,
    showDeleteButton: bool,
    showBackButton: bool,
};

ViewPage.defaultProps = {
    icon: null,
    onDelete: null,
    showEditButton: true,
    showDeleteButton: true,
    showBackButton: true,
};

export default ViewPage;
