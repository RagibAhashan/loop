// import TaskList from '@components/task-list/task-list';
// import { ProfileGroupViewData } from '@core/profile-group';
// import { ProxyGroupViewData } from '@core/proxy-group';
// import { TaskViewData } from '@core/task';
// import { TaskGroupViewData } from '@core/task-group';
// import { Select } from 'antd';
// import React from 'react';
// import WalmartHeaders from './walmart-headers';
// import WalmartTask from './walmart-task';
// const { Option } = Select;

// const allSizes: any[] = [];
// for (let i = 4; i < 14; i += 0.5) {
//     allSizes.push(
//         <Option value={i.toString()} key={i.toString()}>
//             {i.toString()}
//         </Option>,
//     );
// }

// interface Props {
//     tasks: TaskViewData[];
//     taskGroup: TaskGroupViewData;
//     profileGroups: ProfileGroupViewData[];
//     proxyGroups: ProxyGroupViewData[];
// }

// const WalmartTaskContainer: React.FunctionComponent<Props> = (props) => {
//     const { tasks, taskGroup, profileGroups, proxyGroups } = props;

//     const ROW_GUTTER: [number, number] = [24, 0];

//     const areTaskRunning = tasks.some((task) => task.isRunning);
//     const areTaskCreated = tasks.length > 0;

//     console.log('walmart task container', tasks, taskGroup, profileGroups, proxyGroups);

//     return (
//         <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'auto' }}>
//             <WalmartHeaders />

//             <TaskList tasks={tasks} TaskComponent={WalmartTask} groupName={taskGroup.name} profileGroups={profileGroups} proxyGroups={proxyGroups} />
//         </div>
//     );
// };

// export default WalmartTaskContainer;
