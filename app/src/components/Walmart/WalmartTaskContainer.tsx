import AddTaskAction from '@components/AddTaskAction/AddTaskAction';
import TaskListContainer from '@components/TaskList/TaskList';
import { Task } from '@core/Task';
import { Col, Row, Select } from 'antd';
import React from 'react';
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
    tasks: Task[];
}

const WalmartTaskContainer: React.FunctionComponent<Props> = (props) => {
    const { tasks } = props;

    const ROW_GUTTER: [number, number] = [24, 0];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'auto' }}>
            <WalmartHeaders />

            <TaskListContainer tasks={tasks} TaskComponent={WalmartTask} />

            <Row gutter={ROW_GUTTER} justify="end" style={{ marginTop: 10, width: '100%' }}>
                <Col span={3}>
                    <AddTaskAction NewTaskModalComponent={WalmartNewTaskModal}></AddTaskAction>
                </Col>

                {/* <Col span={3}>
                    <EditAllTasksAction EditTaskModalComponent={WalmartEditTaskModal}></EditAllTasksAction>
                </Col>
                <Col span={3}></Col>
                <Col span={3}>
                    <StartAllTasksAction></StartAllTasksAction>
                </Col>
                <Col span={3}>
                    <StopAllTasksAction></StopAllTasksAction>
                </Col>
                <Col span={3}></Col>
                <Col span={3}>
                    <DeleteAllTaskAction></DeleteAllTaskAction>
                </Col>
                <Col span={3}>
                    <CaptchaAction></CaptchaAction>
                </Col> */}
            </Row>
        </div>
    );
};

export default WalmartTaskContainer;
