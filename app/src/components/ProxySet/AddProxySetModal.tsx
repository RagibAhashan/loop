import { ProxySetChannel } from '@core/IpcChannels';
import { Form, Input, Modal } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React from 'react';

interface Props {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddProxySetModal: React.FunctionComponent<Props> = (props) => {
    const { showModal, setShowModal } = props;
    const [form] = useForm();

    const onAddSet = (values: { name: string }) => {
        console.log('add set', values);
        window.ElectronBridge.send(ProxySetChannel.addProxySet, values.name);
    };

    return (
        <div>
            <Modal
                visible={showModal}
                bodyStyle={{ height: '50px', paddingTop: 5 }}
                title="Create a new set"
                okText="Create"
                cancelText="Cancel"
                onCancel={() => setShowModal(false)}
                onOk={() => {
                    form.validateFields()
                        .then((values) => {
                            form.resetFields();
                            onAddSet(values);
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

export default AddProxySetModal;
