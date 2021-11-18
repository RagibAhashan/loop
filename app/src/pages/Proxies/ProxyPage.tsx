/* eslint-disable @typescript-eslint/no-unused-vars */
import ProxySetContainer from '@components/ProxySet/ProxySetContainer';
import { Divider, Layout, Select } from 'antd';
import React from 'react';
const { Content } = Layout;
const { Option } = Select;

const ProxyPage = () => {
    // const Sets = () => (
    //     <Tabs defaultActiveKey="1" style={{ height: '100%' }} tabBarExtraContent={AddRemoveSets} onChange={onProxySetTabChange}>
    //         {TabPanes()}
    //     </Tabs>
    // );

    // const TabPanes = () => {
    //     if (!proxySets.length) return;
    //     return proxySets.map((proxySet) => {
    //         return (
    //             <TabPane tab={proxySet.name} key={proxySet.name}>
    //                 <ProxySetContainer proxySet={proxySet}></ProxySetContainer>
    //             </TabPane>
    //         );
    //     });
    // };

    // const onStoreSelect = (item: any) => {
    //     setStore(item);
    // };

    // const AddRemoveSets = (
    //     <div style={{ margin: 'auto' }}>
    //         {proxySets.length === 0 ? (
    //             <CollectionFormCreate isButton={true} />
    //         ) : (
    //             <div style={{ display: 'flex', alignItems: 'center' }}>
    //                 <Select value={store} placeholder="Select Store" onChange={onStoreSelect} style={{ width: 200, marginRight: 15 }}>
    //                     {Object.entries(STORES).map(([storeKey, store]) => (
    //                         <Option key={store.key} value={storeKey}>
    //                             {store.name}
    //                         </Option>
    //                     ))}
    //                 </Select>

    //                 <CollectionFormCreate isButton={false} />

    //                 <CollectionFormDelete proxySets={proxySets} />
    //             </div>
    //         )}
    //     </div>
    // );

    return (
        <Layout style={{ padding: 24, backgroundColor: '#212427', height: '100vh', overflow: 'auto' }}>
            <Content style={{ display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
                <div style={{ flex: 1, overflow: 'auto' }}>
                    <Divider> Proxies </Divider>
                    <ProxySetContainer></ProxySetContainer>
                </div>
            </Content>
        </Layout>
    );
};
export default ProxyPage;
