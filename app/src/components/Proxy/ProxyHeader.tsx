import { Col, Row } from 'antd';
import React from 'react';

const ProxyHeaders: React.FunctionComponent = () => {
    return (
        <Row
            style={{
                fontSize: '18px',
                textAlign: 'center',
                margin: '10px 0px 5px 0px',
                backgroundColor: 'rgb(38 39 43)',
                borderRadius: 5,
                padding: 5,
            }}
        >
            <Col span={4}>IP</Col>
            <Col span={4}>Port</Col>
            <Col span={4}>Username</Col>
            <Col span={4}>Password</Col>
            <Col span={4}>Status</Col>
            <Col span={4}>Actions</Col>
        </Row>
    );
};

export default ProxyHeaders;
