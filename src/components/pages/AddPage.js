import React from 'react';
import { string, element, instanceOf, func, bool } from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'antd';

import PageHeader from '../PageHeader';

import './AddPage.scss';

const AddPage = ({
    name,
    icon,
    fields,
    onAdd,
    showBackButton,
}) => {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        await onAdd(values);
        navigate(-1);
    }

    const onCancel = () => navigate(-1);

    const renderForm = () => (
        <Form
            name={name}
            labelAlign='left'
            labelCol={{ span: 3, offset: 1 }}
            wrapperCol={{ span: 19 }}
            onFinish={onFinish}
            scrollToFirstError
        >
            {fields.map(f =>
                <Form.Item
                    key={f.name}
                    label={f.label}
                    name={f.name}
                    rules={[{
                        required: f.required,
                        message: `Please input your ${f.label}!`
                    }]}
                >
                    {f.input}
                </Form.Item>
            )}

            <Form.Item
                className='form-control-buttons'
                wrapperCol={{ span: 4, offset: 10 }}
            >
                <Button type='primary' htmlType='submit'>
                    Submit
                </Button>
                <Button type='default' onClick={onCancel}>
                    Cancel
                </Button>
            </Form.Item>
        </Form>
    );

    return (
        <div className='add-page'>
            <PageHeader
                name={name}
                action='add'
                icon={icon}
                showBackButton={showBackButton}
            />
            <div className='page-content'>
                {renderForm()}
            </div>
        </div>
    );
};

AddPage.propTypes = {
    name: string.isRequired,
    icon: element,
    fields: instanceOf(Array).isRequired,
    onAdd: func.isRequired,
    showBackButton: bool,
};

AddPage.defaultProps = {
    icon: null,
    showBackButton: true,
};

export default AddPage;
