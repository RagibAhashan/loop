import { Button, Col, DatePicker, Form, Input, Row, Select, TimePicker } from 'antd';
import React, { useState, useEffect, useCallback } from 'react';
import Bot from './bot';
const { uuid } = require('uuidv4');

const { Option } = Select;

const format = 'HH:mm';

const colStyle = {
    margin: 'auto',
};

const botStyle = {
    backgroundColor: 'black',
    marginLeft: '20px',
    marginRight: '20px',
    marginTop: '10px',
    height: '45px',
    borderRadius: '6px',
};

const input_field = {
    height: '39px',
    // borderRadius: '6px',
    // backgroundColor: '#282C31',
    // border: '1px solid #858C94',
};

function onChange(date: any, dateString: any) {
    console.log(date, dateString);
}

const allSizes: any[] = [];
for (let i = 4; i < 14; i += 0.5) {
    allSizes.push(
        <Option value={i.toString()} key={i.toString()}>
            {i.toString()}
        </Option>,
    );
}


const validateMessages = {
    required: 'Required!',
    types: {
        email: '${name} is not a valid email!',
        number: '${name} is not a valid number!',
    },
    number: {
        range: '${name} must be 3 digits or less.',
    },
};


const new_obj = {
    uuid:           '',
    store:          'store',
    keyword:        'keyword',
    startdate:      'startdate',
    starttime:      'starttime',
    profile:        'profile',
    sizes:          'sizes',
    proxyset:       'proxyset',
    quantity:       'quantity',
    monitordelay:   'monitordelay',
    retrydelay:     'retrydelay',
}

