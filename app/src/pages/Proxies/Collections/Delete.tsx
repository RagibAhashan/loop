import { DeleteFilled } from '@ant-design/icons';
import { ProxySetChannel } from '@core/IpcChannels';
import { IProxySet } from '@core/ProxySet';
import { Form, Modal, Select, Tooltip } from 'antd';
import React, { useState } from 'react';

interface Props {
    proxySets: IProxySet[];
}
const CollectionFormDelete: React.FunctionComponent<Props> = (props) => {
    const { proxySets } = props;
    const [form] = Form.useForm();

    const [visibleDelete, setVisibleDelete] = useState(false);

    const handleDelete = (values: { proxies: string[] }) => {
        console.log('delete !', values);
        const arraySetToDelete = values.proxies;
        arraySetToDelete.forEach((name) => {
            window.ElectronBridge.send(ProxySetChannel.removeProxySet, name);
        });
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
                        <Select mode="multiple" placeholder="Choose sets to remove" style={{ width: '100%' }}>
                            {proxySets.map((proxySet) => (
                                <Select.Option key={proxySet.name} value={proxySet.name}>
                                    {proxySet.name}
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
