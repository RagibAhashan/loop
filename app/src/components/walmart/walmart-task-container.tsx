import AddTaskAction from '@components/actions/add-task-action';
import DeleteAllTaskAction from '@components/actions/delete-all-tasks-action';
import StartAllTasksAction from '@components/actions/start-all-task-action';
import StopAllTasksAction from '@components/actions/stop-all-tasks-action';
import TaskList from '@components/task-list/task-list';
import { ProfileGroupViewData } from '@core/profilegroup';
import { ProxySetViewData } from '@core/proxyset';
import { TaskViewData } from '@core/task';
import { TaskGroupViewData } from '@core/taskgroup';
import { Col, Row, Select } from 'antd';
import React from 'react';
import WalmartHeaders from './walmart-headers';
import WalmartNewTaskModal from './walmart-new-task-modal';
import WalmartTask from './walmart-task';
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
    tasks: TaskViewData[];
    taskGroup: TaskGroupViewData;
    profileGroups: ProfileGroupViewData[];
    proxySets: ProxySetViewData[];
}

const WalmartTaskContainer: React.FunctionComponent<Props> = (props) => {
    const { tasks, taskGroup, profileGroups, proxySets } = props;

    const ROW_GUTTER: [number, number] = [24, 0];

    const areTaskRunning = tasks.some((task) => task.isRunning);
    const areTaskCreated = tasks.length > 0;

    console.log('walmart task container', tasks, taskGroup, profileGroups, proxySets);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'auto' }}>
            <div> hello </div>
            <WalmartHeaders />

            <TaskList tasks={tasks} TaskComponent={WalmartTask} groupName={taskGroup.name} profileGroups={profileGroups} proxySets={proxySets} />

            <Row gutter={ROW_GUTTER} justify="end" style={{ marginTop: 10, width: '100%' }}>
                <Col span={3}>
                    <AddTaskAction
                        proxySets={proxySets}
                        profileGroups={profileGroups}
                        taskGroup={taskGroup}
                        NewTaskModalComponent={WalmartNewTaskModal}
                    ></AddTaskAction>
                </Col>

                <Col span={3}>
                    {/* <EditAllTasksAction
                        taskGroup={taskGroup}
                        EditTaskModalComponent={WalmartEditTaskModal}
                        proxySets={proxySets}
                        profileGroups={profileGroups}
                    ></EditAllTasksAction> */}
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
                <Col span={3}>{/* <CaptchaAction></CaptchaAction> */}</Col>
            </Row>
        </div>
    );
};

export default WalmartTaskContainer;
