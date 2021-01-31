import { Button, Col, Divider, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { FixedSizeList } from 'react-window';
import Bot from './bot';
import NewTaskModal from './newTaskModal';

const { ipcRenderer } = window.require('electron');

const { v4: uuid } = require('uuid');

const { Option } = Select;

const colStyle = {
    margin: 'auto',
};

const buttonStyle: React.CSSProperties = {
    width: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
};

const botStyle = {
    marginLeft: '20px',
    marginRight: '20px',
    marginTop: '10px',
    marginBottom: '0px',
    height: '15px',
    borderRadius: '6px',
    color: 'orange',
    fontSize: '18px',
};

const allSizes: any[] = [];
for (let i = 4; i < 14; i += 0.5) {
    allSizes.push(
        <Option value={i.toString()} key={i.toString()}>
            {i.toString()}
        </Option>,
    );
}

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

    useEffect(() => {
        setProxies(getProxies());
        setProfiles(getProfiles());
        getTasks();
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

    const getTasks = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks') as string) as Job[];
        if (tasks) {
            console.log('got all tasks', tasks);
            setJobs(() => [...tasks]);
        }
    };

    const deleteBot = (uuid: string) => {
        for (let i = 0; i < jobs.length; i++) {
            if (jobs[i].uuid === uuid) {
                jobs.splice(i, 1);
                break;
            }
        }
        setJobs(() => [...jobs]);
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
        let temp: Job[] = [];
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

        setJobs((oldJobs) => [...oldJobs, ...temp]);
        localStorage.setItem('tasks', JSON.stringify(temp));
    };

    const deleteAllTasks = () => {
        setJobs(() => new Array<Job>());
        localStorage.removeItem('tasks');
    };

    const ROW_GUTTER: [number, number] = [24, 0];

    const renderJobs = (ele: any) => {
        const { index, style } = ele;
        return (
            <Bot
                key={jobs[index].uuid}
                uuid={jobs[index].uuid}
                store={jobs[index].store}
                keyword={jobs[index].keyword}
                startdate={jobs[index].startdate}
                starttime={jobs[index].starttime}
                profile={jobs[index].profile}
                sizes={jobs[index].sizes}
                proxyset={jobs[index].proxyset}
                monitordelay={jobs[index].monitordelay}
                retrydelay={jobs[index].retrydelay}
                deleteBot={deleteBot}
                style={style}
            />
        );
    };

    return (
        <div>
            <NewTaskModal store={'footlocker'} addTasks={addTasks} proxies={proxies} />

            <Headers />
            <Divider style={{ marginBottom: '10px' }} />

            <FixedSizeList height={500} itemCount={jobs.length} itemSize={50} width="100%">
                {renderJobs}
            </FixedSizeList>

            <Row gutter={ROW_GUTTER} justify="end" style={{ marginTop: 10 }}>
                <Col span={3}>
                    <Button type="default" style={{ ...buttonStyle, backgroundColor: 'green' }}>
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