const TaskComponent = (props: any) => {
    const [jobs, setJobs] = useState([new_obj]);
    const [proxies, setProxies] = useState([]);
    const [selectedProxies, setSelectedProxies] = useState(new Map<string, Array<string>>());
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({} as any), []);

    useEffect(() => {
        setProxies(getProxies());
    }, []);


    const getProxies = (): any => {
        const proxiesOptions: any = []
        let prox: any = localStorage.getItem('proxies');
        if (prox) {
            prox = JSON.parse(prox);
            if (prox) {
                let hm = new Map<string, Array<string>>();
                prox.map((set: any) => {
                    hm.set(set[0], set[1]);
                    proxiesOptions.push({
                        label: `${set[0]} (${set[1].length} proxies)`,
                        value: `${set[0]}`,
                    });
                });
                setSelectedProxies(hm);
            }
        }
        
        return proxiesOptions;
    }


    const deleteProxy = (uuid: string) => {
        console.log('Delete this: ', uuid)

        for(let i=0; i < jobs.length; i++) {
            if(jobs[i].uuid === uuid) {
                jobs.splice(i,i);
                forceUpdate();
                return;
            }
        }
    }


    const Headers = () => {
        return (
            <Row style={botStyle}>
                    <Col span={2} style={{ margin: 'auto', marginLeft: '10px' }}>
                        Store
                    </Col>

                    <Col span={3} style={colStyle}>
                        Product
                    </Col>

                    <Col span={2} style={colStyle}>
                        Size
                    </Col>

                    <Col span={3} style={colStyle}>
                        Profile
                    </Col>

                    <Col span={7} style={colStyle}>
                        Proxy
                    </Col>

                    <Col span={3} style={colStyle}>
                        Status
                    </Col>

                    <Col span={3} style={colStyle}>
                        Actions
                    </Col>
                </Row>
        )
    }

    const onFinish = (data: any) => {
        let temp = jobs;

        let selected_proxies = selectedProxies.get(data['task'].proxyset)
        console.log('selected_proxies', selected_proxies)
        if (temp !== null) {
            for(let i =0; i < Number(data['task'].quantity); i++) {
                for(let j=0; j < data['task'].sizes.length; j++) {
                    selectedProxies.get(data['task'].proxyset)?.map((proxy_selected) => {
                        temp.push({
                            uuid:           uuid(),
                            store:          'Footlocker',
                            keyword:        data['task'].keyword,
                            startdate:      data['task'].startdate,
                            starttime:      data['task'].starttime,
                            profile:        data['task'].profile,
                            sizes:          data['task'].sizes[j],
                            proxyset:       proxy_selected,
                            quantity:       data['task'].quantity,
                            monitordelay:   data['task'].monitordelay,
                            retrydelay:     data['task'].retrydelay,
                        });
                    });
                }
            }
            setJobs(temp);
        }
        forceUpdate()
    }


    const deleteAllTasks = () => {
        setJobs([new_obj])
        forceUpdate()
    }


    return (
        <div>
            <Form style={{ height: '20vh' }} onFinish={onFinish} validateMessages={validateMessages}>
                <Row>
                    <Col style={{ width: '320px' }}>
                        <Form.Item name={['task', 'keyword']} rules={[{ required: true }]}>
                            <Input placeholder="keyword" style={input_field} />
                        </Form.Item>
                    </Col>

                    <Col style={{ marginLeft: '50px', width: '140px' }}>
                        <Form.Item name={['task', 'startdate']} rules={[{ required: true }]}>
                            <DatePicker onChange={onChange} style={input_field} />
                        </Form.Item>
                    </Col>

                    <Col style={{ marginLeft: '30px', width: '120px' }}>
                        <Form.Item name={['task', 'starttime']} rules={[{ required: true }]}>
                            <TimePicker style={input_field} format={format} />
                        </Form.Item>
                    </Col>
                    <Col style={{ marginLeft: '30px', width: '210px' }}>
                        <Form.Item name={['task', 'profile']} rules={[{ required: true }]}>
                            <Input placeholder="Profile Set" style={input_field} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col style={{ width: '320px' }}>
                        <Form.Item name={['task', 'sizes']} rules={[{ required: true }]}>
                            <Select placeholder="Size" style={input_field} mode="multiple" allowClear>
                                {allSizes}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col style={{ marginLeft: '50px', width: '290px' }}>
                        <Form.Item name={['task', 'proxyset']} rules={[{ required: true }]}>
                            <Select placeholder="Proxy Set" allowClear options={proxies}></Select>
                        </Form.Item>
                    </Col>

                    <Col style={{ marginLeft: '30px', width: '210px' }}>
                        <Form.Item name={['task', 'quantity']} rules={[{ required: true }]}>
                            <Input placeholder="Quantity" style={input_field} type='number'/>
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col style={{ width: '320px' }}>
                        <Form.Item name={['task', 'monitordelay']} rules={[{ required: true }]}>
                            <Input placeholder="Monitor delay in milliseconds" style={input_field} type="number" />
                        </Form.Item>
                    </Col>

                    <Col style={{ marginLeft: '50px', width: '290px' }}>
                        <Form.Item name={['task', 'retrydelay']} rules={[{ required: true }]}>
                            <Input placeholder="Retry delay" style={input_field} type="number" />
                        </Form.Item>
                    </Col>

                    <Col style={{ marginLeft: '30px' }}>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                style={{
                                    backgroundColor: '#000000',
                                    // backgroundColor: '#282C31',
                                    color: '#F0A30D',
                                    height: '39px',
                                    width: '210px',
                                    // borderRadius: '6px',
                                    borderColor: '#F0A30D',
                                }}
                            >
                                Add tasks
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>

            <Row>
                <Col span={3} style={{ marginLeft: '10px' }}>
                    <Button style={{ height: '40px', width: '100px', color: 'green', borderColor: 'green', border: '1px solid', fontSize: '14px' }}>
                        Run all
                    </Button>
                </Col>
                <Col span={3}>
                    <Button style={{ height: '40px', width: '100px' }} danger>
                        {' '}
                        Stop all{' '}
                    </Button>
                </Col>
                <Col span={13}></Col>
                <Col span={3}>
                    <Button style={{ height: '40px', width: '170px' }} type="primary" danger
                        onClick={() => deleteAllTasks()}
                    >
                        Delete all
                    </Button>
                </Col>
            </Row>

            <div
                style={{
                    border: '1px solid #4D4D4D',
                    borderRadius: '6px',
                    backgroundColor: '#282C31',
                    width: '100%',
                    marginTop: '10px',
                    height: '60vh',
                }}
            >
                <Headers />

                <div style={{
                    overflow: 'auto',
                    height: '53vh',
                }}>

                    {jobs.map((botTask) => (
                        <Bot
                            uuid={botTask.uuid}
                            store={botTask.store}
                            keyword={botTask.keyword}
                            startdate={botTask.startdate}
                            starttime={botTask.starttime}
                            profile={botTask.profile}
                            sizes={botTask.sizes}
                            proxyset={botTask.proxyset}
                            monitordelay={botTask.monitordelay}
                            retrydelay={botTask.retrydelay}
                            deleteProxy={deleteProxy}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TaskComponent;
