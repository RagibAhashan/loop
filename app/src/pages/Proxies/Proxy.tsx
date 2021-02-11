// import styles from './sidebar.module.css';
import { DeleteFilled, PlayCircleFilled, StopFilled } from '@ant-design/icons';
import { Button, Col, Row } from 'antd';
import React from 'react';

const startButton = {
    border: 'none',
    borderRadius: '100%',
    color: 'green',
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

const statusColor = (level: string) => {
    switch (level) {
        case 'idle':
            return 'yellow';
        case 'info':
            return 'white';
        case 'success':
            return 'green';
        case 'error':
            return 'red';
        case 'cancel':
            return '#f7331e';
    }
};

const ProxyRow = (props: any) => {
    const {
        proxy,
        style,
    } = props;


    const runButton = () => {
        return proxy.status === 'Testing' ? (
            <Button
                onClick={() => {
                    // stopTask();
                }}
                style={stopButton}
                icon={<StopFilled />}
                size="small"
            />
        ) : (
            <Button
                onClick={() => {
                    props.testIndividual(proxy)
                }}
                style={startButton}
                icon={<PlayCircleFilled />}
                size="small"
            />
        );
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
                <div>{proxy.ip}</div>
            </Col>

            <Col span={4}>
                <div>{ proxy.port}</div>
            </Col>

            <Col span={4}>
                <div>{proxy.username}</div>
            </Col>

            <Col span={4} style={{ padding: 10 }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{proxy.password}</div>
            </Col>

            <Col span={4}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
                    <svg height="6" width="6">
                        <circle cx="3" cy="3" r="3" fill={statusColor('success')} />
                    </svg>
                    <span style={{ color: statusColor('success'), fontWeight: 500, marginLeft: 10 }}>{proxy.status}</span>
                </div>
            </Col>

            <Col span={4}>
                <div style={{ display: 'flex', justifyContent: 'center', marginLeft: '5px' }}>
                    <div>{runButton()}</div>
                    <div>
                        <Button
                            onClick={() => {
                                props.deleteIndividual(proxy);
                            }}
                            style={deleteButton}
                            icon={<DeleteFilled />}
                            size="small"
                        />
                    </div>
                </div>
            </Col>
        </Row>
    );
};

export default ProxyRow;
