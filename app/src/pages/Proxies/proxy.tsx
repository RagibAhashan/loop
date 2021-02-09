/* eslint-disable @typescript-eslint/no-unused-vars */
import { DeleteFilled, PlusOutlined, PoweroffOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Layout, message, Space, Table, Tabs, Button, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import CollectionFormAdd from './Collections/Add';
import CollectionFormCreate from './Collections/Create';
import CollectionFormDelete from './Collections/Delete';
import { useVT } from 'virtualizedtableforantd4';

const { Content } = Layout;
const UPLOAD = 1;
const COPYPASTE = 2;

const ProxyPage = () => {
    const [proxies, setProxies] = useState(new Map<string, string[]>()); // name -> proxies
    let [currentTab, setCurrentTab] = useState({ name: '', key: '1' });

    // Popups Visibility
    const [visibleCreate, setVisibleCreate] = useState(false);
    const [visibleDelete, setVisibleDelete] = useState(false);
    const [deleteSelection, setDeleteSelection] = useState(['']);
    const [visibleAdd, setVisibleAdd] = useState(false);
    const [vt, set_components] = useVT(() => ({ scroll: { y: 560 } }), []);

    let [tab, setTabKey] = useState(1); // for add popup to select between upload and copy pasta

    useEffect(() => {
        // localStorage.clear()
        let db_proxies: any = localStorage.getItem('proxies');
        if (!db_proxies) {
            const obj = Object.fromEntries(proxies);
            localStorage.setItem('proxies', JSON.stringify(obj));
        } else {
            let tempProxyMap = new Map<string, []>();
            const obj = JSON.parse(db_proxies);
            const array = Object.keys(obj).map((key) => [key, obj[key]]);
            for (let i = 0; i < array.length; i++) {
                tempProxyMap.set(array[i][0], array[i][1]);
            }
            setProxies(tempProxyMap);
            if (array[0] !== undefined && array[0][0]) {
                setCurrentTab({ name: array[0][0], key: '1' });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onCreate = (values: any) => {
        const name = values.name;
        // Check if already exists
        if (proxies.get(name)) {
            message.error(`Proxy Set "${name}" already exists!`);
            return null;
        } else {
            setProxies(proxies.set(name, []));
            localStorage.setItem('proxies', JSON.stringify(Object.fromEntries(proxies)));
            forceUpdate();
            setVisibleCreate(false);
            if (proxies.size === 1) {
                setCurrentTab({ name: name, key: '1' });
            }
        }
    };

    const onAdd = (values: any) => {
        const name = currentTab.name;
        const proxyArray: any = [];

        if (tab === UPLOAD) {
            const files = values.uploadedProxies.fileList;
            // Read file
            let reader = new FileReader();
            reader.onload = (e) => {
                // called after readAsText
                proxyArray.push(e.target?.result);
                setProxies(proxies.set(name, proxyArray[0].split('\n')));
                localStorage.setItem('proxies', JSON.stringify(Object.fromEntries(proxies)));
                forceUpdate();
                setVisibleAdd(false);
                tab = 1;
            };
            reader.readAsText(files[0].originFileObj);
        } else if (tab === COPYPASTE) {
            proxyArray.push(values.copiedProxies);
            setProxies(proxies.set(name, proxyArray[0].split('\n')));
            localStorage.setItem('proxies', JSON.stringify(Object.fromEntries(proxies)));
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
            localStorage.setItem('proxies', JSON.stringify(Object.fromEntries(proxies)));
        });
        setVisibleDelete(false);
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

    function useForceUpdate() {
        const [value, setValue] = useState(0); // integer state
        return () => setValue((value) => value + 1); // update the state to force render
    }
    const forceUpdate = useForceUpdate();

    const onCancel = () => {
        tab = 1;
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
            width: '5%',
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            render: (text: any) => <a> {text} </a>,
        },
        {
            title: 'IP',
            dataIndex: 'ip',
            key: 'ip',
            width: '20%',
        },
        {
            title: 'Port',
            dataIndex: 'port',
            key: 'port',
            width: '15%',
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
            width: '20%',
        },
        {
            title: 'Password',
            dataIndex: 'password',
            key: 'password',
            width: '20%',
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            width: '10%',
        },
        {
            title: 'Action',
            key: 'action',
            width: '10%',
            render: (text: any, record: any) => (
                <Space size="large">
                    <Tooltip placement="top" title={'test'}>
                        <PoweroffOutlined style={{ color: 'green', fontSize: 16 }} onClick={testIndividual} />
                    </Tooltip>
                    <Tooltip placement="top" title={'remove'}>
                        <DeleteFilled
                            twoToneColor={'orange'}
                            style={{ color: 'orange', fontSize: 18 }}
                            onClick={() => {
                                deleteIndividual(record);
                            }}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const testIndividual = () => {};

    const deleteIndividual = (record: any) => {
        let proxiesArray: Array<string> = proxies.get(currentTab.name) || [];
        let proxyToDelete: string = record.ip + ':' + record.port + ':' + record.username + ':' + record.password;
        const index = proxiesArray.indexOf(proxyToDelete);
        if (index > -1) {
            proxiesArray.splice(index, 1);
        }
        proxies.set(currentTab.name, proxiesArray);
        setProxies(proxies);
        localStorage.setItem('proxies', JSON.stringify(Object.fromEntries(proxies)));
        forceUpdate();
    };

    const deleteAll = () => {
        let proxiesArray: Array<string> = [];
        proxies.set(currentTab.name, proxiesArray);
        setProxies(proxies);
        localStorage.setItem('proxies', JSON.stringify(Object.fromEntries(proxies)));
        forceUpdate();
    };

    const { TabPane } = Tabs;

    function callback(key: any) {
        tab = key;
    }

    function tabClick(key: string, event: React.KeyboardEvent<Element> | React.MouseEvent<Element, MouseEvent>) {
        let tabName = (event.target as HTMLTextAreaElement).childNodes[0].textContent as string;
        currentTab.name = tabName;
        currentTab.key = key;
        forceUpdate();
    }

    const Sets = () => (
        <Tabs
            activeKey={currentTab.key}
            defaultActiveKey="1"
            onChange={callback}
            style={{ padding: '10px 15px', height: '100%' }}
            onTabClick={tabClick}
            tabBarExtraContent={AddRemoveSets}
        >
            {TabPanes()}
        </Tabs>
    );

    const TabPanes = () => {
        let proxyArray = Array.from(proxies, ([name, proxies]) => ({ name, proxies }));
        if (!proxies.size) return [];
        let i = 0;
        return proxyArray.map((value) => {
            return [
                <TabPane style={{ height: '100%' }} tab={value.name} key={++i}>
                    <Table scroll={{ y: '78vh' }} components={vt} columns={columns} pagination={false} dataSource={ShowData(value.name)} />
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
            var username = fields[2];
            var password = fields[3];
            let dataRow = {
                id: ++id,
                ip: ip,
                port: port,
                username: username,
                password: password,
                status: 'None',
                action: '',
            };
            data.push(dataRow);
        });
        return data;
    };

    const AddRemoveSets = (
        <div>
            {!proxies.size ? (
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
                <div>
                    <Tooltip placement="top" title={'Add sets'}>
                        <PlusOutlined
                            style={{ color: 'green', fontSize: 30 }}
                            onClick={() => {
                                setVisibleCreate(true);
                            }}
                        />
                    </Tooltip>
                    <Tooltip placement="top" title={'Remove sets'}>
                        <DeleteFilled
                            style={{ color: 'orange', fontSize: 30, marginTop: 15, marginLeft: 15 }}
                            onClick={() => {
                                setVisibleDelete(true);
                            }}
                        />
                    </Tooltip>
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
            )}
            <CollectionFormCreate
                visible={visibleCreate}
                onCreate={onCreate}
                onCancel={() => {
                    setVisibleCreate(false);
                    onCancel();
                }}
            />
        </div>
    );

    return (
        <Layout style={{ padding: 24, backgroundColor: '#212427', height: '100vh', overflow: 'auto' }}>
            <Content style={{ display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
                <div style={{ flex: 1, overflow: 'auto' }}>
                    <Sets />
                </div>
                {proxies.size ? (
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
                                disabled={proxies.get(currentTab.name)?.length === 0 ? true : false}
                            >
                                Test All
                            </Button>
                        </div>
                        <div>
                            <Button
                                icon={<DeleteFilled style={{ color: 'orange' }} />}
                                style={{ textAlign: 'center', float: 'right', paddingLeft: '35px', paddingRight: '35px' }}
                                type={'primary'}
                                onClick={() => {
                                    deleteAll();
                                }}
                                disabled={proxies.get(currentTab.name)?.length === 0 ? true : false}
                            >
                                Delete All
                            </Button>
                        </div>
                    </div>
                ) : null}
            </Content>
        </Layout>
    );
};
export default ProxyPage;
