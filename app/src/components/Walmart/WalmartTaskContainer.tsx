import AddTaskAction from '@components/AddTaskAction/AddTaskAction';
import DeleteAllTaskAction from '@components/DeleteAllTaskAction/DeleteAllTaskAction';
import EditAllTasksAction from '@components/EditAllTasksAction/EditAllTasksAction';
import StartAllTasksAction from '@components/StartAllTasksAction/StartAllTasksAction';
import StopAllTasksAction from '@components/StopAllTasksAction/StopAllTasksAction';
import TaskList from '@components/TaskList/TaskList';
import { IProfile } from '@core/Profile';
import { IProxySet } from '@core/ProxySet';
import { ITask } from '@core/Task';
import { ITaskGroup } from '@core/TaskGroup';
import { Col, Row, Select } from 'antd';
import React from 'react';
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

interface Props {
    tasks: ITask[];
    taskGroup: ITaskGroup;
    profiles: IProfile[];
    proxySets: IProxySet[];
}

const WalmartTaskContainer: React.FunctionComponent<Props> = (props) => {
    const { tasks, taskGroup, profiles, proxySets } = props;

    const ROW_GUTTER: [number, number] = [24, 0];

    const areTaskRunning = tasks.some((task) => task.isRunning);
    const areTaskCreated = tasks.length > 0;

    console.log('walmart task container', taskGroup.name, tasks);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'auto' }}>
            <WalmartHeaders />

            <TaskList tasks={tasks} TaskComponent={WalmartTask} groupName={taskGroup.name} profiles={profiles} proxySets={proxySets} />

            <Row gutter={ROW_GUTTER} justify="end" style={{ marginTop: 10, width: '100%' }}>
                <Col span={3}>
                    <AddTaskAction
                        proxySets={proxySets}
                        profiles={profiles}
                        taskGroup={taskGroup}
                        NewTaskModalComponent={WalmartNewTaskModal}
                    ></AddTaskAction>
                </Col>

                <Col span={3}>
                    <EditAllTasksAction
                        taskGroup={taskGroup}
                        EditTaskModalComponent={WalmartEditTaskModal}
                        proxySets={proxySets}
                        profiles={profiles}
                    ></EditAllTasksAction>
                </Col>
                <Col span={3}></Col>
                <Col span={3}>
                    <StartAllTasksAction
                        groupName={taskGroup.name}
                        areTasksCreated={areTaskCreated}
                        areTasksRunning={areTaskRunning}
                    ></StartAllTasksAction>
                </Col>
                <Col span={3}>
                    <StopAllTasksAction
                        groupName={taskGroup.name}
                        areTasksCreated={areTaskCreated}
                        areTasksRunning={areTaskRunning}
                    ></StopAllTasksAction>
                </Col>
                <Col span={3}></Col>
                <Col span={3}>
                    <DeleteAllTaskAction tasks={tasks} taskGroup={taskGroup}></DeleteAllTaskAction>
                </Col>
                {/* <Col span={3}>
                    <CaptchaAction></CaptchaAction>
                </Col> */}
            </Row>
        </div>
    );
};

export default WalmartTaskContainer;
