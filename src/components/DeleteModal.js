import React from 'react';
import { string, func, bool } from 'prop-types';
import { Modal } from 'antd';
import { WarningTwoTone } from '@ant-design/icons';

import './DeleteModal.scss';

const DeleteModal = ({
    name,
    isOpen,
    toggleItemToDelete,
    onDelete
}) => {
    const onOk = async () => {
        await onDelete();
        toggleItemToDelete(null);
    }

    const onCancel = () => toggleItemToDelete(null);

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
            open={isOpen}
            okText='Confirm'
            onOk={onOk}
            onCancel={onCancel}
        >
            <p>Are you sure you want to <b>permanently delete</b> {`'${name}'?`}</p>
            <b>{`Note that deletion is irreversible and all other records (samples, sample files) that are connected to '${name}' will also be deleted!`}</b>
        </Modal>
    );
};

DeleteModal.propTypes = {
    name: string.isRequired,
    isOpen: bool.isRequired,
    toggleItemToDelete: func.isRequired,
    onDelete: func.isRequired,
};

export default DeleteModal;
