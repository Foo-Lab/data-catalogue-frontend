import React from 'react';
import { arrayOf, shape, number, string } from 'prop-types';
import { Select } from 'antd';

const { Option } = Select;

// TODO defaultActiveFirstOption not working
const AddEditSelect = ({ options }) => (
    <Select
        defaultActiveFirstOption
        style={{ textAlign: 'left' }}
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
);

AddEditSelect.propTypes = {
    options: arrayOf(
        shape({
            id: number.isRequired,
            name: string.isRequired,
        })
    ).isRequired,
};

export default AddEditSelect;
