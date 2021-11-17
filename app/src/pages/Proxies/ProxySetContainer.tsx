import { CloseCircleOutlined, DeleteFilled, PlayCircleFilled } from '@ant-design/icons';
import { ProxySetChannel } from '@core/IpcChannels';
import { IProxySet } from '@core/ProxySet';
import { Button, Col, Empty, Row } from 'antd';
import React from 'react';
import { FixedSizeList } from 'react-window';
import CollectionFormAdd from './Collections/Add';
import ProxyRow from './ProxyRow';

const Headers = () => {
    return (
        <Row style={{ fontSize: '18px', textAlign: 'center', marginBottom: 20 }}>
            <Col span={4}>IP</Col>
            <Col span={4}>Port</Col>
            <Col span={4}>Username</Col>
            <Col span={4}>Password</Col>
            <Col span={4}>Status</Col>
            <Col span={4}>Actions</Col>
        </Row>
    );
};

interface Props {
    proxySet: IProxySet;
}

const ProxySetContainer: React.FunctionComponent<Props> = (props) => {
    const { proxySet } = props;

    const proxyList = Object.values(proxySet.proxies);

    // TODO refactor this code
    const renderProxies = (ele: any) => {
        const { index, style } = ele;
        let fields = proxyList[index].host.split(':');
        const ip = fields[0];
        const port = fields[1];
        let username;
        let password;
        if (proxyList[index].credential === null) {
            username = 'None';
            password = 'None';
        } else {
            fields = proxyList[index].credential.split(':');
            username = fields[0];
            password = fields[1];
        }
        const data = {
            ip: ip,
            port: port,
            username: username,
            password: password,
            status: proxyList[index].testStatus,
            action: '',
        };
        return (
            <ProxyRow
                // testIndividual={testIndividual}
                // stopTest={stopIndividual}
                // currentTab={currentTab}
                proxySetName={proxySet.name}
                proxyData={data}
                style={style}
                // store={store}
            />
        );
    };

    const deleteAll = () => {
        window.ElectronBridge.send(ProxySetChannel.removeAllProxiesFromProxySet, proxySet.name);
    };

    const showProxies = () => {
        return proxyList.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={<span style={{ fontSize: '20px', fontWeight: 500 }}>Add some proxies ! 🐱‍💻 </span>}
                />
            </div>
        ) : (
            <FixedSizeList height={700} itemCount={proxyList.length} itemSize={45} width="100%" style={{ flex: 1 }}>
                {renderProxies}
            </FixedSizeList>
        );
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Headers />
            {showProxies()}
            <div style={{ paddingTop: '10px' }}>
                <div>
                    <CollectionFormAdd proxySetName={proxySet.name} />
                </div>
                <div>
                    <Button
                        icon={<PlayCircleFilled style={{ color: 'green' }} />}
                        style={{ textAlign: 'center', float: 'left', marginLeft: '40px', paddingLeft: '35px', paddingRight: '35px' }}
                        type={'primary'}
                    >
                        Test All
                    </Button>
                </div>
                <div>
                    <Button
                        icon={<DeleteFilled style={{ color: 'red' }} />}
                        style={{ textAlign: 'center', float: 'right', marginLeft: '40px', paddingLeft: '35px', paddingRight: '35px' }}
                        type={'primary'}
                        onClick={deleteAll}
                        disabled={proxyList.length === 0}
                    >
                        Delete All
                    </Button>
                </div>
                <div>
                    <Button
                        icon={<CloseCircleOutlined style={{ color: 'red' }} />}
                        style={{ textAlign: 'center', float: 'right', paddingLeft: '35px', paddingRight: '35px' }}
                        type={'primary'}
                        onClick={() => {
                            //
                        }}
                        disabled={true}
                    >
                        Delete Failed
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProxySetContainer;
