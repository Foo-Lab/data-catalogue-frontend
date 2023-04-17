import React from 'react';
import { arrayOf, shape, number, string } from 'prop-types';
import { Select } from 'antd';

const { Option } = Select;

const AddEditSelect = ({ options, field }) => (
    <Select
        defaultActiveFirstOption
        optionFilterProp='title'
        optionLabelProp='title'
        style={{ textAlign: 'left' }}
        placeholder={`Select ${field}`}
        showSearch
    >
        {options.map(d => (
            <Option
                key={d.id}
                value={d.id}
                title={d.name}
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
