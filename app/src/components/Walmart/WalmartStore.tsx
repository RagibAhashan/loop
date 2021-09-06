import { Button, Col, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { CAPTHA_WINDOW_CLOSED, NOTIFY_CAPTCHA } from '../../common/Constants';
import { buttonStyle } from '../../styles/Buttons';
import AddTaskAction from '../AddTaskAction/AddTaskAction';
import { ICaptcha } from '../Captcha/CaptchaFrame';
import DeleteAllTaskAction from '../DeleteAllTaskAction/DeleteAllTaskAction';
import EditAllTasksAction from '../EditAllTasksAction/EditAllTasksAction';
import StartAllTasksAction from '../StartAllTasksAction/StartAllTasksAction';
import StopAllTasksAction from '../StopAllTasksAction/StopAllTasksAction';
import TaskListContainer from '../TaskListContainer/TaskListContainer';
import WalmartEditTaskModal from './WalmartEditTaskModal';
import WalmartHeaders from './WalmartHeaders';
import WalmartNewTaskModal from './WalmartNewTaskModal';
import WalmartTask from './WalmartTask';
const { Option } = Select;

const allSizes: any[] = [];
for (let i = 4; i < 14; i += 0.5) {
    allSizes.push(
        <Option value={i.toString()} key={i.toString()}>
            {i.toString()}
        </Option>,
    );
}

const WalmartStore = (props: any) => {
    const { storeKey } = props;
    const [captchaWinOpened, setCaptchaWinOpened] = useState(false);

    // TODO change captcha logic
    useEffect(() => {
        window.ElectronBridge.on(CAPTHA_WINDOW_CLOSED, () => {
            setCaptchaWinOpened(false);
        });
        listenCaptcha();
        return () => {
            window.ElectronBridge.removeAllListeners(CAPTHA_WINDOW_CLOSED);
            window.ElectronBridge.removeAllListeners(storeKey + NOTIFY_CAPTCHA);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const listenCaptcha = () => {
        window.ElectronBridge.on(storeKey + NOTIFY_CAPTCHA, (event, captcha: ICaptcha) => {
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
        window.ElectronBridge.send('new-window', storeKey);
        setCaptchaWinOpened(true);
    };

    const ROW_GUTTER: [number, number] = [24, 0];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'auto' }}>
            <WalmartHeaders />

            <TaskListContainer storeKey={storeKey} TaskComponent={WalmartTask} />

            <Row gutter={ROW_GUTTER} justify="end" style={{ marginTop: 10, width: '100%' }}>
                <Col span={3}>
                    <AddTaskAction storeKey={storeKey} NewTaskModalComponent={WalmartNewTaskModal}></AddTaskAction>
                </Col>

                <Col span={3}>
                    <EditAllTasksAction storeKey={storeKey} EditTaskModalComponent={WalmartEditTaskModal}></EditAllTasksAction>
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

export default WalmartStore;
