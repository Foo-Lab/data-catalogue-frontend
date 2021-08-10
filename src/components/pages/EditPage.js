import React, { useEffect, useState } from 'react';
import { string, element, instanceOf, func, bool } from 'prop-types';
import { useHistory, useParams } from 'react-router-dom';
import { Form, Button } from 'antd';

import PageHeader from '../PageHeader';

import { checkIsDate, formatDate } from '../../utilities';

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
    const { id } = useParams();
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const result = await getData(id);

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
        history.push(baseUrl);
    }

    const onCancel = () => history.push(baseUrl);

    const renderForm = () => (
        <Form
            name={name}
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
                    required={f.required}
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
