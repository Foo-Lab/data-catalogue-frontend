import React from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Row, Space } from 'antd';
import { func, instanceOf } from 'prop-types';

const FilterDropdown = ({ setSelectedKeys, selectedKeys, clearFilters, confirm, close }) => (
    <Space
        style={{
            padding: 6,
            display: 'block'
        }}
        onKeyDown={(e) => e.stopPropagation()}
    >
        <Row>
            <Input
                value={selectedKeys[0]}
                onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                onPressEnter={() => confirm()}
                autoFocus
            />
        </Row>
        <Row>
            <Space>
                <Button
                    type="primary"
                    onClick={() => confirm()}
                    icon={<SearchOutlined />}
                >
                    Search
                </Button>
                <Button
                    onClick={() => clearFilters() || confirm()}
                >
                    Clear
                </Button>
                <Button
                    type="link"
                    onClick={() => close()}
                >
                    Close
                </Button>
            </Space>
        </Row>
    </Space>
);

FilterDropdown.propTypes = {
    setSelectedKeys: func.isRequired,
    selectedKeys: instanceOf(Array).isRequired,
    confirm: func.isRequired,
    clearFilters: func.isRequired,
    close: func.isRequired
};

export default FilterDropdown;