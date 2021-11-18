import ProxyContainer from '@components/Proxy/ProxyContainer';
import ProxySetContainer from '@components/ProxySet/ProxySetContainer';
import React from 'react';

const ProxyPage = () => {
    return (
        <div style={{ height: '100%', width: '100%', display: 'flex', overflow: 'hidden' }}>
            <div
                style={{
                    width: '250px',
                    height: '100%',
                    backgroundColor: '#2a2e31',
                }}
            >
                <ProxySetContainer></ProxySetContainer>
            </div>
            <div style={{ height: '100%', width: '100%' }}>
                <ProxyContainer></ProxyContainer>
            </div>
        </div>
    );
};
export default ProxyPage;
