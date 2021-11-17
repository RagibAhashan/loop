/* eslint-disable @typescript-eslint/no-unused-vars */
import { STORES } from '@constants/Stores';
import { ProxySetChannel } from '@core/IpcChannels';
import { IProxySet } from '@core/ProxySet';
import { Layout, message, Select, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import CollectionFormCreate from './Collections/Create';
import CollectionFormDelete from './Collections/Delete';
import ProxySetContainer from './ProxySetContainer';

const { Content } = Layout;
const { Option } = Select;

const ProxyPage = () => {
    // const [proxies, setProxies] = useState(new Map<string, Proxy[]>());
    const [store, setStore] = useState(undefined);
    const [, setCurrentProxySetName] = useState<string>();

    const [proxySets, setProxySets] = useState<IProxySet[]>([]);

    useEffect(() => {
        console.log('init proxy page');
        window.ElectronBridge.invoke(ProxySetChannel.getAllProxySets).then((proxySets: IProxySet[]) => setProxySets(proxySets));

        window.ElectronBridge.on(ProxySetChannel.proxySetUpdated, handleProxySetUpdated);
        window.ElectronBridge.on(ProxySetChannel.proxySetError, handleProxySetExists);

        return () => {
            window.ElectronBridge.removeListener(ProxySetChannel.proxySetUpdated, handleProxySetUpdated);
            window.ElectronBridge.removeListener(ProxySetChannel.proxySetError, handleProxySetExists);
        };
    }, []);

    const handleProxySetUpdated = (_, proxySets: IProxySet[]) => {
        setProxySets(proxySets);
        message.success('Success');
    };

    const handleProxySetExists = (_) => {
        message.error('Proxy Set Already Exists');
    };

    const onProxySetTabChange = (key: string) => {
        setCurrentProxySetName(key);
    };

    const { TabPane } = Tabs;

    const Sets = () => (
        <Tabs defaultActiveKey="1" style={{ height: '100%' }} tabBarExtraContent={AddRemoveSets} onChange={onProxySetTabChange}>
            {TabPanes()}
        </Tabs>
    );

    const TabPanes = () => {
        if (!proxySets.length) return;
        return proxySets.map((proxySet) => {
            return (
                <TabPane tab={proxySet.name} key={proxySet.name}>
                    <ProxySetContainer proxySet={proxySet}></ProxySetContainer>
                </TabPane>
            );
        });
    };

    const onStoreSelect = (item: any) => {
        setStore(item);
    };

    const AddRemoveSets = (
        <div style={{ margin: 'auto' }}>
            {proxySets.length === 0 ? (
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

                    <CollectionFormDelete proxySets={proxySets} />
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
