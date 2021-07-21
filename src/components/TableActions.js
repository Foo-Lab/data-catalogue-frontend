import React from 'react';
import { Link } from 'react-router-dom';
import { Tooltip } from 'antd';
import {
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
} from '@ant-design/icons';

import './TableActions.scss';

const TableActions = ({ id }) => {
    return (
        <div className='table-actions'>
            <Link to={`/view/${id}`}>
                <Tooltip title='View'>
                    <EyeOutlined />
                </Tooltip>
            </Link>
            <Link to={`/edit/${id}`}>
                <Tooltip title='Edit'>
                    <EditOutlined />
                </Tooltip>
            </Link>
            <Link to={`/delete/${id}`}>
                <Tooltip title='Delete'>
                    <DeleteOutlined />
                </Tooltip>
            </Link>
        </div>
    );
};

export default TableActions;
