import React from 'react';
import { string } from 'prop-types';
import { Alert } from 'antd';

import './ErrorAlert.scss';

const ErrorAlert = ({ message }) =>
    <Alert
        className='error-alert'
        message={message}
        type="error"
        showIcon
    />

ErrorAlert.propTypes = {
    message: string
};

ErrorAlert.defaultProps = {
    message: 'An error has occurred'
};

export default ErrorAlert;
