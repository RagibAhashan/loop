import TaskContainer from '@components/task-container/task-container';
import TaskGroupContainer from '@components/taskgroup/taskgroup-container';
import React from 'react';

const TaskPage = () => {
    return (
        <div style={{ height: '100%', width: '100%', display: 'flex', overflow: 'hidden' }}>
            <div
                style={{
                    width: '250px',
                    height: '100%',
                    backgroundColor: '#2a2e31',
                }}
            >
                <TaskGroupContainer></TaskGroupContainer>
            </div>
            <div style={{ height: '100%', width: '100%' }}>
                <TaskContainer></TaskContainer>
            </div>
        </div>
    );
};

export default TaskPage;
