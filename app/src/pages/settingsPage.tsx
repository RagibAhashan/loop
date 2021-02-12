import React from 'react';
import { Button } from 'antd';
import { ipcMain } from 'electron/main';
// import { ipcRenderer } from 'electron';
const { ipcRenderer } = window.require('electron');

const SettingsPage = () => {

    const getID = async () => {
        const data = await ipcRenderer.invoke('GET-SYSTEM-ID');
        return data;
    }


    return <div style={{ backgroundColor: '#212427', height: '100vh', padding: '5%' }}>


        <Button type='primary'
            onClick={async () => {
                const data = await getID();
                console.log(data);
            }}
        > 
            Get system info
        </Button>

    </div>;
};

export default SettingsPage;
