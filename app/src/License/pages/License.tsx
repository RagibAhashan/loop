import React, { useState } from 'react';
import { Button, Input, Row, Col, Form } from 'antd';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
const { ipcRenderer } = window.require('electron');

const License = withRouter(({ history }) => {
    const [LICENSE_KEY, setLicenseKey] = useState('');

    const getID = async () => {
        const SYSTEM_KEY = await ipcRenderer.invoke('GET-SYSTEM-ID');
        history.push('/app/profiles');
        // try {
        //     const post = await axios.post('http://localhost:4000/user/activatekey/', {
        //         L_KEY: LICENSE_KEY,
        //         SYSTEM_KEY: SYSTEM_KEY,
        //     });
        //     console.log(post);
        // } catch (error) {
        //     console.log(error);
        // }
        return SYSTEM_KEY;
    };

    return (
        <div style={{ backgroundColor: '#212427', height: '100vh', padding: '5%' }}>
            <Form onFinish={getID}>
                <Input placeholder="LICENSE KEY" name={'LICENSE_KEY'} onChange={(e) => setLicenseKey(e.target.value)} />
                <br />
                <br />
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                        Activate License Key
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
});

export default License;
