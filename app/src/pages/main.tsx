import { ipcRenderer } from 'electron';
import React from 'react';

const Main = () => {
  ipcRenderer.on('task-reply', (event, message) => {
    console.log('task reply', message.message, 'from task', message.threadId); // prints "pong"
  });

  const startTask = async () => {
    console.log('sending start');
    ipcRenderer.send('start-task', 500);
  };

  const stop = () => {
    ipcRenderer.send('stop-task');
  };

  return (
    <div>
      Main test
      <button onClick={() => startTask()}> start a task </button>
      <button onClick={() => stop()}> stop a task </button>
    </div>
  );
};

export default Main;
