import { CloseCircleOutlined, DeleteFilled, PlayCircleFilled } from '@ant-design/icons';
import { Button, Col, Empty, Row } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FixedSizeList } from 'react-window';
import { AppState } from '../../global-store/GlobalStore';
import { deleteAllProxiesFromSet, getProxySetByName } from '../../services/Proxy/ProxyService';
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

const ProxySetContainer = (props: any) => {
    const { proxySetName }: { proxySetName: string } = props;

    const proxySet = useSelector((state: AppState) => getProxySetByName(state, proxySetName));
    const proxyList = Object.values(proxySet.proxies);

    const dispatch = useDispatch();

    // TODO refactor this code
    const renderProxies = (ele: any) => {
        const { index, style } = ele;
        var fields = proxyList[index].host.split(':');
        var ip = fields[0];
        var port = fields[1];
        var username;
        var password;
        if (proxyList[index].credential === null) {
            username = 'None';
            password = 'None';
        } else {
            fields = proxyList[index].credential.split(':');
            username = fields[0];
            password = fields[1];
        }
        let data = {
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
                proxySetName={proxySetName}
                proxyData={data}
                style={style}
                // store={store}
            />
        );
    };

    const deleteAll = () => {
        dispatch(deleteAllProxiesFromSet({ name: proxySetName }));
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
                    <CollectionFormAdd proxySetName={proxySetName} />
                </div>
                <div>
                    <Button
                        icon={<PlayCircleFilled style={{ color: 'green' }} />}
                        style={{ textAlign: 'center', float: 'left', marginLeft: '40px', paddingLeft: '35px', paddingRight: '35px' }}
                        type={'primary'}
                        // disabled={proxies.get(currentTab.name)?.length === 0 || store === undefined ? true : false}
                        // onClick={testAll}
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
