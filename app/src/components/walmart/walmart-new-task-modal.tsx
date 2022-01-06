import { NewTaskModalProps, TaskFormValues } from '@components/actions/add-task-action';
import ProfileSelectDropdown from '@components/base/profile-select-dropdown';
import { Button, Form, Input, InputNumber, Select } from 'antd';
import React, { useState } from 'react';

export interface WalmartFormValues extends TaskFormValues {
    productQuantity: number;
    productSKU: string;
    offerId: string;
}

const WalmartNewTaskModal: React.FunctionComponent<NewTaskModalProps> = (props) => {
    const { isOpen, setOpen, onAdd, profileGroups, proxySets } = props;

    const [quantity, setQuantity] = useState(1);

    const initialValues: WalmartFormValues = {
        offerId: '',
        productQuantity: 1,
        productSKU: '',
        profileName: '',
        retryDelay: 3000,
        proxySetName: '',
        quantity: 1,
    };
    const [form] = Form.useForm<WalmartFormValues>();

    const onFinishForm = async (data: any) => {
        console.log('adding task data walmart', data);
        // onAdd(data, quantity);
    };

    // let proxiesOptions: any = proxySets.map((proxySet) => {
    //     return { label: proxySet.name, value: proxySet.name };
    // });

    // proxiesOptions = [...proxiesOptions, { label: 'No Proxies', value: null }];
    // optionsProfiles = [...optionsProfiles, { label: 'No Profile', value: null }];

    const onSubmit = (data: WalmartFormValues) => {
        console.log('adding task data walmart', data);
        onAdd(data as WalmartFormValues, data.quantity);
    };

    return (
        <div style={{ padding: 24, backgroundColor: '#212427', borderRadius: '10px' }}>
            <Form form={form} onFinish={onFinishForm} validateMessages={{ default: '' }}>
                <Form.Item name="productSKU" rules={[{ required: true }]}>
                    <Input placeholder="Product SKU"></Input>
                </Form.Item>
                <Form.Item name="offerId" rules={[{ required: true }]}>
                    <Input placeholder="Offer ID"></Input>
                </Form.Item>
                <ProfileSelectDropdown profileGroups={profileGroups}></ProfileSelectDropdown>
                <Form.Item name="profileName" rules={[{ required: false }]}>
                    <Select placeholder="Profile" allowClear options={[{ value: null, label: 'Null' }]} />
                </Form.Item>
                <Form.Item name="proxySet" rules={[{ required: false }]}>
                    <Select style={{ width: '100%' }} placeholder="Proxy Set" allowClear options={[{ value: null, label: 'Null' }]} />
                </Form.Item>

                <Form.Item name="productQuantity" rules={[{ required: true }]}>
                    <InputNumber style={{ width: '100%' }} placeholder="Product Quantity" value={1} />
                </Form.Item>

                <Form.Item name="retryDelay" rules={[{ required: true }]}>
                    <InputNumber style={{ width: '100%' }} placeholder="Retry delay" />
                </Form.Item>
                <Form.Item rules={[{ required: true }]}>
                    <InputNumber style={{ width: '100%' }} value={quantity} placeholder="Task Quantity" onChange={(value) => setQuantity(value)} />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Create Task
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default WalmartNewTaskModal;
