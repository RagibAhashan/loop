import { Button, Col, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { FixedSizeList } from 'react-window';
import { NOTIFY_STOP_TASK } from '../../common/Constants';
import { TaskData } from '../../interfaces/TaskInterfaces';
import Bot from './Bot';
import NewTaskModal from './newTaskModal';
const { ipcRenderer } = window.require('electron');
const { v4: uuid } = require('uuid');
const { Option } = Select;

const buttonStyle: React.CSSProperties = {
    width: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
};

const botStyle = {
    fontSize: '18px',
    textAlign: 'center',
    marginBottom: 20,
} as React.CSSProperties;

const allSizes: any[] = [];
for (let i = 4; i < 14; i += 0.5) {
    allSizes.push(
        <Option value={i.toString()} key={i.toString()}>
            {i.toString()}
        </Option>,
    );
}

const Store = (props: any) => {
    const getTasks = (): TaskData[] => {
        const tasks = JSON.parse(localStorage.getItem(storeName) as string) as TaskData[];
        return tasks ? tasks : [];
    };

    const { storeName } = props;
    const [jobs, setJobs] = useState(() => getTasks());
    const [taskModalVisible, setTaskModalVisible] = useState(false);

    useEffect(() => {
        getTasks();
    }, []);

    const deleteBot = (uuid: string) => {
        localStorage.removeItem(uuid);
        for (let i = 0; i < jobs.length; i++) {
            if (jobs[i].uuid === uuid) {
                jobs.splice(i, 1);
                break;
            }
        }
        setJobs(() => {
            const newJobs = [...jobs];
            localStorage.setItem(storeName, JSON.stringify(newJobs));
            return newJobs;
        });

        ipcRenderer.send(NOTIFY_STOP_TASK, uuid);
    };

    const openCaptcha = () => {
        ipcRenderer.send('new-window');
    };
    const Headers = () => {
        return (
            <Row style={botStyle}>
                <Col span={4}>Product</Col>

                <Col span={4}>Proxy</Col>

                <Col span={4}>Profile</Col>

                <Col span={4}>Sizes</Col>

                <Col span={4}>Status</Col>

                <Col span={4}>Actions</Col>
            </Row>
        );
    };

    const addTasks = (data: TaskData) => {
        let temp: TaskData[] = [];
        for (let i = 0; i < data.quantity; i++) {
            const id = uuid();
            temp.push({ ...data, uuid: id, store: storeName });
        }

        setJobs((oldJobs) => {
            const newJobs = [...oldJobs, ...temp];
            localStorage.setItem(storeName, JSON.stringify(newJobs));
            return newJobs;
        });

        setTaskModalVisible(false);
    };

    const deleteAllTasks = () => {
        jobs.forEach((job) => {
            ipcRenderer.send(NOTIFY_STOP_TASK, job.uuid);
            localStorage.removeItem(job.uuid);
        });
        setJobs(() => new Array<TaskData>());
        localStorage.removeItem(storeName);
    };

    const stopAllTasks = () => {
        jobs.forEach((job) => {
            ipcRenderer.send('stop-task', job.uuid);
        });
    };

    const ROW_GUTTER: [number, number] = [24, 0];

    const renderJobs = (ele: any) => {
        const { index, style } = ele;

        return (
            <Bot
                key={jobs[index].uuid}
                uuid={jobs[index].uuid}
                store={jobs[index].store}
                productLink={jobs[index].productLink}
                productSKU={jobs[index].productSKU}
                startdate={jobs[index].startDate}
                starttime={jobs[index].startTime}
                profile={jobs[index].profile}
                sizes={jobs[index].sizes}
                proxySet={jobs[index].proxySet}
                monitordelay={jobs[index].monitorDelay}
                retryDelay={jobs[index].retryDelay}
                deleteBot={deleteBot}
                storeName={storeName}
                style={style}
            />
        );
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'auto' }}>
            <Headers />

            <FixedSizeList height={700} itemCount={jobs.length} itemSize={45} width="100%" style={{ flex: 1 }}>
                {renderJobs}
            </FixedSizeList>
            <Row gutter={ROW_GUTTER} justify="end" style={{ marginTop: 10, width: '100%' }}>
                <Col span={3}>
                    <Button style={buttonStyle} type="primary" onClick={() => setTaskModalVisible(true)}>
                        Add Task
                    </Button>
                </Col>
                <Col span={6}></Col>
                <Col span={3}>
                    <Button type="default" style={{ ...buttonStyle, backgroundColor: 'green' }} disabled={jobs.length === 0}>
                        Run all
                    </Button>
                </Col>
                <Col span={3}>
                    <Button style={buttonStyle} type="primary" onClick={() => stopAllTasks()} danger disabled={jobs.length === 0}>
                        Stop all
                    </Button>
                </Col>
                <Col span={3}></Col>
                <Col span={3}>
                    <Button style={buttonStyle} type="primary" danger onClick={() => deleteAllTasks()} disabled={jobs.length === 0}>
                        Delete all
                    </Button>
                </Col>
                <Col span={3}>
                    <Button style={buttonStyle} type="primary" onClick={() => openCaptcha()} disabled={jobs.length === 0}>
                        Open cap
                    </Button>
                </Col>
            </Row>
            <NewTaskModal visible={taskModalVisible} store={storeName} addTasks={addTasks} cancelTaskModal={() => setTaskModalVisible(false)} />
        </div>
    );
};

export default Store;
