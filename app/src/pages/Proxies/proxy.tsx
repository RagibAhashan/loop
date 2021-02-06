import { DeleteFilled, PlusOutlined, PoweroffOutlined } from '@ant-design/icons';
import { Layout, message, Space, Table, Tabs, Upload, Button} from 'antd';
import React, { useEffect, useState } from 'react';
import { useVT } from 'virtualizedtableforantd4';
import CollectionFormAdd from './Collections/Add'
import CollectionFormCreate from './Collections/Create'
import CollectionFormDelete from './Collections/Delete'

const { Header, Content } = Layout;
const UPLOAD = 1;
const COPYPASTE = 2;

const ProxyPage = () => {
    const [proxies, setProxies] = useState(new Map<string, []>()); // name -> proxies
    let [currentTab, setCurrentTab] = useState({ name: '', key: '1' });

    // Popups Visibility
    const [visibleCreate, setVisibleCreate] = useState(false);
    const [visibleDelete, setVisibleDelete] = useState(false);
    const [deleteSelection, setDeleteSelection] = useState(['']);
    const [visibleAdd, setVisibleAdd] = useState(false);

    let [tab, setTabKey] = useState(1); // for add popup to select between upload and copy pasta

    const onCreate = (values: any) => {
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
    };

    const onAdd = (values: any) => {
        const name = currentTab.name;
        const proxyArray: any = [];

        if (tab == UPLOAD) {
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
        } else if (tab == COPYPASTE) {
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

    const onCancel = () => {
        tab = 1;
        console.log('key: ' + tab);
    };

    const options = () => {
        let setSelection: any = [];
        proxies.forEach((value, key, map) => {
            setSelection.push(key);
        });
        return setSelection;
    };

    const handleChange = (selectedItems: any) => {};

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: '10%',
            render: (text: any) => <a> {text} </a>,
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
                    <PoweroffOutlined style={{ color: 'green', fontSize: 16 }} onClick={testIndividual} />
                    <DeleteFilled twoToneColor={'orange'} style={{ color: 'orange', fontSize: 18 }} onClick={deleteIndividual} />
                </Space>
            ),
        },
    ];

    const testIndividual = () => {};

    const deleteIndividual = () => {};

    const onChange = () => {};

    const { TabPane } = Tabs;

    function callback(key: any) {
        tab = key;
    }

    function tabClick(key: string, event: React.KeyboardEvent<Element> | React.MouseEvent<Element, MouseEvent>) {
        console.log((event.target as HTMLTextAreaElement).childNodes[0].textContent as string);
        let tabName = (event.target as HTMLTextAreaElement).childNodes[0].textContent as string;
        currentTab.name = tabName;
        currentTab.key = key;
        forceUpdate();
    }

    const Sets = () => (
        <div>
            <Tabs
                activeKey={currentTab.key}
                defaultActiveKey="1"
                onChange={callback}
                style={{ padding: '10px 15px' }}
                onTabClick={tabClick}
                tabBarExtraContent={AddRemoveSets}
            >
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
                    <Table scroll={{ y: 560 }} columns={columns} pagination={false} dataSource={ShowData(value.name)} onChange={onChange} />
                </TabPane>,
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

    const AddRemoveSets = (
        <div>
            <PlusOutlined
                style={{ color: 'green', fontSize: 30 }}
                onClick={() => {
                    setVisibleCreate(true);
                }}
            />
            <CollectionFormCreate
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
            <CollectionFormDelete
                visible={visibleDelete}
                onCreate={onDelete}
                onCancel={() => {
                    setVisibleDelete(false);
                }}
                options={options}
                deleteSelection={deleteSelection}
                handleChange={handleChange}
            />
        </div>
    );

    return (
        <Layout style={{ padding: 24, backgroundColor: '#212427', height: '100vh', overflow: 'auto' }}>
            <Content>
                <div>
                    {' '}
                    <Sets />{' '}
                </div>
                <div style={{ padding: '10px 15px' }}>
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
                        <CollectionFormAdd
                            visible={visibleAdd}
                            onCreate={onAdd}
                            onCancel={() => {
                                setVisibleAdd(false);
                            }}
                            callback={callback}
                        />
                    </div>
                    <div>
                        <Button
                            icon={<PoweroffOutlined style={{ color: 'green' }} />}
                            style={{ textAlign: 'center', float: 'left', marginLeft: '40px', paddingLeft: '35px', paddingRight: '35px' }}
                            type={'primary'}
                        >
                            Test All
                        </Button>
                    </div>
                    <div>
                        <Button
                            icon={<DeleteFilled style={{ color: 'orange' }} />}
                            style={{ textAlign: 'center', float: 'right', paddingLeft: '35px', paddingRight: '35px' }}
                            type={'primary'}
                        >
                            Delete All
                        </Button>
                    </div>
                </div>
            </Content>
        </Layout>
    );
};

export default ProxyPage;
