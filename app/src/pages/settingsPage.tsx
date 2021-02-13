import React, { useState } from 'react';
import { Button, Input, Row, Col, Form } from 'antd';
import axios from 'axios';
const { ipcRenderer } = window.require('electron');

const SettingsPage = () => {
    const [discord, setDiscord] = useState('');
    const [first, setFirst] = useState('');
    const [LICENSE_KEY, setLicenseKey] = useState('');

    const getID = async () => {
        const SYSTEM_KEY = await ipcRenderer.invoke('GET-SYSTEM-ID');
        try {
            const post = await axios.post('http://localhost:4000/user/activatekey/', {
                L_KEY: LICENSE_KEY,
                SYSTEM_KEY: SYSTEM_KEY,
            });
            console.log(post);
        } catch (error) {
            console.log(error);
        }
        return SYSTEM_KEY;
    };

    // const { credit_card, cvc, discord_id, email, first_name, last_name, CC_Month, CC_Year } = req.body;

    const registerAccount = async (data: any) => {
        try {
            const post = await axios.post('http://localhost:4000/user/register/', {
                credit_card: data.credit_card,
                cvc: data.cvc,

                discord_id: data.discord_id,
                email: data.email,

                first_name: data.first_name,
                last_name: data.last_name,

                CC_Month: data.CC_Month,
                CC_Year: data.CC_Year,
            });
            console.log(post);
            window.alert(`LICENSE_KEY: ${post.data['LICENSE_KEY']}`);
        } catch (error) {
            console.error(error);
            window.alert(`This user already exist or we have already sent you an email!`);
        }
    };

    return (
        <div style={{ backgroundColor: '#212427', height: '100vh', padding: '5%' }}>
            <Form onFinish={registerAccount}>
                <Form.Item name={'credit_card'} rules={[{ required: true }]}>
                    <Input
                        placeholder={'credit_card'}
                        onChange={(e) => {
                            // setEmail((prev) => (prev = e.target.value));
                        }}
                    />
                </Form.Item>

                <Form.Item name={'cvc'} rules={[{ required: true }]}>
                    <Input
                        placeholder={'cvc'}
                        onChange={(e) => {
                            // setEmail((prev) => (prev = e.target.value));
                        }}
                    />
                </Form.Item>

                <Form.Item name={'discord_id'} rules={[{ required: true }]}>
                    <Input
                        placeholder={'discord_id'}
                        onChange={(e) => {
                            // setEmail((prev) => (prev = e.target.value));
                        }}
                    />
                </Form.Item>

                <Form.Item name={'email'} rules={[{ required: true }]}>
                    <Input
                        placeholder={'email'}
                        onChange={(e) => {
                            // setEmail((prev) => (prev = e.target.value));
                        }}
                    />
                </Form.Item>

                <Form.Item name={'first_name'} rules={[{ required: true }]}>
                    <Input
                        placeholder={'first_name'}
                        onChange={(e) => {
                            // setEmail((prev) => (prev = e.target.value));
                        }}
                    />
                </Form.Item>
                <Form.Item name={'last_name'} rules={[{ required: true }]}>
                    <Input
                        placeholder={'last_name'}
                        onChange={(e) => {
                            // setEmail((prev) => (prev = e.target.value));
                        }}
                    />
                </Form.Item>
                <Form.Item name={'CC_Month'} rules={[{ required: true }]}>
                    <Input
                        placeholder={'CC_Month'}
                        onChange={(e) => {
                            // setEmail((prev) => (prev = e.target.value));
                        }}
                    />
                </Form.Item>
                <Form.Item name={'CC_Year'} rules={[{ required: true }]}>
                    <Input
                        placeholder={'CC_Year'}
                        onChange={(e) => {
                            // setEmail((prev) => (prev = e.target.value));
                        }}
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                        Register account
                    </Button>
                </Form.Item>
            </Form>

            <br />
            <br />
            <br />

            <Form onFinish={getID}>
                <Input placeholder="LICENSE KEY" name={'LICENSE_KEY'} onChange={(e) => setLicenseKey(e.target.value)} />
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                        Activate License Key
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default SettingsPage;
