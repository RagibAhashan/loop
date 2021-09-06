/* eslint-disable @typescript-eslint/no-unused-vars */
import { Layout, Select, Tabs } from 'antd';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PROXY_TEST_REPLY } from '../../common/Constants';
import { STORES } from '../../constants/Stores';
import { deleteAllProxiesFromSet, getProxySets } from '../../services/Proxy/ProxyService';
import CollectionFormCreate from './Collections/Create';
import CollectionFormDelete from './Collections/Delete';
import ProxySetContainer from './ProxySetContainer';

const { Content } = Layout;
const { Option } = Select;

const ProxyPage = () => {
    // const [proxies, setProxies] = useState(new Map<string, Proxy[]>());
    const [store, setStore] = useState(undefined);
    const [, setCurrentProxySetName] = useState<string>();

    // Popups Visibility
    const [deleteSelection, setDeleteSelection] = useState(['']);

    const currentTab = { name: '', key: '1' };
    const dispatch = useDispatch();

    const proxies = useSelector(getProxySets);

    const noProxyCreated = Object.keys(proxies).length === 0;

    window.ElectronBridge.on(PROXY_TEST_REPLY, (message, info) => {
        // let set = proxies[info.setName].proxies;
        // for (let i = 0; i < set?.length; i++) {
        //     if (set[i].host === info.proxy) {
        //         info.store.key === 'FootlockerCA' ? (set[i].testStatus.FootlockerCA = info.delay) : (set[i].testStatus.FootlockerUS = info.delay);
        //     }
        // }
        // proxies.set(info.setName, set);
        // localStorage.setItem('proxies', JSON.stringify(Object.fromEntries(proxies)));

        window.ElectronBridge.removeAllListeners(PROXY_TEST_REPLY);
    });

    const deleteAll = () => {
        dispatch(deleteAllProxiesFromSet({ name: currentTab.name }));
    };

    const testIndividual = (proxyToTest: any, setName: any) => {
        // let proxiesArray: Array<any> = proxies.get(setName) || [];
        // proxiesArray = ProxyTester.testIndividual(proxyToTest, proxiesArray, store);
        // proxies.set(setName, proxiesArray);
        // setProxies(proxies);
        // localStorage.setItem('proxies', JSON.stringify(Object.fromEntries(proxies)));
    };

    const stopIndividual = (proxyToStop: any, setName: any) => {
        // let proxiesArray: Array<any> = proxies.get(setName) || [];
        // proxiesArray = ProxyTester.stopIndividual(proxyToStop, proxiesArray, store);
        // proxies.set(setName, proxiesArray);
        // setProxies(proxies);
        // localStorage.setItem('proxies', JSON.stringify(Object.fromEntries(proxies)));
    };

    const testAll = () => {
        // let set = proxies.get(currentTab.name) || [];
        // for (let i = 0; i < set?.length; i++) {
        //     testIndividual(set[i].proxy, currentTab.name);
        //     window.ElectronBridge.send(NOTIFY_START_PROXY_TEST, currentTab.name, set[i].proxy, set[i].credential, store);
        // }
    };

    const onProxySetTabChange = (key: string) => {
        setCurrentProxySetName(key);
    };

    const options = () => {
        const setSelection: any = [];
        Object.keys(proxies).forEach((setName) => {
            setSelection.push(setName);
        });
        return setSelection;
    };

    const { TabPane } = Tabs;

    const Sets = () => (
        <Tabs defaultActiveKey="1" style={{ height: '100%' }} tabBarExtraContent={AddRemoveSets} onChange={onProxySetTabChange}>
            {TabPanes()}
        </Tabs>
    );

    const TabPanes = () => {
        if (!Object.keys(proxies).length) return;
        return Object.keys(proxies).map((proxySet) => {
            return (
                <TabPane tab={proxySet} key={proxySet}>
                    <ProxySetContainer proxySetName={proxySet}></ProxySetContainer>
                </TabPane>
            );
        });
    };

    const onStoreSelect = (item: any) => {
        setStore(item);
    };

    const AddRemoveSets = (
        <div style={{ margin: 'auto' }}>
            {noProxyCreated ? (
                <CollectionFormCreate isButton={true} />
            ) : (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Select value={store} placeholder="Select Store" onChange={onStoreSelect} style={{ width: 200, marginRight: 15 }}>
                        {Object.entries(STORES).map(([storeKey, store]) => (
                            <Option key={store.key} value={storeKey}>
                                {store.name}
                            </Option>
                        ))}
                    </Select>

                    <CollectionFormCreate isButton={false} />

                    <CollectionFormDelete />
                </div>
            )}
        </div>
    );

    return (
        <Layout style={{ padding: 24, backgroundColor: '#212427', height: '100vh', overflow: 'auto' }}>
            <Content style={{ display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
                <div style={{ flex: 1, overflow: 'auto' }}>
                    <Sets />
                </div>
            </Content>
        </Layout>
    );
};
export default ProxyPage;
