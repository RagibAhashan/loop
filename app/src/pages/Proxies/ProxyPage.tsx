/* eslint-disable @typescript-eslint/no-unused-vars */
import { DeleteFilled, PlusOutlined, PlayCircleFilled } from '@ant-design/icons';
import { Layout, message, Tabs, Button, Tooltip, Row, Col, Empty } from 'antd';
import React, { useEffect, useState } from 'react';
import CollectionFormAdd from './Collections/Add';
import CollectionFormCreate from './Collections/Create';
import CollectionFormDelete from './Collections/Delete';
import ProxyRow from './Proxy'
import { FixedSizeList } from 'react-window';
import { Proxy } from '../../interfaces/OtherInterfaces'
const { ipcRenderer } = window.require('electron');


const { Content } = Layout;
const UPLOAD = '1';
const COPYPASTE = '2';

const botStyle = {
    fontSize: '18px',
    textAlign: 'center',
    marginBottom: 20,
} as React.CSSProperties;


const ProxyPage = () => {
    const [proxies, setProxies] = useState(new Map<string, Proxy[]>());
    let [currentTab, setCurrentTab] = useState({ name: '', key: '1' });

    // Popups Visibility
    const [visibleCreate, setVisibleCreate] = useState(false);
    const [visibleDelete, setVisibleDelete] = useState(false);
    const [deleteSelection, setDeleteSelection] = useState(['']);
    const [visibleAdd, setVisibleAdd] = useState(false);

    let [tab, setTabKey] = useState('1'); // for add popup to select between upload and copy pasta

    useEffect(() => {
        console.log(localStorage);
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
                const arrayProxy: Array<string> = proxyArray[0].split('\n');
                objectifySets(name, arrayProxy);
                
            };
            reader.readAsText(files[0].originFileObj);
        } else if (tab === COPYPASTE) {
            proxyArray.push(values.copiedProxies);
            const arrayProxy: Array<string> = proxyArray[0].split('\n');
            objectifySets(name, arrayProxy);
        }
    };

    const objectifySets = (name: string, arrayProxy: Array<string>) => {
        let array: Array<Proxy> = [];
        let proxyObject: Proxy = {proxy: "", testStatus: "", credential:"", usedBy: []};
        let fields = [];
        let ipPort = "";
        let userPass = "";
        for(let i = 0; i < arrayProxy.length; i++) {
            fields = arrayProxy[i].split(':');
            ipPort = fields[0] + ":" + fields[1];
            userPass = fields[2]+ ":" + fields[3];
            proxyObject = {proxy: ipPort, testStatus: "none", credential:userPass, usedBy: []};
            array.push(proxyObject);
        }
        setProxies(proxies.set(name, array));
        localStorage.setItem('proxies', JSON.stringify(Object.fromEntries(proxies)));
        forceUpdate();
        setVisibleAdd(false);
        tab = '1';
    }

    const onDelete = (values: any) => {
        const arraySetToDelete = values.proxies;
        arraySetToDelete.forEach((name: any) => {
            proxies.delete(name);
            setProxies(proxies);
            localStorage.setItem('proxies', JSON.stringify(Object.fromEntries(proxies)));
        });
        setVisibleDelete(false);
    };

    const Headers = () => {
        return (
            <Row style={botStyle}>
                <Col span={4}>IP</Col>

                <Col span={4}>Port</Col>

                <Col span={4}>Username</Col>

                <Col span={4}>Password</Col>

                <Col span={4}>Status</Col>

                <Col span={4}>Actions</Col>
            </Row>
        );
    };

    const renderProxies = (ele: any) => {
        const { index, style } = ele;
        const proxy: any = proxies.get(currentTab.name) || [];
        var fields = proxy[index].proxy.split(':');
        var ip = fields[0];
        var port = fields[1];
        fields = proxy[index].credential.split(':');
        var username = fields[0];
        var password = fields[1];
        let data = {
            ip: ip,
            port: port,
            username: username,
            password: password,
            status: proxy[index].testStatus,
            action: '',
        };
        return (
            <ProxyRow
                deleteIndividual={deleteIndividual}
                testIndividual={testIndividual}
                currentTab={currentTab}
                proxy={data}
                style={style}
            />
        );
    };

    const showProxies = () => {
        const proxy = proxies.get(currentTab.name) || [];
        return proxy.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={<span style={{ fontSize: '20px', fontWeight: 500 }}>Add some proxies ! 🐱‍💻 </span>}
                />
            </div>
        ) : (
            <FixedSizeList height={700} itemCount={proxy.length} itemSize={45} width="100%" style={{ flex: 1 }}>
                {renderProxies}
            </FixedSizeList>
        );
    };

    function useForceUpdate() {
        const [value, setValue] = useState(0); // integer state
        return () => setValue((value) => value + 1); // update the state to force render
    }
    const forceUpdate = useForceUpdate();

    const onCancel = () => {
        tab = '1';
    };

    const options = () => {
        let setSelection: any = [];
        proxies.forEach((value, key, map) => {
            setSelection.push(key);
        });
        return setSelection;
    };

    const handleChange = (selectedItems: any) => {};

    const testIndividual = (record: any) => {};

    const testAll = () => {};

    const deleteIndividual = (record: any) => {
        let proxiesArray: Array<any> = proxies.get(currentTab.name) || [];
        let proxyToDelete: string = record.ip + ':' + record.port;
        for(let i = 0; i < proxiesArray.length; i++) {
            if(proxiesArray[i].proxy === proxyToDelete) {
                proxiesArray.splice(i, 1);
                break;
            }   
        }
        setProxies(() => {
            proxies.set(currentTab.name, proxiesArray);
            localStorage.setItem('proxies', JSON.stringify(Object.fromEntries(proxies)));
            return proxies;
        });forceUpdate();
    };

    const deleteAll = () => {
        let proxiesArray: Array<Proxy> = [];
        proxies.set(currentTab.name, proxiesArray);
        setProxies(proxies);
        localStorage.setItem('proxies', JSON.stringify(Object.fromEntries(proxies)));
        forceUpdate();
    };

    const { TabPane } = Tabs;

    function callback(key: any) {
        tab = key;
        console.log(typeof(key))
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
            style={{ height: '100%' }}
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
                <TabPane tab={value.name} key={++i}>
                    <Headers />
                     {showProxies()}
                </TabPane>,
            ];
        });
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
                            style={{ color: 'red', fontSize: 30, marginTop: 15, marginLeft: 15 }}
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
                    <div style={{ paddingTop: '10px' }}>
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
                                icon={<PlayCircleFilled style={{ color: 'green' }} />}
                                style={{ textAlign: 'center', float: 'left', marginLeft: '40px', paddingLeft: '35px', paddingRight: '35px' }}
                                type={'primary'}
                                disabled={proxies.get(currentTab.name)?.length === 0 ? true : false}
                                onClick={testAll}
                            >
                                Test All
                            </Button>
                        </div>
                        <div>
                            <Button
                                icon={<DeleteFilled style={{ color: 'red' }} />}
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
