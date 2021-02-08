import { InboxOutlined } from '@ant-design/icons';
import { Form, Input, message, Modal,  Tabs, Upload } from 'antd';
import React from 'react';


const { TabPane } = Tabs;
const { Dragger } = Upload;

const CollectionFormAdd = (props:any) => {
    const [form] = Form.useForm();
    return (
        <Modal
            // footer={null}
            visible={props.visible}
            bodyStyle={{ height: '370px', paddingTop: 5 }}
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
                <Form
                    form={form}
                    layout="vertical"
                    name="form_in_form"
                    initialValues={{
                        modifier: 'public',
                    }}
                >
                    <Tabs defaultActiveKey="1" onChange={props.callback} style={{ backgroundColor: '#282c31', height: '350px' }}>
                        <TabPane tab={'Upload'} key={1}>
                            <Form.Item name="uploadedProxies" rules={[{ required: false, message: 'Please input the list of proxies to add!' }]}>
                                <Dragger style={{ padding: 40 }} {...prop}>
                                    <p className="ant-upload-drag-icon">
                                        <InboxOutlined />
                                    </p>
                                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                    <p className="ant-upload-hint">Format should be: ip:port:username:password </p>
                                </Dragger>
                            </Form.Item>
                        </TabPane>

                        <TabPane tab={'Copy Paste'} key={2}>
                            <Form.Item name="copiedProxies" rules={[{ required: false, message: 'Please input the list of proxies to add!' }]}>
                                <Input.TextArea
                                    rows={5}
                                    autoSize={{ maxRows: 10, minRows: 10 }}
                                    style={{ height: '150px', backgroundColor: 'rgba(40,44,41,0.5)' }}
                                    placeholder={'Copy paste your proxies here \nFormat should be: ip:port:username:password'}
                                />
                            </Form.Item>
                        </TabPane>
                    </Tabs>
                </Form>
            </Form>
        </Modal>
    );
};

const dummyRequest = ({ onSuccess }: any) => {
    setTimeout(() => {
        onSuccess('ok');
    }, 0);
};

const prop = {
    accept: '.txt',
    name: 'file',
    multiple: false,
    maxCount: 1,
    customRequest: dummyRequest,
    onChange(info: any) {
        const { status } = info.file;
        if (status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
};

export default CollectionFormAdd;
