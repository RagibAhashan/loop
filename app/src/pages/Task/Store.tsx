import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Col, Empty, Popconfirm, Row, Select } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FixedSizeList } from 'react-window';
import { CAPTHA_WINDOW_CLOSED, NOTIFY_CAPTCHA, NOTIFY_EDIT_TASK, NOTIFY_START_TASK, NOTIFY_STOP_TASK } from '../../common/Constants';
import { ICaptcha } from '../../components/Captcha/CaptchaFrame';
import { CreditCard, TaskData, UserProfile } from '../../interfaces/TaskInterfaces';
import ccEncryptor from '../../services/CreditCardEncryption';
import { assignProxy } from '../../services/TaskService';
import Bot from './Bot';
import EditTaskModal from './EditTaskModal';
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
    marginBottom: 20,
    userSelect: 'none',
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
const STATE = 'State';

const Store = (props: any) => {
    const getTasks = (): TaskData[] => {
        const tasks = JSON.parse(localStorage.getItem(storeName) as string) as TaskData[];
        return tasks ? tasks : [];
    };

    const getRunningTasks = (): number => {
        const num = JSON.parse(localStorage.getItem(storeName + STATE) as string) as number;
        return num ? num : 0;
    };

    const { storeName } = props;
    const [jobs, setJobs] = useState(() => getTasks());
    const [numRunningTasks, setNumRunningTasks] = useState(() => getRunningTasks());
    const [taskModalVisible, setTaskModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [captchaWinOpened, setCaptchaWinOpened] = useState(false);

    useEffect(() => {
        ipcRenderer.on(CAPTHA_WINDOW_CLOSED, () => {
            setCaptchaWinOpened(false);
        });
        getTasks();
        listenCaptcha();
        return () => {
            ipcRenderer.removeAllListeners(CAPTHA_WINDOW_CLOSED);
            ipcRenderer.removeAllListeners(storeName + NOTIFY_CAPTCHA);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const listenCaptcha = () => {
        ipcRenderer.on(storeName + NOTIFY_CAPTCHA, (event, captcha: ICaptcha) => {
            // store tasks with captcha in localstorage
            let curr = JSON.parse(localStorage.getItem(storeName + NOTIFY_CAPTCHA) as string) as ICaptcha[];
            curr = curr ? [...curr, captcha] : [captcha];

            console.log('storing captcahs in local', curr);
            localStorage.setItem(storeName + NOTIFY_CAPTCHA, JSON.stringify(curr));

            // and then open window
            if (!captchaWinOpened) {
                console.log('got captcha');
                openCaptcha();
            }
        });
    };

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
        setCaptchaWinOpened(true);
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

    const addTaskEvent = (temp: TaskData[]) => {
        ipcRenderer.invoke('GET-SYSTEM-ID').then((SYSTEM_KEY) => {
            const aTask = temp[0];
            const uploadData = {
                SYSTEM_KEY: SYSTEM_KEY,
                item: aTask['productSKU'],
                amountTasks: Number(temp.length),
                storeName: storeName,
                usingProxies: aTask.proxySet ? true : false,
                size: aTask.sizes,
            };

            axios
                .post('http://localhost:4000/events/tasks/', uploadData)
                .then(() => console.log('task added'))
                .catch((error) => console.log(error));
        });
    };

    const addTasks = (data: TaskData) => {
        let temp: TaskData[] = [];
        for (let i = 0; i < (data.quantity as number); i++) {
            const id = uuid();
            // eslint-disable-next-line react-hooks/rules-of-hooks
            temp.push({ ...data, uuid: id, store: storeName });
        }

        addTaskEvent(temp);

        console.log(temp);

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
        setNumRunningTasks(0);
        localStorage.setItem(storeName + STATE, JSON.stringify(0));

        jobs.forEach((job) => {
            ipcRenderer.send(NOTIFY_STOP_TASK, job.uuid);
        });

        localStorage.removeItem(storeName + NOTIFY_CAPTCHA);
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

    const startTask = (taskData: TaskData) => {
        const { uuid, proxySet, profile, productSKU, sizes, retryDelay } = taskData;

        setNumRunningTasks((prev) => {
            localStorage.setItem(storeName + STATE, JSON.stringify(prev + 1));
            return prev + 1;
        });

        const profiles = JSON.parse(localStorage.getItem('profiles') as string) as UserProfile[];
        const profileData = profiles.find((prof) => prof.profile === profile) as UserProfile;

        profileData.payment = ccEncryptor.encrypt(profileData?.payment as CreditCard);

        let proxyData = undefined;
        if (proxySet) {
            proxyData = assignProxy(uuid, proxySet);
            // console.log('proxy assigned', proxyData);
        }
        const deviceId = localStorage.getItem('deviceId');
        ipcRenderer.send(NOTIFY_START_TASK, uuid, storeName, { productSKU, profileData, proxyData, sizes, retryDelay, deviceId });
    };

    const stopTask = (uuid: string) => {
        // remove captcha from list if task was waiting for one
        const captchas = JSON.parse(localStorage.getItem(storeName + NOTIFY_CAPTCHA) as string) as ICaptcha[];
        if (captchas) {
            const newCap = captchas.filter((cap) => cap.uuid !== uuid);
            localStorage.setItem(storeName + NOTIFY_CAPTCHA, JSON.stringify(newCap));
        }

        console.log('stop', uuid);

        setNumRunningTasks((prev) => {
            localStorage.setItem(storeName + STATE, JSON.stringify(prev - 1));
            return prev - 1;
        });

        ipcRenderer.send(NOTIFY_STOP_TASK, uuid);
    };

    const renderJobs = (ele: any) => {
        const { index, style } = ele;

        return (
            <Bot
                key={jobs[index].uuid}
                taskData={jobs[index]}
                startTask={startTask}
                stopTask={stopTask}
                deleteBot={deleteBot}
                editBot={editBot}
                storeName={storeName}
                style={style}
            />
        );
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
        jobs.forEach((job) => {
            startTask(job);
        });
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
                    <Button
                        style={buttonStyle}
                        type="primary"
                        onClick={() => openEditAllTaskModal()}
                        disabled={jobs.length === 0 || numRunningTasks > 0}
                    >
                        Edit All
                    </Button>
                </Col>
                <Col span={3}></Col>
                <Col span={3}>
                    <Button
                        type="default"
                        style={{ ...buttonStyle, backgroundColor: 'green' }}
                        onClick={() => startAllTasks()}
                        disabled={jobs.length === 0 || numRunningTasks > 0}
                    >
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
                    <Popconfirm
                        title="Are you sure？"
                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        onConfirm={deleteAllTasks}
                        onCancel={() => {}}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button style={buttonStyle} type="primary" danger disabled={jobs.length === 0}>
                            Delete all
                        </Button>
                    </Popconfirm>
                </Col>
                <Col span={3}>
                    <Button style={buttonStyle} type="primary" onClick={() => openCaptcha()} disabled={captchaWinOpened}>
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
