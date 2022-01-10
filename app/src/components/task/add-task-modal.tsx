import AccountDropdown from '@components/base/account-dropdown';
import ProfileSelectDropdown from '@components/base/profile-select-dropdown';
import ProxySelectDropdown from '@components/base/proxy-select-dropdown';
import { AccountGroupViewData } from '@core/account-group';
import { ProfileGroupViewData } from '@core/profilegroup';
import { ProxySetViewData } from '@core/proxyset';
import { Button, Modal } from 'antd';
import React from 'react';
import { useForm } from 'react-hook-form';

export type GroupEntityID = `${string}:${string}`;

export type TaskFormValues = {
    productIdentifier: string;
    profile: GroupEntityID; // groupId:profileId
    account: GroupEntityID;
    proxySetId: string;
    retryDelay: number;
    productQuantity: number;
    quantity: number;
};

export interface Props {
    proxySets: ProxySetViewData[];
    profileGroups: ProfileGroupViewData[];
    accountGroups: AccountGroupViewData[];
    isOpen: boolean;
    setOpen: (value: boolean) => void;
    onAdd: (data: TaskFormValues, quantity: number) => void;
}

export const NewTaskModal: React.FunctionComponent<Props> = (props) => {
    const { isOpen, setOpen, onAdd, profileGroups, proxySets, accountGroups } = props;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TaskFormValues>();

    return (
        <Modal visible={isOpen} onCancel={() => setOpen(false)} width={'700px'} footer={null}>
            <form
                onSubmit={handleSubmit((data) => {
                    console.log(data);
                    onAdd(data, data.quantity);
                })}
            >
                <div className="form-control">
                    <div>
                        <ProfileSelectDropdown
                            error={errors.profile}
                            defaultValue={''}
                            profileGroups={profileGroups}
                            register={register('profile', { required: true })}
                        />
                    </div>

                    <div>
                        <ProxySelectDropdown error={errors.proxySetId} defaultValue={''} proxySets={proxySets} register={register('proxySetId')} />
                    </div>

                    <div>
                        <AccountDropdown error={errors.account} defaultValue={''} accountGroups={accountGroups} register={register('account')} />
                    </div>
                    <div>
                        <label>
                            SKU
                            <input className={errors.productIdentifier && 'input--error'} {...register('productIdentifier', { required: true })} />
                        </label>
                    </div>
                    <div>
                        <label>
                            Retry Delay
                            <input
                                type="number"
                                className={errors.retryDelay && 'input--error'}
                                {...register('retryDelay', { required: true, valueAsNumber: true })}
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Product Quantity
                            <input
                                type="number"
                                className={errors.productQuantity && 'input--error'}
                                {...register('productQuantity', { required: true, valueAsNumber: true })}
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Task Quantity
                            <input
                                type="number"
                                className={errors.quantity && 'input--error'}
                                {...register('quantity', { required: true, valueAsNumber: true })}
                            />
                        </label>
                    </div>
                    <div>
                        <Button htmlType="submit"> Create Task</Button>
                    </div>
                </div>
            </form>
        </Modal>
    );
};
