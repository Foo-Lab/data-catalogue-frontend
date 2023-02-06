import React, { useEffect, useState } from 'react';
import { string, element, instanceOf, func, bool } from 'prop-types';
import { useHistory, useParams } from 'react-router-dom';
import { Form, Button, Checkbox } from 'antd';

import PageHeader from '../PageHeader';

import { checkIsDate, formatDate } from '../../utilities';

import './EditPage.scss'; // uses same scss as EditPage.js

const EditProfilePage = ({
    name,
    icon,
    fields,
    getData,
    onEdit,
    showBackButton,
}) => {
    console.log("Different edit page for profile");
    const history = useHistory();
    const { id } = useParams();
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const { result } = await getData(id);
            console.log(result);
            Object.keys(result).forEach(key => {
                const field = result[key];
                if (checkIsDate(field)) {
                    result[key] = formatDate(field, false);
                }
            });
            setData(result);
        }

        fetchData();
    }, [id]);

    const onFinish = async (values) => {
        await onEdit(id, values);
        history.goBack();
    }

    const onCancel = () => history.goBack();

    const renderForm = () => (
        <Form
            name={name}
            labelAlign='left'
            labelCol={{ span: 6, offset: 1 }}
            wrapperCol={{ span: 19 }}
            initialValues={{ ...data, password: '' }}
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
                        message: `Please input your ${f.name !== 'confirmPassword' ? f.label : 'New Password'}!`
                    },
                    {
                        validator: async (rule, value) => {
                            if (f.name === 'newPassword') {
                                if (value.length < 8) {
                                    return Promise.reject(new Error('Password must be at least 8 characters long.'));
                                }
                            }
                            if (f.name === 'confirmPassword') {
                                const newPassword = f.input.props.newpassref.current.props.value;
                                if (value !== newPassword) {
                                    console.log('value: ', value, 'newPassword: ', newPassword);
                                    return Promise.reject(new Error('Passwords do not match.'));
                                }
                            }
                            return Promise.resolve();
                        },
                    },
                    ]}
                >
                    {f.name === 'isAdmin' ? <Checkbox defaultChecked={data.isAdmin} /> : f.input}
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
        <div className='edit-page'>
            <PageHeader
                name={name}
                action='edit'
                icon={icon}
                showBackButton={showBackButton}
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

EditProfilePage.propTypes = {
    name: string.isRequired,
    icon: element,
    fields: instanceOf(Array).isRequired,
    getData: func.isRequired,
    onEdit: func.isRequired,
    showBackButton: bool,
};

EditProfilePage.defaultProps = {
    icon: null,
    showBackButton: true,
};

export default EditProfilePage;
