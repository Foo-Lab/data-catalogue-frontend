import React from 'react';
import { arrayOf, shape, number, string } from 'prop-types';
import { Select } from 'antd';

const { Option } = Select;

// TODO defaultActiveFirstOption not working
const AddEditSelect = ({ options, field }) => (
    <Select
        optionFilterProp="children"
        filterOption={(input, option) =>
            (option?.children ?? '').toLowerCase().includes(input)
        }
        filterSort={(optionA, optionB) =>
            (optionA?.children ?? '').toLowerCase().localeCompare((optionB?.children ?? '').toLowerCase())
        }
        style={{ textAlign: 'left' }}
        placeholder={`Select ${field}`}
        showSearch
    >
        {/* {console.log('options:', options)} */}
        {options.map(d => (
            <Option
                key={d.id}
                value={d.id}
                style={{ textAlign: 'left' }}
            >
                {d.name}
            </Option>
        ))}
    </Select>
);

AddEditSelect.propTypes = {
    options: arrayOf(
        shape({
            id: number.isRequired,
            name: string.isRequired,
        })
    ).isRequired,
    field: string.isRequired,
};

export default AddEditSelect;
