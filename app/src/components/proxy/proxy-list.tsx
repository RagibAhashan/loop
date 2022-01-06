import { ProxyViewData } from '@core/proxy';
import { ProxySetViewData } from '@core/proxyset';
import { Empty } from 'antd';
import React from 'react';
import { FixedSizeList } from 'react-window';
import ProxyComponent from './proxy-component';

interface Props {
    proxies: ProxyViewData[];
    selectedProxySet: ProxySetViewData;
}
const ProxyList: React.FunctionComponent<Props> = (props) => {
    const { proxies, selectedProxySet } = props;

    const renderProxies = (element: any) => {
        const { index, style } = element;

        return <ProxyComponent key={proxies[index].host} proxy={proxies[index]} selectedProxySet={selectedProxySet} style={style} />;
    };

    return proxies.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span style={{ fontSize: '20px', fontWeight: 500 }}>No proxies 🐱‍💻 </span>} />
        </div>
    ) : (
        <FixedSizeList height={700} itemCount={proxies.length} itemSize={45} width="100%" style={{ flex: 1, padding: 10 }}>
            {renderProxies}
        </FixedSizeList>
    );
};

export default ProxyList;
