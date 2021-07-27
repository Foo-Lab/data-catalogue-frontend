import React, { useEffect, useState } from 'react';
import { string, element, shape, func, bool } from 'prop-types';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { Form, Button } from 'antd';

import PageHeader from '../PageHeader';

import './EditPage.scss';

const EditPage = ({
    name,
    icon,
    baseUrl,
    fields,
    getData,
    onEdit,
    showBackButton,
}) => {
    const history = useHistory();
    const [data, setData] = useState(null);

    useEffect(() => {
        const initialData = getData();
        Object.keys(initialData).forEach(key => {
            if (moment(initialData[key], 'DD-MM-YYYY', true).isValid()) {
                initialData[key] = moment(initialData[key], 'DD-MM-YYYY');
            }
        });
        setData(initialData);
    }, []);

    const onFinish = values => {
        onEdit(values);
    };

    const onCancel = () => {
        history.push(baseUrl);
    }

    const renderForm = () => (
        <Form
            name='basic'
            labelAlign='left'
            labelCol={{ span: 3, offset: 1 }}
            wrapperCol={{ span: 19 }}
            initialValues={data}
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
                wrapperCol={{span: 4, offset: 10}}
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
        <div className='edit-page'>
            <PageHeader
                name={name}
                action='edit'
                icon={icon}
                backUrl={showBackButton ? baseUrl : null}
            />
            <div className='page-content'>
                {data
                    ? renderForm()
                    : null
                }
            </div>
        </div>
    );
};

EditPage.propTypes = {
    name: string.isRequired,
    icon: element,
    baseUrl: string.isRequired,
    fields: shape([]).isRequired,
    getData: func.isRequired,
    onEdit: func.isRequired,
    showBackButton: bool,
};

EditPage.defaultProps = {
    icon: null,
    showBackButton: true,
};

export default EditPage;
