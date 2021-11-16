import TaskContainer from '@components/TaskContainer/TaskContainer';
import TaskGroupContainer from '@components/TaskGroup/TaskGroupContainer';
import React from 'react';

const TaskPage = () => {
    return (
        <div style={{ height: '100%', width: '100%', display: 'flex', overflow: 'hidden' }}>
            <div
                style={{
                    width: '25%',
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
