import { AccountGroupViewData } from '@core/account-group';
import { generateId } from '@core/helpers';
import { AccountGroupChannel } from '@core/ipc-channels';
import { AccountFormData, accountPrefix } from '@core/models/account';
import { Button, Modal } from 'antd';
import React from 'react';
import { useForm } from 'react-hook-form';

export interface AccountFormValues {
    name: string;
    email: string;
    password: string;
    loginProxy: string;
}
interface Props {
    isOpen: boolean;
    setOpen: (value: boolean) => void;
    selectedAccountGroup: AccountGroupViewData;
}

const AddAccountModal: React.FunctionComponent<Props> = (props) => {
    const { isOpen, setOpen, selectedAccountGroup } = props;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AccountFormValues>({ defaultValues: { password: '', email: '' } });

    const onAddAccount = (account: AccountFormValues) => {
        const accountData: AccountFormData = { ...account, id: generateId(accountPrefix) };

        window.ElectronBridge.send(AccountGroupChannel.addAccountToGroup, selectedAccountGroup.id, [accountData]);
        setOpen(false);
    };

    return (
        <div>
            <Modal title={'New Account'} visible={isOpen} onCancel={() => setOpen(false)} footer={null} destroyOnClose>
                <form
                    onSubmit={handleSubmit((data) => {
                        console.log(data);
                        onAddAccount(data);
                    })}
                >
                    <div className="form-control">
                        <div>
                            <label>
                                Account Name
                                <input className={errors.name && 'input--error'} {...register('name', { required: true })} />
                            </label>
                        </div>
                        <div>
                            <label>
                                Email
                                <input className={errors.email && 'input--error'} {...register('email', { required: true, disabled: true })} />
                            </label>
                        </div>
                        <div>
                            <label>
                                Password
                                <input
                                    type="password"
                                    className={errors.password && 'input--error'}
                                    {...register('password', { required: true, disabled: true })}
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                Login Proxy
                                <input type="number" className={errors.loginProxy && 'input--error'} {...register('loginProxy')} />
                            </label>
                        </div>
                        <div>
                            <Button htmlType="submit"> Create Account </Button>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default AddAccountModal;
