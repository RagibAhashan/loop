import { Button, Form, Input, Spin } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { PROFILE_ROUTE, SERVER_ENDPOINT } from '../../common/Constants';
const { ipcRenderer } = window.require('electron');

const ActivateLicense = (props: any) => {
    const { history } = props;
    const [LICENSE_KEY, setLicenseKey] = useState('');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState(201);
    const [loading, setLoading] = useState(false);

    const getID = async () => {
        const SYSTEM_KEY = await ipcRenderer.invoke('GET-SYSTEM-ID');
        try {
            setLoading((prev) => (prev = true));
            const post = await axios.post(`${SERVER_ENDPOINT}/systenbind`, {
                LICENSE_KEY: LICENSE_KEY,
                SYSTEM_KEY: SYSTEM_KEY
            });
            console.log(post.status);
            setCode((prev) => (prev = 200));
            // history.push(PROFILE_ROUTE);
            setLoading((prev) => (prev = false));
        } catch (error) {
            setLoading((prev) => (prev = false));

            switch ((error as any).toString()) {
                case 'Error: Request failed with status code 409': {
                    setCode((prev) => (prev = 409));

                    break;
                }
                case 'Error: Request failed with status code 404': {
                    setCode((prev) => (prev = 404));
                    break;
                }
                default:
                    setCode((prev) => (prev = 500));
                    break;
            }
        }
    };

    return (
        <div>
            <Spin spinning={loading}>
                <div style={{ backgroundColor: '#212427', height: '100vh', padding: '5%' }}>
                    <Form onFinish={getID} style={{ width: '50%' }}>
                        <Form.Item name="License key" rules={[{ required: true }]}>
                            <Input placeholder="LICENSE KEY" name={'LICENSE_KEY'} onChange={(e) => setLicenseKey(e.target.value)} />
                        </Form.Item>
                        <small style={{ color: 'red', marginTop: '-100px' }}>
                            {code === 409 ? 'This email is already registered!' : ''}
                            {code === 404 ? 'This email was not found' : ''}
                            {code === 500 ? 'An error has occured. Please try again!' : ''}
                        </small>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{ width: '100%' }} disabled={LICENSE_KEY === ''}>
                                Activate License Key
                            </Button>
                        </Form.Item>

                        <Button type="primary" style={{ width: '1000px' }} danger onClick={() => history.push(PROFILE_ROUTE)}>
                            Bypass
                        </Button>
                    </Form>
                </div>
            </Spin>
        </div>
    );
};

export default ActivateLicense;
