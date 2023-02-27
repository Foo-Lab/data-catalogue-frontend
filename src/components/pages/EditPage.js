import React, { useEffect, useState } from 'react';
import { string, element, instanceOf, func, bool } from 'prop-types';
import { useHistory, useParams } from 'react-router-dom';
import { Form, Button } from 'antd';

import PageHeader from '../PageHeader';

import { checkIsDate, formatDate } from '../../utilities';

import './EditPage.scss';
import { useDataReducer } from '../../hooks';

const EditPage = ({
    name,
    icon,
    fields,
    getData,
    onEdit,
    showBackButton,
    isProfilePage
}) => {
    console.log(`Different edit page for profile: ${isProfilePage}`);
    const history = useHistory();
    const { id } = useParams();
    const [submitError, setSubmitError] = useState(null);
    const [data, dataDispatch] = useDataReducer();

    useEffect(() => {
        const fetchData = async () => {
            const { result } = await getData(id);
            Object.keys(result).forEach(key => {
                const field = result[key];
                if (checkIsDate(field)) {
                    result[key] = formatDate(field, false);
                }
            });
            dataDispatch({ type: "SET_DATA", value: result });
        };

        fetchData().catch(error => {
            console.error(error);
            dataDispatch({ type: "ERROR", value: error });
        });
    }, [id]);

    const onFinish = async (values) => {
        try {
            console.log(values);
            await onEdit(id, values);
            history.goBack();
        } catch (error) {
            console.error(error);
            setSubmitError(error);
        }
    }

    const onCancel = () => history.goBack();

    const renderForm = () => (
        <Form
            name={name}
            labelAlign='left'
            labelCol={{ span: 6, offset: 1 }}
            wrapperCol={{ span: 19 }}
            initialValues={data.value}
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
                        }
                    },
                    ]}
                    // validateStatus={f.name === 'currentPassword' && submitError ? 'error' : null}
                    help={f.name === 'currentPassword' && submitError ? submitError : null}
                    valuePropName={f.name === 'isAdmin' ? "checked" : "value"}
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
        <div className='edit-page'>
            <PageHeader
                name={name}
                action='edit'
                icon={icon}
                showBackButton={showBackButton}
            />
            <div className='page-content'>
                {data.ok
                    ? renderForm()
                    : <p>{`${data.errorMessage}`}</p>
                }
            </div>
        </div>
    );
};

EditPage.propTypes = {
    name: string.isRequired,
    icon: element,
    fields: instanceOf(Array).isRequired,
    getData: func.isRequired,
    onEdit: func.isRequired,
    showBackButton: bool,
    isProfilePage: bool,
};

EditPage.defaultProps = {
    icon: null,
    showBackButton: true,
    isProfilePage: false,
};

export default EditPage;
