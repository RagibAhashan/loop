import { DeleteFilled, InboxOutlined, PlusOutlined, PoweroffOutlined } from '@ant-design/icons';
import { Form, Input, Layout, message, Modal, Divider, Select, Space, Table, Tabs, Upload, Button, Row, Col } from 'antd';
import React, { useEffect, useState } from 'react';

const { Header, Content } = Layout;
const UPLOAD = 1;
const COPYPASTE = 2;

const ProxyPage = () => {
    const [proxies, setProxies] = useState(new Map<string, []>()); // name -> proxies
    let [currentTab, setCurrentTab] = useState({name: '', key: '1'});

    // Popups Visibility
    const [visibleCreate, setVisibleCreate] = useState(false);
    const [visibleDelete, setVisibleDelete] = useState(false);
    const [deleteSelection, setDeleteSelection] = useState(['']);
    const [visibleAdd, setVisibleAdd] = useState(false);

    let [tab, setTabKey] = useState(1); // for add popup to select between upload and copy pasta

    const onCreate = (values:any) => {
        const name = values.name;
        // Check if already exists
        if (proxies.get(name)) {
            message.error(`Proxy Set "${name}" already exists!`);
            return null;
        } else {
            setProxies(proxies.set(name, []));
            localStorage.setItem('proxies', JSON.stringify(Array.from(proxies.entries())));
            forceUpdate();
            setVisibleCreate(false);
        }
    }

    const onAdd = (values: any) => {
        const name = currentTab.name;
        const proxyArray: any = [];
        
        if(tab == UPLOAD) {
            const files = values.uploadedProxies.fileList;
            // Read file
            let reader = new FileReader();
            reader.onload = (e) => {
                // called after readAsText
                proxyArray.push(e.target?.result);
                setProxies(proxies.set(name, proxyArray[0].split('\n')));
                localStorage.setItem('proxies', JSON.stringify(Array.from(proxies.entries())));
                forceUpdate();
                setVisibleAdd(false);
                tab = 1;
            };
            reader.readAsText(files[0].originFileObj);
        } 
        else if (tab == COPYPASTE) {
            proxyArray.push(values.copiedProxies);
            setProxies(proxies.set(name, proxyArray[0].split('\n')));
            localStorage.setItem('proxies', JSON.stringify(Array.from(proxies.entries())));
            forceUpdate();
            setVisibleAdd(false);
            tab = 1;
        }
    };

    const onDelete = (values: any) => {
        const arraySetToDelete = values.proxies;
        arraySetToDelete.forEach((name: any) => {
            proxies.delete(name);
            setProxies(proxies);
            localStorage.setItem('proxies', JSON.stringify(Array.from(proxies.entries())));
        });
        setVisibleDelete(false);
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

    function useForceUpdate() {
        const [value, setValue] = useState(0); // integer state
        return () => setValue((value) => value + 1); // update the state to force render
    }
    const forceUpdate = useForceUpdate();

    const CollectionCreateFormAdd = ({ visible, onCreate, onCancel }: any) => {
        const [form] = Form.useForm();
        return (
            <Modal
                // footer={null}
                visible={visible}
                bodyStyle={{height: '415px', paddingTop: 5}}
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
                    <Form
                        form={form}
                        layout="vertical"
                        name="form_in_form"
                        initialValues={{
                            modifier: 'public',
                        }}
                     >   
                            <Tabs defaultActiveKey="1" onChange={callback} style={{ backgroundColor: "#282c31", height:'350px'}}>
                                <TabPane tab={'Upload'} key={1}>
                                    <Form.Item name="uploadedProxies" rules={[{ required: false, message: 'Please input the list of proxies to add!' }]}>
                                        <Dragger style={{padding: 40}} {...prop}>
                                            <p className="ant-upload-drag-icon">
                                                <InboxOutlined />
                                            </p>
                                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                            <p className="ant-upload-hint">Make sure that your  proxies are separated by new lines!</p>
                                        </Dragger>
                                    </Form.Item>
                                </TabPane>
                                
                                <TabPane tab={'Copy Paste'} key={2}>
                                    <Form.Item name="copiedProxies" rules={[{ required: false, message: 'Please input the list of proxies to add!' }]}>
                                        <Input.TextArea
                                            rows={5}
                                            autoSize={{maxRows:10, minRows:10}}
                                            style={{height:'150px', backgroundColor:'rgba(40,44,41,0.5)'}} 
                                            placeholder={'Copy paste your proxies here \nMake sure that your proxies are separated by new lines!'}
                                        />                                    
                                    </Form.Item>
                                </TabPane>
                               
                            </Tabs>  
                    
                    </Form>
                </Form>
            </Modal>
        );
    };
    const CollectionCreateFormCreate = ({ visible, onCreate, onCancel }: any) => {
        const [form] = Form.useForm();
        return (
            <Modal
                // footer={null}
                visible={visible}
                bodyStyle={{height: '50px', paddingTop: 5}}
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
                    <Form.Item name="name" rules={[{ required: true, message: 'Please input the name of the set to add!' }]}>
                        <Input placeholder="Input set same" />
                    </Form.Item>
                </Form>
            </Modal>
        );
    };
    const onCancel = () => {
        tab = 1; console.log('key: ' + tab);
    }

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

    const OPTIONS = () => {
        let setSelection: any = [];
        proxies.forEach((value, key, map) => {
            setSelection.push(key);
        });
        return setSelection;
    };

    const handleChange = (selectedItems: any) => {};

    const CollectionCreateFormDelete = ({ visible, onCreate, onCancel }: any) => {
        const [form] = Form.useForm();
        const optionsArray = OPTIONS();
        const filteredOptions = optionsArray.filter((o: any) => !deleteSelection.includes(o));
        return (
            <Modal
                visible={visible}
                title="Remove an existing set"
                okText="Remove"
                cancelText="Cancel"
                onCancel={onCancel}
                // footer={[<Button type="primary" key="1"> Remove </Button>]}
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
                    <Form.Item name="proxies" label="Sets" rules={[{ required: true, message: 'Please choose a set to delete!' }]}>
                        <Select
                            mode="multiple"
                            placeholder="Choose sets to remove"
                            value={deleteSelection}
                            onChange={handleChange}
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

    const { Dragger } = Upload;

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: '10%',
            render: (text: any) => <a> { text } </a>,
        },
        {
            title: 'IP',
            dataIndex: 'ip',
            key: 'ip',
            width: '25%',
        },
        {
            title: 'Port',
            dataIndex: 'port',
            key: 'port',
            width: '25%',
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            width: '25%',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text: any, record: any) => (
                <Space size="large">
                    <PoweroffOutlined style={{color: 'green', fontSize:16}} onClick={testIndividual}/>
                    <DeleteFilled twoToneColor={'orange'} style={{color: 'orange',fontSize:18}} onClick={deleteIndividual}/>
                </Space>
            ),
        },
    ];

    const testIndividual = () => {

    }

    const deleteIndividual = () => {

    }

    const onChange = () => {};

    const { TabPane } = Tabs;

    function callback(key: any) { tab = key;}

    function tabClick(key: string, event: React.KeyboardEvent<Element> | React.MouseEvent<Element, MouseEvent>) {
        console.log((event.target as HTMLTextAreaElement).childNodes[0].textContent as string);
        let tabName = (event.target as HTMLTextAreaElement).childNodes[0].textContent as string;
        currentTab.name = tabName;
        currentTab.key = key;
        forceUpdate();
    }

    const Sets = () => (
        <div>
        <Tabs  activeKey={currentTab.key} defaultActiveKey="1" onChange={callback} style={{ padding: '10px 15px' }} onTabClick={tabClick} tabBarExtraContent={AddRemoveSets}>
            {TabPanes()}
        </Tabs>
        </div>
    );

    const TabPanes = () => {
        let proxyArray = Array.from(proxies, ([name, proxies]) => ({ name, proxies }));
        if (!proxies.size) return [];
        let i = 0;
        return proxyArray.map((value) => {
            return [
                <TabPane tab={value.name} key={++i}>
                    <Table scroll={{ y: 560 }} columns={columns} pagination={ false } dataSource={ShowData(value.name)} onChange={onChange} />
                </TabPane>
                ,
            ];
        });
    };

    const ShowData = (name: string) => {
        let data: any = [];
        let tempProxies: any = [];
        tempProxies = proxies.get(name);
        let id = 0;
        tempProxies.forEach((value: any) => {
            var fields = value.split(':');
            var ip = fields[0];
            var port = fields[1];
            let dataRow = {
                id: ++id,
                ip: ip,
                port: port,
                status: 'None',
                action: '',
            };
            data.push(dataRow);
        });
        return data;
    };

    const AddRemoveSets = 
        <div>
            <PlusOutlined
                style={{ color: 'green', fontSize: 30 }}
                onClick={() => {
                    setVisibleCreate(true);
                }}
            />
            <CollectionCreateFormCreate
                visible={visibleCreate}
                onCreate={onCreate}
                onCancel={() => {
                    setVisibleCreate(false);
                    onCancel();
                }}
            />
            <DeleteFilled
                style={{ color: 'orange', fontSize: 30, marginTop: 15, marginLeft: 15 }}
                onClick={() => {
                    setVisibleDelete(true);
                }}
            />
            <CollectionCreateFormDelete
                visible={visibleDelete}
                onCreate={onDelete}
                onCancel={() => {
                    setVisibleDelete(false);
                }}
            />
        </div>
    

    return (
        <Layout style={{ padding: 24, backgroundColor: '#212427', height: '1000vh' }}>
            <Content>
                <div> <Sets />  </div>
                <div style={{padding:'10px 15px'}}>
                    <div>
                        <Button 
                            icon={<PlusOutlined style={{color:'green'}}/>}
                            style={{textAlign: 'center', float: 'left', paddingLeft: '35px', paddingRight: '35px'}} 
                            type={'primary'}
                            onClick={() => { setVisibleAdd(true)}}
                            > 
                            Add Proxies
                        </Button> 
                        <CollectionCreateFormAdd
                            visible={visibleAdd}
                            onCreate={onAdd}
                            onCancel={() => {
                                setVisibleAdd(false);
                            }}
                        />
                    </div>
                    <div>
                        <Button 
                            icon={<PoweroffOutlined style={{color:'green'}}/>}
                            style={{textAlign: 'center', float: 'left', marginLeft:'40px', paddingLeft: '35px', paddingRight: '35px'}} 
                            type={'primary'}> 
                            Test All 
                        </Button>  
                    </div>
                    <div>
                        <Button 
                            icon={<DeleteFilled style={{color:'orange'}}/>}
                            style={{textAlign: 'center', float: 'right', paddingLeft: '35px', paddingRight: '35px'}} 
                            type={'primary'}> 
                            Delete All 
                        </Button>  
                    </div>
                </div>
            </Content>
        </Layout>
    );
};

export default ProxyPage;
