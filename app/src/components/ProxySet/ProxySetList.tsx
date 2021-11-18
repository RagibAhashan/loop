import { IProxySet } from '@core/ProxySet';
import React from 'react';

interface Props {
    proxySets: IProxySet[];
}

const ProxyList: React.FunctionComponent<Props> = () => {
    return <div> proxy list </div>;
};

export default ProxyList;
