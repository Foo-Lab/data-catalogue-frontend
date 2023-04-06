import React, { useEffect, useState } from 'react';
import { string, element, instanceOf, func, bool } from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'antd';

import PageHeader from '../PageHeader';

import { checkIsDate, formatDate } from '../../utilities';

import './EditPage.scss';
import { useDataReducer } from '../../hooks';
import ErrorAlert from '../ErrorAlert';

const EditPage = ({
    name,
    icon,
    fields,
    getData,
    onEdit,
    showBackButton,
}) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [submitError, setSubmitError] = useState(null);
    const [pageData, dispatchPageData] = useDataReducer();

    useEffect(() => {
        const fetchData = async () => {
            const { result } = await getData(id);
            Object.keys(result).forEach(key => {
                const field = result[key];
                if (checkIsDate(field)) {
                    result[key] = formatDate(field, false);
                }
            });
            dispatchPageData({ type: "SET_DATA", value: result });
        };

        fetchData().catch(error => {
            console.error(error);
            dispatchPageData({ type: "ERROR", value: error });
        });
    }, [id]);

    const onFinish = async (values) => {
        setSubmitError(null);
        try {
            // console.log(values);
            await onEdit(id, values);
            navigate(-1, { relative: 'route' });
        } catch (error) {
            // console.log('e', error)
            const errorMessage = error.message ? error.message : error;
            setSubmitError(`${errorMessage}. ${errorMessage === 'Validation error' ? 'Check if the entered ID or name already exists' : ''}`);
        }
    }

    const onCancel = () => navigate(-1, { relative: 'route' });

    const renderForm = () => (
        <Form
            name={name}
            initialValues={pageData.value}
            onFinish={onFinish}
            scrollToFirstError
        >
            {fields.map(f =>
                <Form.Item
                    key={f.name}
                    label={f.label}
                    name={f.name}
                    rules={[
                        {
                            required: f.required,
                            message: `Please input your ${f.name !== 'confirmPassword' ? f.label : 'New Password'}!`
                        },
                        ...(f.rules ? f.rules : [])
                    ]}
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
            {(submitError?.message !== undefined || submitError) && <ErrorAlert message={submitError} />}
            <PageHeader
                name={name}
                action='edit'
                icon={icon}
                showBackButton={showBackButton}
            />
            <div className='page-content'>
                {pageData.ok
                    ? renderForm()
                    : <p>{`${pageData.errorMessage}`}</p>
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
};

EditPage.defaultProps = {
    icon: null,
    showBackButton: true,
};

export default EditPage;
