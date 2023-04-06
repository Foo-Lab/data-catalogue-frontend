import React from 'react';
import { arrayOf, shape, number, string } from 'prop-types';
import { Select } from 'antd';

const { Option } = Select;

const AddEditSelect = ({ options, field }) => (
    <Select
        defaultActiveFirstOption
        optionFilterProp='label'
        filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input?.toLowerCase())
        }
        filterSort={(optionA, optionB) =>
            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
        }
        style={{ textAlign: 'left' }}
        placeholder={`Select ${field}`}
        showSearch
    >
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
)

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
