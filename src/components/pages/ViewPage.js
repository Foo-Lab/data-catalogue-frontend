import React, { useState, useEffect } from 'react';
import { string, element, instanceOf, func, bool } from 'prop-types';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Descriptions, Tooltip, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

import PageHeader from '../PageHeader';
import DeleteModal from '../DeleteModal';

import {
    checkIsDate,
    checkIsDateTime,
    formatDate,
    formatDateTime,
    getNestedObject,
} from '../../utilities';

import './ViewPage.scss';

const { Item } = Descriptions;

const ViewPage = ({
    name,
    icon,
    baseUrl,
    rows,
    getData,
    onDelete,
    showEditButton,
    showDeleteButton,
    showBackButton,
}) => {
    const history = useHistory();
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const { result } = await getData(id);

            Object.keys(result).forEach(key => {
                const field = result[key];
                if (checkIsDate(field)) {
                    result[key] = formatDate(field);
                } else if (checkIsDateTime(field)) {
                    result[key] = formatDateTime(field);
                }
            });
            setData(result);
        }

        fetchData();
    }, [id]);

    const onDeleteItem = async (item) => {
        await onDelete(item.id);
        history.push(baseUrl);
    }

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
                    labelStyle={{ width: '20%' }}
                    bordered
                >
                    {data && rows.map(row => (
                        <Item
                            key={
                                Array.isArray(row.key)
                                    ? row.key.join('.')
                                    : row.key
                            }
                            className='view-item'
                            label={row.title}
                            labelStyle={{ textTransform: 'capitalize' }}
                        >
                            {
                                Array.isArray(row.key)
                                    ? getNestedObject(data, row.key)
                                    : data[row.key]
                            }
                        </Item>
                    ))}
                </Descriptions>
                {data?.name &&
                    <DeleteModal
                        name={data.name}
                        isOpen={isModalOpen}
                        toggleOpen={setModalOpen}
                        onDelete={() => onDeleteItem(data)}
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
    rows: instanceOf(Array).isRequired,
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
