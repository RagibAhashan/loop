import { Form, Input, Modal} from 'antd';
import React from 'react';

const CollectionFormCreate = (props: any) => {
    const [form] = Form.useForm();
    return (
        <Modal
            // footer={null}
            visible={props.visible}
            bodyStyle={{ height: '50px', paddingTop: 5 }}
            title="Create a new set"
            okText="Create"
            cancelText="Cancel"
            onCancel={props.onCancel}
            onOk={() => {
                form.validateFields()
                    .then((values) => {
                        form.resetFields();
                        props.onCreate(values);
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
                <Form.Item name="name" rules={[{ required: true, message: 'Please input the name of the set to add!' }]}>
                    <Input placeholder="Input set same" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CollectionFormCreate;