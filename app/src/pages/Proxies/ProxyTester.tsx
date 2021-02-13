import { NOTIFY_STOP_PROXY_TEST, NOTIFY_START_PROXY_TEST, PROXY_TEST_STOPPED, STORES } from '../../common/Constants';
const { ipcRenderer } = window.require('electron');

export const testIndividual = (record: any, tabName: string, store: any) => {
    const setName = tabName;
    const proxy = record.ip + ':' + record.port;
    const credential = record.username + ':' + record.password;

    const testStatus = 'Testing..';
    
    ipcRenderer.send(NOTIFY_START_PROXY_TEST, setName, proxy, credential, store);
};