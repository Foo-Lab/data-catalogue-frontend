import React, { useEffect } from 'react';
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
}) => {
    const history = useHistory();
    const { id } = useParams();
    const [data, dataDispatch] = useDataReducer();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { result } = await getData(id);
                Object.keys(result).forEach(key => {
                    const field = result[key];
                    if (checkIsDate(field)) {
                        result[key] = formatDate(field, false);
                    }
                });
                dataDispatch({ type: "SET_DATA", value: result });
            } catch (error) {
                console.error(error);
                dataDispatch({ type: "ERROR", value: error });
            }
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
            labelCol={{ span: 3, offset: 1 }}
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
};

EditPage.defaultProps = {
    icon: null,
    showBackButton: true,
};

export default EditPage;
