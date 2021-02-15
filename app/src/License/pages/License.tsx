import { Button, Form, Input, Spin } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { PROFILE_ROUTE } from '../../common/Constants';

const { ipcRenderer } = window.require('electron');

const License = withRouter(({ history }) => {
    const [LICENSE_KEY, setLicenseKey] = useState('');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState(201);
    const [loading, setLoading] = useState(false);

    history.push(PROFILE_ROUTE);

    function useForceUpdate() {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [value, setValue] = useState(0); // integer state
        return () => setValue((value) => value + 1); // update the state to force render
    }
    const forceUpdate = useForceUpdate();

    const getID = async () => {
        const SYSTEM_KEY = await ipcRenderer.invoke('GET-SYSTEM-ID');
        try {
            setLoading((prev) => (prev = true));
            const post = await axios.post('http://localhost:4000/user/activatekey/', {
                L_KEY: LICENSE_KEY,
                SYSTEM_KEY: SYSTEM_KEY,
                email: email,
            });
            console.log(post.status);
            setCode((prev) => (prev = 201));
            history.push(PROFILE_ROUTE);
        } catch (error) {
            if (error.toString() === 'Error: Request failed with status code 409') {
            }

            switch (error.toString()) {
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

        setLoading((prev) => (prev = false));
        forceUpdate();
        return SYSTEM_KEY;
    };

    return (
        <Spin spinning={loading}>
            <div style={{ backgroundColor: '#212427', height: '100vh', padding: '5%' }}>
                <Form onFinish={getID} style={{ width: '50%' }}>
                    <Form.Item name="License key" rules={[{ required: true }]}>
                        <Input placeholder="LICENSE KEY" name={'LICENSE_KEY'} onChange={(e) => setLicenseKey(e.target.value)} />
                    </Form.Item>
                    <small style={{ color: 'red', marginTop: '-100px' }}>
                        {code === 409 ? 'This email is already registered!' : ''}
                        {code === 404 ? 'This email was not found' : ''}
                    </small>

                    <Form.Item>
                        <Input
                            placeholder="Email"
                            name={'email'}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (e.target.value === '-dev') {
                                    history.push(PROFILE_ROUTE);
                                }
                            }}
                            style={code !== 201 ? { color: 'red', borderColor: 'red' } : {}}
                        />
                        Temporary-- type "-dev" to bypass license key
                    </Form.Item>
                    <br />
                    <br />
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ width: '100%' }} disabled={email === '' || LICENSE_KEY === ''}>
                            Activate License Key
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </Spin>
    );
});

export default License;
