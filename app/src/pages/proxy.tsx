import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Input, Button, Divider, Popover, Card, message } from 'antd';
import { MinusCircleTwoTone, PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const ProxyPage = (props: any) => {
    const [proxies, setProxies] = useState(new Map<string, []>()); // name -> proxies
    const [proxyInput, setProxyInputs] = useState(new Map<number, []>()); // new sets being inputted by user (input_key -> nProxies)

    useEffect(() => {
        let db_proxies: any = localStorage.getItem('proxies');
        if (!db_proxies) {
            db_proxies = new Map();
            localStorage.setItem('proxies', JSON.stringify(Array.from(db_proxies.entries())));
        } else {
            let tempProxyMap = new Map();
            for (let i = 0; i < JSON.parse(db_proxies).length; i++) {
                tempProxyMap.set(JSON.parse(db_proxies)[i][0], JSON.parse(db_proxies)[i][1]);
            }
            setProxies(tempProxyMap);
        }
    }, []);

    const onFinish = (values: any) => {
        for (let i = 0; i < values.proxies.length; i++) {
            if (proxies.get(values.proxies[i].name)) {
                message.error(`Proxy Set "${values.proxies[i].name}" already exists!`);
                return null;
            }
            setProxies(proxies.set(values.proxies[i].name, values.proxies[i].proxy.split(' ')));
        }

        localStorage.setItem('proxies', JSON.stringify(Array.from(proxies.entries())));
    };

    const onDeleteSet = (name: any) => {
        proxies.delete(name.toString());
        setProxies(proxies);
        localStorage.setItem('proxies', JSON.stringify(Array.from(proxies.entries())));
        forceUpdate();
    };

    const content = (values: any, name: any) => (
        <div>
            <Row style={{ textAlign: 'center' }}>
                <Col>
                    <Divider style={{ textAlign: 'center', width: 300 }}> Name </Divider>
                    <p> {name} </p>
                </Col>
            </Row>
            <Row style={{ textAlign: 'center' }}>
                <Col>
                    <Divider style={{ textAlign: 'center', width: 300 }}> Proxies </Divider>
                    {showProxiesPopup(values)}
                    <Button
                        type="dashed"
                        style={{ marginTop: 10 }}
                        htmlType="submit"
                        onClick={() => {
                            downloadProxies(values, name);
                        }}
                    >
                        {' '}
                        Download full list{' '}
                    </Button>
                </Col>
            </Row>
            <Row style={{ textAlign: 'center' }}>
                <Col>
                    <Divider style={{ textAlign: 'center', width: 300 }}> No. of Proxies </Divider>
                    <p> {values.length} </p>
                </Col>
            </Row>
        </div>
    );

    const downloadProxies = (values: [], name: string) => {
        const proxyFileName = name + 'Proxies.txt';
        const valuesNewLine = [values.join('\r\n')];
        const element = document.createElement('a');
        const file = new Blob(valuesNewLine, { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = proxyFileName;
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    };

    const showProxiesPopup = (proxies: []) => {
        const PROXIES_TO_SHOW = 10;
        const proxiesToShow = proxies.slice(0, PROXIES_TO_SHOW);
        return proxiesToShow.map((value) => {
            return <div> {value} </div>;
        });
    };

    const ShowProxies = (proxies: Map<string, []>) => {
        let proxyArray = Array.from(proxies, ([name, proxies]) => ({ name, proxies }));
        if (!proxies.size) return <h1> No Sets Found. </h1>;
        return proxyArray.map((value) => {
            const ex = proxies.get(value.name) as Array<string>;
            return (
                <Popover content={content(value.proxies, value.name)} placement="right">
                    <Card
                        size="small"
                        title={value.name}
                        extra={<Button type="link" danger icon={<DeleteOutlined />} onClick={() => onDeleteSet(value.name)} />}
                        style={{ width: 200, height: 140, margin: 3 }}
                    >
                        <p> {`Preview: ${ex[0].substr(0, 12)}...`} </p>
                        <p> {`No. of Proxies: ${ex.length}`} </p>
                    </Card>
                </Popover>
            );
        });
    };

    const realTimeNoProxies = (values: any, currentInputKey: number) => {
        setProxyInputs(proxyInput.set(currentInputKey, values.target.value.split(' ')));
    };

    function useForceUpdate() {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [value, setValue] = useState(0); // integer state
        return () => setValue((value) => value + 1); // update the state to force render
    }
    const forceUpdate = useForceUpdate();

    return (
        <Form name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off" style={{ padding: 24 }}>
            <Row>
                <Col span={22} style={{ marginLeft: 10 }}>
                    {' '}
                    <Divider> My Sets </Divider>{' '}
                </Col>
                {ShowProxies(proxies)}
            </Row>
            <Row>
                <Col span={5} style={{ marginRight: 10 }}>
                    {' '}
                    <Divider> Set Name </Divider>{' '}
                </Col>
                <Col span={12} style={{ marginRight: 10 }}>
                    {' '}
                    <Divider> Proxies </Divider>{' '}
                </Col>
                <Col span={5} style={{ marginRight: 10 }}>
                    {' '}
                    <Divider> No. of Proxies </Divider>{' '}
                </Col>
                <Col span={2} style={{ marginRight: 10 }}>
                    {' '}
                </Col>
            </Row>
            <Form.List name="proxies">
                {(fields, { add, remove }) => (
                    <>
                        {fields.map((field) => (
                            <Row key={field.key}>
                                <Col span={5} style={{ marginRight: 10 }}>
                                    <Form.Item
                                        {...field}
                                        name={[field.name, 'name']}
                                        fieldKey={[field.fieldKey, 'name']}
                                        style={{ width: 'auto' }}
                                        rules={[{ required: true, message: 'Missing set name' }]}
                                    >
                                        <Input placeholder="Set Name" />
                                    </Form.Item>
                                </Col>
                                <Col span={12} style={{ marginRight: 10 }}>
                                    <Form.Item
                                        {...field}
                                        name={[field.name, 'proxy']}
                                        fieldKey={[field.fieldKey, 'proxy']}
                                        style={{ width: 'auto' }}
                                        rules={[{ required: true, message: 'Missing proxies' }]}
                                    >
                                        <Input
                                            onChange={(values) => {
                                                realTimeNoProxies(values, field.fieldKey);
                                                forceUpdate();
                                            }}
                                            style={{ display: 'flex' }}
                                            placeholder="Copy Paste your list of proxies"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={5} style={{ marginRight: 10 }}>
                                    {/* value={proxies.size? proxies.get(keys.get(field.fieldKey)).length : 0} */}
                                    <Input
                                        style={{ display: 'flex', textAlign: 'center' }}
                                        value={proxyInput.get(field.fieldKey)?.length}
                                        disabled={true}
                                    />
                                </Col>
                                <Col span={1}>
                                    <MinusCircleTwoTone
                                        style={{ marginTop: 10 }}
                                        onClick={() => {
                                            remove(field.name);
                                        }}
                                    />
                                </Col>
                            </Row>
                        ))}
                        <Row>
                            <Col span={5} style={{ marginRight: 10 }}>
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                                        New Set
                                    </Button>
                                </Form.Item>
                            </Col>
                            <Col span={12} style={{ marginRight: 10 }}>
                                {' '}
                            </Col>

                            <Col span={5}>
                                <Form.Item>
                                    <Button
                                        style={{ float: 'right' }}
                                        onClick={() => {}}
                                        disabled={fields.length === 0}
                                        type="primary"
                                        htmlType="submit"
                                    >
                                        Comfirm Sets
                                    </Button>
                                </Form.Item>
                            </Col>
                            <Col span={1}></Col>
                        </Row>
                    </>
                )}
            </Form.List>
        </Form>
    );
};

export default ProxyPage;
