import { DeleteFilled } from '@ant-design/icons';
import { Form, Modal, Select, Tooltip } from 'antd';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProxySet, getProxySets } from '../../../services/Proxy/ProxyService';

const CollectionFormDelete = (props: any) => {
    const [form] = Form.useForm();

    const [visibleDelete, setVisibleDelete] = useState(false);

    const proxies = useSelector(getProxySets);
    const dispatch = useDispatch();

    const handleDelete = (values: { proxies: string[] }) => {
        console.log('delete !', values);
        const arraySetToDelete = values.proxies;
        arraySetToDelete.forEach((name) => dispatch(deleteProxySet({ name })));
    };
    return (
        <div>
            <Tooltip placement="top" title={'Remove sets'}>
                <DeleteFilled
                    style={{ color: 'red', fontSize: 30, marginLeft: 15 }}
                    onClick={() => {
                        setVisibleDelete(true);
                    }}
                />
            </Tooltip>
            <Modal
                visible={visibleDelete}
                title="Remove an existing set"
                okText="Remove"
                cancelText="Cancel"
                onCancel={() => setVisibleDelete(false)}
                // footer={[<Button type="primary" key="1"> Remove </Button>]}
                onOk={() => {
                    form.validateFields()
                        .then((values) => {
                            form.resetFields();
                            handleDelete(values);
                        })
                        .catch((info) => {
                            console.log('Validate Failed:', info);
                        });
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="form_in_modal"
                    initialValues={{
                        modifier: 'public',
                    }}
                >
                    <Form.Item name="proxies" label="Sets" rules={[{ required: true, message: 'Please choose a set to delete!' }]}>
                        <Select
                            mode="multiple"
                            placeholder="Choose sets to remove"
                            // value={props.deleteSelection}
                            // onChange={props.handleChange}
                            style={{ width: '100%' }}
                        >
                            {Object.keys(proxies).map((proxySetName) => (
                                <Select.Option key={proxySetName} value={proxySetName}>
                                    {proxySetName}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CollectionFormDelete;
