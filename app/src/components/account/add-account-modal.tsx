import { AccountGroupViewData } from '@core/account-group';
import { Modal } from 'antd';
import React from 'react';

interface Props {
    isOpen: boolean;
    setOpen: (value: boolean) => void;
    selectedAccountGroup: AccountGroupViewData;
}

const AddAccountModal: React.FunctionComponent<Props> = (props) => {
    const { isOpen, setOpen, selectedAccountGroup } = props;

    const onAddAccount = (account: any) => {
        setOpen(false);
    };

    return (
        <div>
            <Modal title={'New Account'} visible={isOpen} onCancel={() => setOpen(false)} footer={null} destroyOnClose>
                new account
            </Modal>
        </div>
    );
};

export default AddAccountModal;
