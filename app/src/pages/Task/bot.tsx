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
        deleteBot
    } = props;

    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({} as any), []);

    const startTask = () => {
        console.log('start task from', store);
    };

    useEffect(() => {
        let sizes_string = sizes[0];
        if (sizes.length >1){

            for(let i = 1; i< sizes.length; i++) {
                sizes_string += ' - ' + sizes[i]
            }
        }
        console.log(sizes_string)
    }, [])

    const allSizes = () => {
        let sizes_string = sizes[0];
        if (sizes.length >1){

            for(let i = 1; i< sizes.length; i++) {
                sizes_string += ' - ' + sizes[i]
            }
        }
        console.log(sizes_string)
        return sizes_string;
    }

    return (
        <Row style={botStyle}>
            <Col span={2} style={{ margin: 'auto', marginLeft: '10px' }}>
                {'Footlocker'}
            </Col>

            <Col span={3} style={colStyle}>
                {keyword}
            </Col>

            <Col span={2} style={colStyle}>
                {proxyset}
            </Col>

            <Col span={3} style={colStyle}>
                {profile}
            </Col>

            <Col span={7} style={colStyle}>
                {allSizes()}
            </Col>

            <Col span={3} style={colStyle}>
                <p style={{color:'yellow', margin:'auto'}}>
                    idle
                </p>
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
                            deleteBot(uuid)
                        }}
                        style={deleteButton} icon={<DeleteOutlined />} 
                    />
                </Space>
            </Col>
        </Row>
    );
};

export default Bot;
