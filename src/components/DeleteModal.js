import React from 'react';
import { shape, func, bool } from 'prop-types';
import { Modal } from 'antd';
import { WarningTwoTone } from '@ant-design/icons';

import './DeleteModal.scss';

const DeleteModal = ({
    data,
    isOpen,
    toggleOpen,
    onDelete
}) => {
    const onCancel = () => toggleOpen(false);

    const renderModalTitle = () => (
        <>
            <WarningTwoTone twoToneColor='#eb3117' />
            Delete Item
        </>
    )

    if (!data) {
        return null;
    }

    return (
        <Modal
            className='delete-modal'
            title={renderModalTitle()}
            visible={isOpen}
            okText='Confirm'
            onOk={onDelete}
            onCancel={onCancel}
        >
            <p>{`Are you sure you want to delete "${data.name}"?`}</p>
        </Modal>
    );
};

DeleteModal.propTypes = {
    data: shape({}).isRequired,
    isOpen: bool.isRequired,
    toggleOpen: func.isRequired,
    onDelete: func.isRequired,
};

export default DeleteModal;
