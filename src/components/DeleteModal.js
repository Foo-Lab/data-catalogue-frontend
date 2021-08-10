import React from 'react';
import { string, func, bool } from 'prop-types';
import { Modal } from 'antd';
import { WarningTwoTone } from '@ant-design/icons';

import './DeleteModal.scss';

const DeleteModal = ({
    name,
    isOpen,
    toggleOpen,
    onDelete
}) => {
    const onOk = async () => {
        await onDelete();
        toggleOpen(false);
    }

    const onCancel = () => toggleOpen(false);

    const renderModalTitle = () => (
        <>
            <WarningTwoTone twoToneColor='#eb3117' />
            Delete Item
        </>
    )

    if (!name) {
        return null;
    }

    return (
        <Modal
            className='delete-modal'
            title={renderModalTitle()}
            visible={isOpen}
            okText='Confirm'
            onOk={onOk}
            onCancel={onCancel}
        >
            <p>{`Are you sure you want to delete '${name}'?`}</p>
        </Modal>
    );
};

DeleteModal.propTypes = {
    name: string.isRequired,
    isOpen: bool.isRequired,
    toggleOpen: func.isRequired,
    onDelete: func.isRequired,
};

export default DeleteModal;
