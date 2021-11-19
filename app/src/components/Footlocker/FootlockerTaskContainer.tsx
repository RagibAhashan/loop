import { IProfile } from '@core/Profile';
import { IProxySet } from '@core/ProxySet';
import { Task } from '@core/Task';
import { ITaskGroup } from '@core/TaskGroup';
import { Col, Row, Select } from 'antd';
import React from 'react';
import AddTaskAction from '../AddTaskAction/AddTaskAction';
import TaskListContainer from '../TaskList/TaskList';
import FLHeaders from './FLHeaders';
import FLNewTaskModal from './FLNewTaskModal';
import FLTask from './FLTask';
const { Option } = Select;

const allSizes: any[] = [];
for (let i = 4; i < 14; i += 0.5) {
    allSizes.push(
        <Option value={i.toString()} key={i.toString()}>
            {i.toString()}
        </Option>,
    );
}

interface Props {
    tasks: Task[];
    taskGroup: ITaskGroup;
    profiles: IProfile[];
    proxySets: IProxySet[];
}

const FootlockerTaskContainer: React.FunctionComponent<Props> = (props) => {
    const { tasks, taskGroup, profiles, proxySets } = props;

    const ROW_GUTTER: [number, number] = [24, 0];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'auto' }}>
            <FLHeaders />

            <TaskListContainer tasks={tasks} TaskComponent={FLTask} />

            <Row gutter={ROW_GUTTER} justify="end" style={{ marginTop: 10, width: '100%' }}>
                <Col span={3}>
                    <AddTaskAction
                        proxySets={proxySets}
                        profiles={profiles}
                        taskGroup={taskGroup}
                        NewTaskModalComponent={FLNewTaskModal}
                    ></AddTaskAction>
                </Col>

                {/* <Col span={3}>
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
                    <CaptchaAction storeKey={storeKey}></CaptchaAction>
                </Col> */}
            </Row>
        </div>
    );
};

export default FootlockerTaskContainer;
