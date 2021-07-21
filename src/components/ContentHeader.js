import React from 'react';
import { Typography } from 'antd';

import './ContentHeader.scss';

const { Title } = Typography;

const ContentHeader = ({ name }) => {
    return (
        <div className='content-header'>
            <Title level={2}>{name}</Title>
        </div>
    );
};

export default ContentHeader;
