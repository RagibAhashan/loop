import { DeleteFilled } from '@ant-design/icons';
import { ProxySetChannel } from '@core/ipc-channels';
import { ProxyViewData } from '@core/proxy';
import { ProxySetViewData } from '@core/proxyset';
import { Button, Col, Row } from 'antd';
import React from 'react';

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

interface Props {
    proxy: ProxyViewData;
    style: any;
    selectedProxySet: ProxySetViewData;
}
// Named it ProxyComponent to avoid name collision with the Proxy class
const ProxyComponent: React.FunctionComponent<Props> = (props) => {
    const { proxy, style, selectedProxySet } = props;

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

    const handleDeleteProxy = () => {
        window.ElectronBridge.send(ProxySetChannel.removeProxyFromSet, selectedProxySet.id, [proxy.id]);
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
                <div>{proxy.hostname}</div>
            </Col>

            <Col span={4}>
                <div>{proxy.port}</div>
            </Col>

            <Col span={4}>
                <div>{proxy.user}</div>
            </Col>

            <Col span={4} style={{ padding: 10 }}>
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{proxy.password}</div>
            </Col>

            <Col span={4}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
                    <svg height="6" width="6">
                        <circle cx="3" cy="3" r="3" fill={statusColor('idle')} />
                    </svg>
                    <span style={{ color: statusColor('idle'), fontWeight: 500, marginLeft: 10 }}> Status [TODO] </span>
                </div>
            </Col>

            <Col span={4}>
                <div style={{ display: 'flex', justifyContent: 'center', marginLeft: '5px' }}>
                    <div>Run [TODO]</div>
                    <div>
                        <Button style={deleteButton} icon={<DeleteFilled />} size="small" onClick={handleDeleteProxy} />
                    </div>
                </div>
            </Col>
        </Row>
    );
};

export default ProxyComponent;
