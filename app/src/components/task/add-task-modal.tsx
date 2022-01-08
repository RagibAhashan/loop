import ProfileSelectDropdown from '@components/base/profile-select-dropdown';
import ProxySelectDropdown from '@components/base/proxy-select-dropdown';
import { ProfileGroupViewData } from '@core/profilegroup';
import { ProxySetViewData } from '@core/proxyset';
import { Button, Modal } from 'antd';
import React from 'react';
import { useForm } from 'react-hook-form';

export type TaskFormValues = {
    productIdentifier: string;
    profileName: string;
    retryDelay: number;
    proxySetName: string;
    productQuantity: number;
    accountName: string;
    quantity: number;
};

export interface Props {
    proxySets: ProxySetViewData[];
    profileGroups: ProfileGroupViewData[];
    isOpen: boolean;
    setOpen: (value: boolean) => void;
    onAdd: (data: TaskFormValues, quantity: number) => void;
}

export const NewTaskModal: React.FunctionComponent<Props> = (props) => {
    const { isOpen, setOpen, onAdd, profileGroups, proxySets } = props;

    const { register, handleSubmit, watch } = useForm<TaskFormValues>();

    console.log(watch());

    const onFinishForm = async (data: any) => {
        console.log('adding task data walmart', data);
        // onAdd(data, quantity);
    };

    // let proxiesOptions: any = proxySets.map((proxySet) => {
    //     return { label: proxySet.name, value: proxySet.name };
    // });

    // proxiesOptions = [...proxiesOptions, { label: 'No Proxies', value: null }];
    // optionsProfiles = [...optionsProfiles, { label: 'No Profile', value: null }];

    const onFormFinish = (data: TaskFormValues) => {
        console.log('adding task data walmart', data);
        onAdd(data, data.quantity);
    };

    return (
        <Modal
            visible={isOpen}
            onCancel={() => setOpen(false)}
            width={'700px'}
            footer={
                <Button form="taskForm" type="primary" htmlType="submit">
                    Create Task
                </Button>
            }
        >
            <form>
                <div className={'task-form'}>
                    <ProfileSelectDropdown defaultValue={undefined} profileGroups={profileGroups} register={register} name="profileName" />
                    <ProxySelectDropdown defaultValue={undefined} proxySets={proxySets} register={register} name="proxySetName" />

                    <label>
                        Account
                        <input {...register('accountName')} />
                    </label>

                    <label>
                        SKU
                        <input {...register('productIdentifier')} />
                    </label>

                    <label>
                        Retry Delay
                        <input {...register('retryDelay')} />
                    </label>

                    <label>
                        Product Quantity
                        <input {...register('productQuantity')} />
                    </label>

                    <label>
                        Task Quantity
                        <input {...register('quantity')} />
                    </label>
                </div>
            </form>
        </Modal>
    );
};
