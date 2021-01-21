import React, { useState } from 'react';
import { Button, Row, Col } from 'antd';
import './storeButton.css'

const buttonStyle = {
    backgroundColor: '#212427',
    width:'170px',
    height: '50px',
    marginLeft:'15px',
    marginRight:'15px',
    marginTop: '15px'
}


const StoreButton = (props: any) => {
    const { name } = props;

    return (
        <Row>
            <Col span={12}>
                <Button style={buttonStyle}>
                    {name}
                </Button>
            </Col>
        </Row>
    )
}


export default StoreButton;