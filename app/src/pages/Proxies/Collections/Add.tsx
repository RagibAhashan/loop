import { InboxOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Modal, Tabs, Upload } from 'antd';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addProxiesToSet } from '../../../services/Proxy/ProxyService';
import * as ProxyManager from '../ProxyManager';
const { TabPane } = Tabs;
const { Dragger } = Upload;

const CollectionFormAdd = (props: any) => {
    const [form] = Form.useForm();
    const [visibleAdd, setVisibleAdd] = useState(false);
    const [currentAddType, setCurrentAddType] = useState(ProxyManager.AddType.UPLOAD);

    const { proxySetName } = props;

    const dispatch = useDispatch();

    const onAdd = async (values: any) => {
        const proxyArray = await ProxyManager.Add(values, proxySetName, currentAddType);
        dispatch(addProxiesToSet({ name: proxySetName, proxies: proxyArray }));
        setVisibleAdd(false);
    };

    const addTypeChange = (key: string) => {
        setCurrentAddType(key as ProxyManager.AddType);
    };

    return (
        <div>
            <Button
                icon={<PlusOutlined style={{ color: 'green' }} />}
                style={{ textAlign: 'center', float: 'left', paddingLeft: '35px', paddingRight: '35px' }}
                type={'primary'}
                onClick={() => {
                    setVisibleAdd(true);
                }}
            >
                Add Proxies
            </Button>
            <Modal
                visible={visibleAdd}
                bodyStyle={{ height: '370px', paddingTop: 5 }}
                title="Create a new set"
                okText="Create"
                cancelText="Cancel"
                onCancel={() => setVisibleAdd(false)}
                onOk={() => {
                    form.validateFields()
                        .then((values) => {
                            form.resetFields();
                            onAdd(values);
                        })
                        .catch((info) => {
                            console.log('Validate Failed:', info);
                        });
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
                    <Tabs defaultActiveKey="1" onChange={addTypeChange} style={{ backgroundColor: '#282c31', height: '350px' }}>
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
            </Modal>
        </div>
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
