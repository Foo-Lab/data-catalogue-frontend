import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Alert, Card, Form, Input, Button, Spin } from 'antd';
import {
    LoginOutlined,
    EyeTwoTone,
    EyeInvisibleOutlined,
} from '@ant-design/icons';

import PageHeader from '../components/PageHeader';

import { login, clearState, selectUserStatus } from '../store/userSlice';

import './Login.scss';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const pageProps = useRef({
        name: 'login',
        icon: <LoginOutlined />,
    });

    const { isFetching, isSuccess, isError, errorMessage } = useSelector(
        selectUserStatus
    );

    useEffect(() => {
        if (isSuccess) {
            dispatch(clearState());
            navigate('/');
        }
    }, [isSuccess]);

    const onFinish = async (values) => {
        dispatch(login(values))
    };

    return (
        <div className='login-page'>
            <PageHeader
                name={pageProps.current.name}
                icon={pageProps.current.icon}
            />
            <div className='page-content'>
                {isError &&
                    <Alert
                        className='login-alert'
                        type='error'
                        message={errorMessage}
                        showIcon
                        closable
                    />
                }
                <Card className='login-card'>
                    <Form
                        name='login'
                        layout='vertical'
                        requiredMark={false}
                        onFinish={onFinish}
                    >
                        <Form.Item
                            label='Username'
                            name='username'
                            rules={[{
                                required: true,
                                message: 'Please input your username!'
                            }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label='Password'
                            name='password'
                            rules={[{
                                required: true,
                                message: 'Please input your password!'
                            }]}
                        >
                            <Input.Password
                                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            />
                        </Form.Item>

                        <Form.Item className='form-control-buttons'>
                            <Button
                                type='primary'
                                htmlType='submit'
                                block
                                disabled={isFetching}
                            >
                                { isFetching ? <Spin size='small' /> : 'Login' }
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default Login;
