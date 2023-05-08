import React from 'react';
import { Empty } from 'antd';
// import { StopOutlined } from '@ant-design/icons';

const InvalidPage = () => (
    <Empty
        imageStyle={{ height: 140, padding: 20 }}
        description={<span>404 Page Invalid</span>} />
)

export default InvalidPage