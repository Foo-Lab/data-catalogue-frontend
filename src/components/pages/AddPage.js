import React, { useState } from 'react';
import { string, element, instanceOf, func, bool } from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'antd';

import PageHeader from '../PageHeader';

import './AddPage.scss';
import ErrorAlert from '../ErrorAlert';
import { useDefaultValue, usePrivateAxios } from '../../hooks';

const AddPage = ({
    name,
    icon,
    fields,
    onAdd,
    showBackButton,
}) => {
    usePrivateAxios();
    const { id } = useParams(); // only present for adding SampleFiles
    const navigate = useNavigate();
    const [submitError, setSubmitError] = useState(null);
    const onFinish = async (values) => {
        setSubmitError(null);
        try {
            console.log('values', values)
            await onAdd(values, id);
            navigate(-1, { relative: 'route' });
        } catch (error) {
            // console.log('e', error)
            const errorMessage = error.message ? error.message : error;
            setSubmitError(`${errorMessage}. ${errorMessage === 'Validation error' ? 'Check if the entered ID or name already exists' : ''}`);
        }
    }

    const onCancel = () => navigate(-1, { relative: 'route' });

    // const renderForm = () => (

    // );

    return (
        <div className='add-page'>
            {submitError && <ErrorAlert message={submitError} />}
            <PageHeader
                name={name}
                action='add'
                icon={icon}
                showBackButton={showBackButton}
            />
            <div className='page-content'>
                <Form
                    name={name}
                    onFinish={onFinish}
                    scrollToFirstError
                >
                    {fields.map(f => <Form.Item
                        key={f.name}
                        label={f.label}
                        name={f.name}
                        initialValue={useDefaultValue(f.name) ?? f.initialValue}
                        rules={[
                            {
                                required: f.required,
                                message: `Please input your ${f.label}!`
                            },
                            ...(f.rules ? f.rules : [])
                        ]}

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
