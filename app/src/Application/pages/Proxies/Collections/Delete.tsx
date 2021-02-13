import { Form, Modal, Select} from 'antd';
import React from 'react';


const CollectionFormDelete = (props: any) => {
    const [form] = Form.useForm();
    const optionsArray = props.options();
    const filteredOptions = optionsArray.filter((o: any) => !props.deleteSelection.includes(o));
    return (
        <Modal
            visible={props.visible}
            title="Remove an existing set"
            okText="Remove"
            cancelText="Cancel"
            onCancel={props.onCancel}
            // footer={[<Button type="primary" key="1"> Remove </Button>]}
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
                <Form.Item name="proxies" label="Sets" rules={[{ required: true, message: 'Please choose a set to delete!' }]}>
                    <Select
                        mode="multiple"
                        placeholder="Choose sets to remove"
                        value={props.deleteSelection}
                        onChange={props.handleChange}
                        style={{ width: '100%' }}
                    >
                        {filteredOptions.map((item: any) => (
                            <Select.Option key={item} value={item}>
                                {item}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CollectionFormDelete;