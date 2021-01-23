// import styles from './sidebar.module.css';
import { DeleteOutlined, DoubleRightOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Col, Row, Space } from 'antd';
import React, { useState, useCallback, useEffect } from 'react';

const botStyle = {
    backgroundColor: '#212427',
    marginLeft: '20px',
    marginRight: '20px',
    marginTop: '10px',
    height: '45px',
    borderRadius: '6px',
};

const colStyle = {
    margin: 'auto',
};

const editButton = {
    border: 'none',
    borderRadius: '100%',
    backgroundColor: 'orange',
};

const startButton = {
    border: 'none',
    borderRadius: '100%',
    backgroundColor: 'green',
};

const deleteButton = {
    border: 'none',
    borderRadius: '100%',
    backgroundColor: 'red',
};


/**
 *  store:          'Footlocker',
    keyword:        data['task'].keyword,
    startdate:      data['task'].startdate,
    starttime:      data['task'].starttime,
    profile:        data['task'].profile,
    sizes:          data['task'].sizes[j],
    proxyset:       data['task'].proxyset[k],
    quantity:       data['task'].quantity,
    monitordelay:   data['task'].monitordelay,
    retrydelay:     data['task'].retrydelay,
*/
const Bot = (props: any) => {
    const {
        uuid,
        store,
        keyword,
        startdate,
        starttime,
        profile,
        sizes,
        proxyset,
        quantity,
        monitordelay,
        retrydelay,
        deleteProxy
    } = props;

    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({} as any), []);


    const [_store, setStore] = useState(store);

    useEffect(() => {
        
    })

    const startTask = () => {
        console.log('start task from', store);
    };

    return (
        <Row style={botStyle}>
            <Col span={2} style={{ margin: 'auto', marginLeft: '10px' }}>
                {_store}
            </Col>

            <Col span={3} style={colStyle}>
                {keyword}
            </Col>

            <Col span={2} style={colStyle}>
                {sizes}
            </Col>

            <Col span={3} style={colStyle}>
                {profile}
            </Col>

            <Col span={7} style={colStyle}>
                {proxyset}
            </Col>

            <Col span={3} style={colStyle}>
                Adding to cart
            </Col>

            <Col span={3} style={colStyle}>
                <Space>
                    <Button
                        onClick={() => {
                            startTask();
                        }}
                        style={startButton}
                        icon={<DoubleRightOutlined />}
                    />
                    <Button style={editButton} icon={<EditOutlined />} />
                    <Button
                        onClick={() => {
                            deleteProxy(uuid)
                        }}
                        style={deleteButton} icon={<DeleteOutlined />} 
                    />
                </Space>
            </Col>
        </Row>
    );
};

export default Bot;
