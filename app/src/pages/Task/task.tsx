import { Button, Col, Divider, Row, Select } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Bot from './bot';
import NewTaskModal from './newTaskModal';
const { ipcRenderer } = window.require('electron');

const { v4: uuid } = require('uuid');

const { Option } = Select;

const format = 'HH:mm';

const colStyle = {
    margin: 'auto',
};

const buttonStyle: React.CSSProperties = {
    width: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
};

const botStyle = {
    // backgroundColor: 'black',
    marginLeft: '20px',
    marginRight: '20px',
    marginTop: '10px',
    marginBottom: '0px',
    height: '15px',
    borderRadius: '6px',
    color: 'orange',
    fontSize: '18px',
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

interface Job {
    uuid: string;
    store: string;
    keyword: string;
    startdate: string;
    starttime: string;
    profile: string;
    sizes: Array<string>;
    proxyset: string;
    quantity: string;
    monitordelay: number;
    retrydelay: number;
}

const Store = () => {
    const [jobs, setJobs] = useState(new Array<Job>());
    const [proxies, setProxies] = useState([]);
    const [profiles, setProfiles] = useState([]);
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({} as any), []);

    useEffect(() => {
        setProxies(getProxies());
        setProfiles(getProfiles());
    }, []);

    const getProfiles = () => {
        const profilesTemp: any = [];
        let profs: any = localStorage.getItem('profiles');

        if (profs) {
            profs = JSON.parse(profs);
            if (profs) {
                profs.map((p: any) => {
                    profilesTemp.push({
                        label: p['profile'],
                        value: p,
                    });
                });
            }
        }

        return profilesTemp;
    };

    const getProxies = (): any => {
        const proxiesOptions: any = [{ label: 'localhost', value: 'localhost' }];
        let prox: any = localStorage.getItem('proxies');
        if (prox) {
            prox = JSON.parse(prox);
            if (prox) {
                prox.map((set: any) => {
                    proxiesOptions.push({
                        label: `${set[0]} (${set[1].length} proxies)`,
                        value: `${set[0]}`,
                    });
                });
            }
        }
        return proxiesOptions;
    };

    const deleteBot = (uuid: string) => {
        console.log('Delete this: ', uuid);

        for (let i = 0; i < jobs.length; i++) {
            if (jobs[i].uuid === uuid) {
                jobs.splice(i, 1);
                break;
            }
        }
        forceUpdate();
    };

    const botRef = useRef();

    const runAll = () => {
        console.log(jobs);
        (botRef.current as any).run();
    };

    const openCaptcha = () => {
        ipcRenderer.send('new-window');
    };
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
                    Proxy
                </Col>

                <Col span={3} style={colStyle}>
                    Profile
                </Col>

                <Col span={7} style={colStyle}>
                    Sizes
                </Col>

                <Col span={3} style={colStyle}>
                    Status
                </Col>

                <Col span={3} style={colStyle}>
                    Actions
                </Col>
            </Row>
        );
    };

    const addTasks = (data: any) => {
        let temp = jobs;

        if (temp !== null) {
            for (let i = 0; i < Number(data['task'].quantity); i++) {
                temp.push({
                    uuid: uuid(),
                    store: 'Footlocker',
                    keyword: data['task'].keyword,
                    startdate: data['task'].startdate,
                    starttime: data['task'].starttime,
                    profile: data['task'].profile,
                    sizes: data['task'].sizes,
                    proxyset: data['task'].proxyset,
                    quantity: data['task'].quantity,
                    monitordelay: data['task'].monitordelay,
                    retrydelay: data['task'].retrydelay,
                });
            }
            setJobs(temp);
        }
        forceUpdate();
    };

    const deleteAllTasks = () => {
        setJobs(new Array<Job>());
        forceUpdate();
    };

    const ROW_GUTTER: [number, number] = [24, 0];

    return (
        <div>
            <NewTaskModal store={'footlocker'} addTasks={addTasks} proxies={proxies} />

            <div
                style={{
                    border: '1px solid #4D4D4D',
                    borderRadius: '6px',
                    backgroundColor: '#282C31',
                    width: '100%',
                    marginTop: '10px',
                    height: '75vh',
                }}
            >
                <Headers />
                <Divider style={{ marginBottom: '10px' }} />

                <div
                    style={{
                        overflow: 'auto',
                        height: '68vh',
                    }}
                >
                    {jobs.map((botTask) => (
                        <Bot
                            ref={botRef}
                            key={botTask.uuid}
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
                            deleteBot={deleteBot}
                        />
                    ))}
                </div>
            </div>

            <Row gutter={ROW_GUTTER} justify="end" style={{ marginTop: 10 }}>
                <Col span={3}>
                    <Button onClick={() => runAll()} type="default" style={{ ...buttonStyle, backgroundColor: 'green' }}>
                        Run all
                    </Button>
                </Col>
                <Col span={3}>
                    <Button style={buttonStyle} type="primary" danger>
                        Stop all
                    </Button>
                </Col>
                <Col span={12}></Col>
                <Col span={3}>
                    <Button style={buttonStyle} type="primary" danger onClick={() => deleteAllTasks()}>
                        Delete all
                    </Button>
                </Col>
                <Col span={3}>
                    <Button style={buttonStyle} type="primary" onClick={() => openCaptcha()}>
                        Open cap
                    </Button>
                </Col>
            </Row>
        </div>
    );
};

export default Store;
