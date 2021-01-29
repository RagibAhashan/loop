import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Input, Button, Divider, Table, Modal, Tag, Space, Card, message, Upload, Layout, Menu, Tabs } from 'antd';
import { DeleteOutlined, InboxOutlined, UserOutlined } from '@ant-design/icons';
import * as Constants from '../constants';

const { Header, Content } = Layout;

const ProxyPage = () => {
    const [proxies, setProxies] = useState(new Map<string, []>()); // name -> proxies
    const [visible, setVisible] = useState(false);

    const onCreate = (values: any) => {
        const name = values.name;
        const files = values.proxies.fileList;
        const proxyArray: any = [];

        // Check if already exists
        if (proxies.get(name)) {
          message.error(`Proxy Set "${name}" already exists!`);
          return null;
        }

        // Read files
        let reader = new FileReader();
        reader.onload = (e) => {
            // called after readAsText
            proxyArray.push(e.target?.result);
            setProxies(proxies.set(name, proxyArray));
            localStorage.setItem('proxies', JSON.stringify(Array.from(proxies.entries())));
            forceUpdate();
            setVisible(false);
        };
        reader.readAsText(files[0].originFileObj);
    };

    useEffect(() => {
        let db_proxies: any = localStorage.getItem('proxies');
        if (!db_proxies) {
            db_proxies = new Map();
            localStorage.setItem('proxies', JSON.stringify(Array.from(db_proxies.entries())));
        } else {
            let tempProxyMap = new Map();
            for (let i = 0; i < JSON.parse(db_proxies).length; i++) {
                tempProxyMap.set(JSON.parse(db_proxies)[i][0], JSON.parse(db_proxies)[i][1]);
            }
            setProxies(tempProxyMap);
        }
    }, []);

    const onDeleteSet = (name: any) => {
        proxies.delete(name.toString());
        setProxies(proxies);
        localStorage.setItem('proxies', JSON.stringify(Array.from(proxies.entries())));
        forceUpdate();
    };

    const downloadProxies = (values: [], name: string) => {
        const proxyFileName = name + 'Proxies.txt';
        const valuesNewLine = [values.join('\r\n')];
        const element = document.createElement('a');
        const file = new Blob(valuesNewLine, { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = proxyFileName;
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    };

    const showProxiesPopup = (proxies: []) => {
        const PROXIES_TO_SHOW = 15;
        const proxiesToShow = proxies.slice(0, PROXIES_TO_SHOW);
        return proxiesToShow.map((value) => {
            return <div> {value} </div>;
        });
    };

    function useForceUpdate() {
        const [value, setValue] = useState(0); // integer state
        return () => setValue((value) => value + 1); // update the state to force render
    }
    const forceUpdate = useForceUpdate();

    const CollectionCreateForm = ({ visible, onCreate, onCancel }: any) => {
      const [form] = Form.useForm();
      return (
        <Modal
          visible={visible}
          title="Create a new set"
          okText="Create"
          cancelText="Cancel"
          onCancel={onCancel}
          onOk={() => {
            form.validateFields()
              .then((values) => {
                form.resetFields();
                onCreate(values);
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
              <Form.Item
                name="name"
                label="Name"
                rules={[
                  {
                    required: true,
                    message: 'Please input the name of the set!',
                  },
                ]}
              >
                <Input placeholder="Input set same" />
              </Form.Item>
              <Form.Item
                name="proxies"
                label="Proxies"
                rules={[
                  {
                    required: true,
                    message: 'Please input the list of proxies!',
                  },
                ]}
              >
                <Dragger {...prop}>
                  <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Click or drag file to this area to upload</p>
                  <p className="ant-upload-hint">Make sure that your list of proxies is separated by new lines!</p>
                </Dragger>
                    {/* <Input type="textarea" placeholder="Copy Paste your list of proxies"/> */}
              </Form.Item>
            </Form>
        </Modal>
      );
    };

    const { Dragger } = Upload;

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

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (text: any) => <a>{text}</a>,
        },
        {
            title: 'IP',
            dataIndex: 'ip',
            key: 'ip',
        },
        {
            title: 'Port',
            dataIndex: 'port',
            key: 'port',
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text: any, record: any) => (
                <Space size="middle">
                    <a>Test</a>
                    <a>Delete</a>
                </Space>
            ),
        },
    ];

    const onChange = () => {};

    const { TabPane } = Tabs;

    function callback(key: any) {
        console.log(key);
    }

    const Sets = () => (
        <Tabs defaultActiveKey="1" onChange={callback} style={{ padding: '20px 50px' }}>
            { TabPanes() }
        </Tabs>
    );

    const TabPanes = () => {
      let proxyArray = Array.from(proxies, ([name, proxies]) => ({ name, proxies }));
        if (!proxies.size) return [];
        let i = 0;
        return proxyArray.map((value) => {
            return ([
              <TabPane tab={value.name} key={++i}>
                <Table columns={columns} pagination={{ pageSize: 8 }} dataSource={ShowProxies(value.name)} onChange={onChange} />
              </TabPane>
            ]);
        });
    }

    const ShowProxies = (name:string) => {
      let proxyArray = proxies.get(name) || ['0'];
      let array = proxyArray[0]?.split("\n")
      console.log(array)
      if (!proxies.size) return [];
      return array?.map((value) => {
          return ([
              {
                  id: value,
                  ip: value,
                  port: 32,
                  status: value,
                  action: value,
              },
          ]);
      });
  };

    return (
        <Layout>
            <Header>
                <Row>
                    <Col span={2} style={{ fontSize: 30 }}>
                        {' '}
                        Proxies{' '}
                    </Col>
                    <Col span={22} style={{ textAlign: 'right' }}>
                        <div>
                            <Button
                                type="primary"
                                onClick={() => {
                                    setVisible(true);
                                }}
                            >
                                Add new set
                            </Button>
                            <CollectionCreateForm
                                visible={visible}
                                onCreate={onCreate}
                                onCancel={() => {
                                    setVisible(false);
                                }}
                            />
                        </div>
                    </Col>
                </Row>
            </Header>
            <Content>
                <Sets />
            </Content>
        </Layout>
    );
};

export default ProxyPage;
