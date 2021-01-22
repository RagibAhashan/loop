import React from 'react';
import { Row, Col, Button, Space } from 'antd';
// import styles from './sidebar.module.css';
import {
    EditOutlined,
    DeleteOutlined,
    DoubleRightOutlined
  } from '@ant-design/icons';

const botStyle = {
    backgroundColor: '#212427',
    marginLeft: '20px',
    marginRight: '20px',
    marginTop: '10px',
    height: '45px',
    borderRadius: '6px',
}

const colStyle = {
    margin:'auto'
}

const editButton = {
    border:'none',
    borderRadius: '100%',
    backgroundColor: 'orange'
}

const startButton = {
    border:'none',
    borderRadius: '100%',
    backgroundColor: 'green'
}

const deleteButton = {
    border:'none',
    borderRadius: '100%',
    backgroundColor: 'red'
}

const Bot = (props: any) => {
    const { store, product, size, profile, ip } = props;


    return (
        <Row style={botStyle}>
            <Col span={3} style={{margin:'auto', marginLeft: '10px'}}>
                {store}
            </Col>

            <Col span={3} style={colStyle}>
                {product}
            </Col>

            <Col span={2} style={colStyle}>
                {size}
            </Col>

            <Col span={3} style={colStyle}>
                {profile}
            </Col>

            <Col span={4} style={colStyle}>
                {ip}
            </Col>

            <Col span={4} style={colStyle}>
                Adding to cart
            </Col>

            <Col span={4} style={colStyle}>
                <Space>
                    <Button style={startButton} icon={<DoubleRightOutlined />} />
                    <Button style={editButton} icon={<EditOutlined  />} />
                    <Button style={deleteButton} icon={<DeleteOutlined />} />
                </Space>
            </Col>


        </Row>
    )
}


export default Bot;