import { Button, Col, Row, Select, Empty } from 'antd';
import React, { useEffect, useState } from 'react';
import { FixedSizeList } from 'react-window';
import { NOTIFY_STOP_TASK, NOTIFY_EDIT_TASK } from '../../common/Constants';
import { TaskData } from '../../interfaces/TaskInterfaces';
import Bot from './Bot';
import NewTaskModal from './newTaskModal';
import EditTaskModal from './EditTaskModal';
import { TaskService } from '../../services/TaskService';
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
    // textAlign: 'center',
    // paddingLeft: 20,
    marginBottom: 20,
} as React.CSSProperties;

const headerColStyle = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
};

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
    const [jobsRunning, setJobsRunning] = useState(() => false);
    const [taskModalVisible, setTaskModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);

    useEffect(() => {
        getTasks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const openCaptcha = async () => {
        ipcRenderer.send('new-window', storeName);
    };
    const Headers = () => {
        return (
            <div>
                <Row style={botStyle}>
                    <Col style={{ ...headerColStyle, paddingLeft: 15 }} span={4}>
                        Product
                    </Col>

                    <Col style={headerColStyle} span={4}>
                        Proxy
                    </Col>

                    <Col style={headerColStyle} span={4}>
                        Profile
                    </Col>

                    <Col style={headerColStyle} span={4}>
                        Sizes
                    </Col>

                    <Col style={headerColStyle} span={6}>
                        Status
                    </Col>

                    <Col style={headerColStyle} span={2}>
                        Actions
                    </Col>
                </Row>
            </div>
        );
    };

    const addTasks = (data: TaskData) => {
        let temp: TaskData[] = [];
        for (let i = 0; i < data.quantity; i++) {
            const id = uuid();
            // eslint-disable-next-line react-hooks/rules-of-hooks
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
            localStorage.removeItem(job.uuid);
            ipcRenderer.send(NOTIFY_STOP_TASK, job.uuid);
        });
        setJobs(() => new Array<TaskData>());
        localStorage.removeItem(storeName);
    };

    const stopAllTasks = () => {
        setJobsRunning(false);
        jobs.forEach((job) => {
            ipcRenderer.send(NOTIFY_STOP_TASK, job.uuid);
        });
    };

    const editBot = (newValues: TaskData, uuid: string) => {
        const newJobs = [...jobs];
        const idx = jobs.findIndex((job) => job.uuid === uuid);
        newJobs[idx] = { ...newJobs[idx], ...newValues };
        localStorage.setItem(storeName, JSON.stringify(newJobs));
        setJobs(newJobs);
        ipcRenderer.send(NOTIFY_EDIT_TASK, uuid);
    };

    const openEditAllTaskModal = () => {
        setEditModalVisible(true);
    };

    const editAllTasks = (newValues: TaskData) => {
        const newJobs = [...jobs];

        jobs.forEach((job, idx) => {
            newJobs[idx] = { ...newJobs[idx], ...newValues };
            ipcRenderer.send(NOTIFY_EDIT_TASK, job.uuid);
        });

        localStorage.setItem(storeName, JSON.stringify(newJobs));
        setJobs(newJobs);

        setEditModalVisible(false);
    };

    const ROW_GUTTER: [number, number] = [24, 0];

    const renderJobs = (ele: any) => {
        const { index, style } = ele;

        return <Bot key={jobs[index].uuid} taskData={jobs[index]} deleteBot={deleteBot} editBot={editBot} storeName={storeName} style={style} />;
    };

    const showTasks = () => {
        return jobs.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={<span style={{ fontSize: '20px', fontWeight: 500 }}>Add some tasks ! 🐱‍💻 </span>}
                />
            </div>
        ) : (
            <FixedSizeList height={700} itemCount={jobs.length} itemSize={45} width="100%" style={{ flex: 1, padding: 10 }}>
                {renderJobs}
            </FixedSizeList>
        );
    };

    const startAllTasks = () => {
        setJobsRunning(true);
        TaskService.notify();
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'auto' }}>
            <Headers />

            {showTasks()}
            <Row gutter={ROW_GUTTER} justify="end" style={{ marginTop: 10, width: '100%' }}>
                <Col span={3}>
                    <Button style={buttonStyle} type="primary" onClick={() => setTaskModalVisible(true)}>
                        Add Task
                    </Button>
                </Col>

                <Col span={3}>
                    <Button style={buttonStyle} type="primary" onClick={() => openEditAllTaskModal()}>
                        Edit All
                    </Button>
                </Col>
                <Col span={3}></Col>
                <Col span={3}>
                    <Button
                        type="default"
                        style={{ ...buttonStyle, backgroundColor: 'green' }}
                        onClick={() => startAllTasks()}
                        disabled={jobs.length === 0 || jobsRunning}
                    >
                        Run all
                    </Button>
                </Col>
                <Col span={3}>
                    <Button style={buttonStyle} type="primary" onClick={() => stopAllTasks()} danger disabled={jobs.length === 0 || !jobsRunning}>
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
                        Captcha
                    </Button>
                </Col>
            </Row>
            <NewTaskModal visible={taskModalVisible} store={storeName} addTasks={addTasks} cancelTaskModal={() => setTaskModalVisible(false)} />

            <EditTaskModal taskData={{}} visible={editModalVisible} confirmEdit={editAllTasks} cancelEditModal={() => setEditModalVisible(false)} />
        </div>
    );
};

export default Store;
