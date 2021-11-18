// import styles from './sidebar.module.css';
import { DeleteFilled, PlayCircleFilled, StopFilled } from '@ant-design/icons';
import { Button, Col, Row } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';
import { NOTIFY_START_PROXY_TEST, NOTIFY_STOP_PROXY_TEST } from '../../common/Constants';
import { deleteProxyFromSet } from '../../services/Proxy/ProxyService';

const startButton = {
    border: 'none',
    borderRadius: '100%',
    color: 'green',
};

const disabledStartButton = {
    border: 'none',
    borderRadius: '100%',
    color: 'grey',
    backgroundColor: 'transparent',
};

const stopButton = {
    border: 'none',
    borderRadius: '100%',
    color: '#fc3d03',
};

const deleteButton = {
    border: 'none',
    borderRadius: '100%',
    color: 'red',
};

// TODO Refactor this component with redux
const ProxyRow = (props: any) => {
    const { proxyData, style, currentTab, store, proxySetName } = props;

    const dispatch = useDispatch();

    const statusColor = (level: string) => {
        switch (level) {
            case 'Pick a store':
                return 'orange';
            case 'idle':
                return 'yellow';
            case 'Testing...':
                return 'white';
            case 'error':
                return 'red';
            case 'Canceled Test':
                return '#f7331e';
            default:
                return 'green';
        }
    };

    const runButton = () => {
        return getStatus(store) === 'Testing...' ? (
            <Button
                onClick={() => {
                    stopTest();
                }}
                style={stopButton}
                icon={<StopFilled />}
                size="small"
            />
        ) : (
            <Button
                onClick={() => {
                    testIndividual(proxyData);
                }}
                disabled={store === undefined}
                style={store === undefined ? disabledStartButton : startButton}
                icon={<PlayCircleFilled />}
                size="small"
            />
        );
    };

    const deleteIndividual = () => {
        dispatch(deleteProxyFromSet({ name: proxySetName, proxyHost: proxyData.ip + ':' + proxyData.port }));

        // TODO test logic
        // window.ElectronBridge.send(NOTIFY_STOP_PROXY_TEST, currentTab.name, proxyToDelete, record.credential, store);
    };

    const testIndividual = (proxy: any) => {
        const proxyToTest = proxy.ip + ':' + proxy.port;
        const credential = proxy.username + ':' + proxy.password;
        props.testIndividual(proxyToTest, currentTab.name);
        window.ElectronBridge.send(NOTIFY_START_PROXY_TEST, currentTab.name, proxyToTest, credential, store);
    };

    const stopTest = () => {
        const proxyToStop = proxyData.ip + ':' + proxyData.port;
        const credential = proxyData.username + ':' + proxyData.password;
        props.stopTest(proxyToStop, currentTab.name);
        window.ElectronBridge.send(NOTIFY_STOP_PROXY_TEST, currentTab.name, proxyToStop, credential, store);
    };

    const getStatus = (store: any) => {
        if (store === undefined) {
            return 'Pick a store';
        }
        switch (store) {
            case 'FootlockerCA':
                return proxyData.status.FootlockerCA;
            case 'FootlockerUS':
                return proxyData.status.FootlockerUS;
            default:
                return 'lol';
        }
    };

    return (
        <Row
            align="middle"
            style={{
                ...style,
                backgroundColor: '#282c31',
                borderRadius: 5,
                height: style.height - 5,
                textAlign: 'center',
                whiteSpace: 'nowrap',
            }}
        >
            <Col span={4} style={{ paddingLeft: 10, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                <div>{proxyData.ip}</div>
            </Col>

            <Col span={4}>
                <div>{proxyData.port}</div>
            </Col>

            <Col span={4}>
                <div>{proxyData.username}</div>
            </Col>

            <Col span={4} style={{ padding: 10 }}>
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{proxyData.password}</div>
            </Col>

            <Col span={4}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
                    <svg height="6" width="6">
                        <circle cx="3" cy="3" r="3" fill={statusColor(getStatus(store))} />
                    </svg>
                    <span style={{ color: statusColor(getStatus(store)), fontWeight: 500, marginLeft: 10 }}>{getStatus(store)}</span>
                </div>
            </Col>

            <Col span={4}>
                <div style={{ display: 'flex', justifyContent: 'center', marginLeft: '5px' }}>
                    <div>{runButton()}</div>
                    <div>
                        <Button onClick={deleteIndividual} style={deleteButton} icon={<DeleteFilled />} size="small" />
                    </div>
                </div>
            </Col>
        </Row>
    );
};

export default ProxyRow;
