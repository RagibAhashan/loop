import { PlusOutlined } from '@ant-design/icons';
import { ProxySetChannel } from '@core/IpcChannels';
import { Button, Form, Input, Modal, Tooltip } from 'antd';
import React, { useState } from 'react';

interface Props {
    isButton: boolean;
}

const CollectionFormCreate: React.FunctionComponent<Props> = (props) => {
    const [form] = Form.useForm();

    const { isButton } = props; // this is just temporary styling, when no proxy set are created show a button, otherwise show a + sign, but to be changed

    const [visibleCreate, setVisibleCreate] = useState(false);

    const onCreateSet = (values: { name: string }) => {
        const name = values.name;
        window.ElectronBridge.send(ProxySetChannel.addProxySet, name);
        setVisibleCreate(false);
    };

    return (
        <div>
            {isButton ? (
                <Button
                    icon={<PlusOutlined style={{ color: 'green' }} />}
                    style={{ textAlign: 'center', float: 'left', marginTop: 12, marginLeft: '40px', paddingLeft: '35px', paddingRight: '35px' }}
                    type={'primary'}
                    onClick={() => {
                        setVisibleCreate(true);
                    }}
                >
                    Add set
                </Button>
            ) : (
                <Tooltip placement="top" title={'Add sets'}>
                    <PlusOutlined
                        style={{ color: 'green', fontSize: 30 }}
                        onClick={() => {
                            setVisibleCreate(true);
                        }}
                    />
                </Tooltip>
            )}
            <Modal
                visible={visibleCreate}
                bodyStyle={{ height: '50px', paddingTop: 5 }}
                title="Create a new set"
                okText="Create"
                cancelText="Cancel"
                onCancel={() => setVisibleCreate(false)}
                onOk={() => {
                    form.validateFields()
                        .then((values) => {
                            form.resetFields();
                            onCreateSet(values);
                        })
                        .catch((info) => {});
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
                    <Form.Item name="name" rules={[{ required: true, message: 'Please input the name of the set to add!' }]}>
                        <Input placeholder="Input set same" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CollectionFormCreate;
