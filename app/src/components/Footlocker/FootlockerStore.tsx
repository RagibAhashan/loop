import { Button, Col, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { CAPTHA_WINDOW_CLOSED, NOTIFY_CAPTCHA } from '../../common/Constants';
import { ICaptcha } from '../../components/Captcha/CaptchaFrame';
import { buttonStyle } from '../../styles/Buttons';
import AddTaskAction from '../AddTaskAction/AddTaskAction';
import DeleteAllTaskAction from '../DeleteAllTaskAction/DeleteAllTaskAction';
import EditAllTasksAction from '../EditAllTasksAction/EditAllTasksAction';
import FLHeaders from '../FLHeaders/FLHeaders';
import StartAllTasksAction from '../StartAllTasksAction/StartAllTasksAction';
import StopAllTasksAction from '../StopAllTasksAction/StopAllTasksAction';
import TaskListContainer from '../TaskListContainer/TaskListContainer';
import FLEditTaskModal from './FLEditTaskModal';
import FLNewTaskModal from './FLNewTaskModal';
import FLTask from './FLTask';
const { ipcRenderer } = window.require('electron');
const { Option } = Select;

const allSizes: any[] = [];
for (let i = 4; i < 14; i += 0.5) {
    allSizes.push(
        <Option value={i.toString()} key={i.toString()}>
            {i.toString()}
        </Option>,
    );
}

const FootlockerStore = (props: any) => {
    const { storeKey } = props;
    const [captchaWinOpened, setCaptchaWinOpened] = useState(false);

    // TODO change captcha logic
    useEffect(() => {
        ipcRenderer.on(CAPTHA_WINDOW_CLOSED, () => {
            setCaptchaWinOpened(false);
        });
        listenCaptcha();
        return () => {
            ipcRenderer.removeAllListeners(CAPTHA_WINDOW_CLOSED);
            ipcRenderer.removeAllListeners(storeKey + NOTIFY_CAPTCHA);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const listenCaptcha = () => {
        ipcRenderer.on(storeKey + NOTIFY_CAPTCHA, (event, captcha: ICaptcha) => {
            // store tasks with captcha in localstorage
            let curr = JSON.parse(localStorage.getItem(storeKey + NOTIFY_CAPTCHA) as string) as ICaptcha[];
            curr = curr ? [...curr, captcha] : [captcha];

            console.log('storing captcahs in local', curr);
            localStorage.setItem(storeKey + NOTIFY_CAPTCHA, JSON.stringify(curr));

            // and then open window
            if (!captchaWinOpened) {
                console.log('got captcha');
                openCaptcha();
            }
        });
    };

    const openCaptcha = async () => {
        ipcRenderer.send('new-window', storeKey);
        setCaptchaWinOpened(true);
    };

    const ROW_GUTTER: [number, number] = [24, 0];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'auto' }}>
            <FLHeaders />

            <TaskListContainer storeKey={storeKey} TaskComponent={FLTask} />

            <Row gutter={ROW_GUTTER} justify="end" style={{ marginTop: 10, width: '100%' }}>
                <Col span={3}>
                    <AddTaskAction storeKey={storeKey} NewTaskModalComponent={FLNewTaskModal}></AddTaskAction>
                </Col>

                <Col span={3}>
                    <EditAllTasksAction storeKey={storeKey} EditTaskModalComponent={FLEditTaskModal}></EditAllTasksAction>
                </Col>
                <Col span={3}></Col>
                <Col span={3}>
                    <StartAllTasksAction storeKey={storeKey}></StartAllTasksAction>
                </Col>
                <Col span={3}>
                    <StopAllTasksAction storeKey={storeKey}></StopAllTasksAction>
                </Col>
                <Col span={3}></Col>
                <Col span={3}>
                    <DeleteAllTaskAction storeKey={storeKey}></DeleteAllTaskAction>
                </Col>
                <Col span={3}>
                    <Button style={buttonStyle} type="primary" onClick={() => openCaptcha()} disabled={captchaWinOpened}>
                        Captcha
                    </Button>
                </Col>
            </Row>
        </div>
    );
};

export default FootlockerStore;
