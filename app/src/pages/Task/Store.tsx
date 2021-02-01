import { Button, Col, Divider, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { FixedSizeList } from 'react-window';
import { TaskData } from '../../interfaces/TaskInterfaces';
import Bot from './Bot';
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

    const addTasks = (data: any) => {
        const task: TaskData = data.task;
        let temp: TaskData[] = [];
        for (let i = 0; i < task.quantity; i++) {
            temp.push({ ...task, uuid: uuid(), store: storeName });
        }

        setJobs((oldJobs) => {
            const newJobs = [...oldJobs, ...temp];
            localStorage.setItem(storeName, JSON.stringify(newJobs));
            return newJobs;
        });

        setTaskModalVisible(false);
    };

    const deleteAllTasks = () => {
        jobs.forEach((job) => localStorage.removeItem(job.uuid));
        setJobs(() => new Array<TaskData>());
        localStorage.removeItem(storeName);
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
            <Headers />
            <Divider style={{ marginBottom: '10px' }} />

            <FixedSizeList height={500} itemCount={jobs.length} itemSize={50} width="100%">
                {renderJobs}
            </FixedSizeList>

            <Row gutter={ROW_GUTTER} justify="end" style={{ marginTop: 10 }}>
                <Col span={3}>
                    <Button style={buttonStyle} type="primary" onClick={() => setTaskModalVisible(true)}>
                        Add Task
                    </Button>
                </Col>
                <Col span={6}></Col>
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
                <Col span={3}></Col>
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

            <NewTaskModal visible={taskModalVisible} store={storeName} addTasks={addTasks} cancelTaskModal={() => setTaskModalVisible(false)} />
        </div>
    );
};

export default Store;
