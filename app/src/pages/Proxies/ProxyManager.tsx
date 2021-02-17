import { Result } from 'antd';
import { rejects } from 'assert';
import { Proxy } from '../../interfaces/OtherInterfaces';
const UPLOAD = '1';
const COPYPASTE = '2';

export const Add = async(values: any, currentSetName: string, currentTabName: string, proxies: any) => {
    const name = currentSetName;
    const proxyArray: any = [];
    let data: any = {};

    if (currentTabName === UPLOAD) {
        const promiseResult = await getPromiseResult(values, name, proxyArray, data).then((result) => {data = result});

    } else if (currentTabName === COPYPASTE) {
        proxyArray.push(values.copiedProxies);
        const arrayProxy: Array<string> = proxyArray[0].split('\n');
        data = objectifySets(name, arrayProxy)
    }
    return data;
};

export const Delete = (proxiesArray: any, proxyToDelete: string) => {
    for (let i = 0; i < proxiesArray.length; i++) {
        if (proxiesArray[i].proxy === proxyToDelete) {
            proxiesArray.splice(i, 1);
            break;
        }
    }
    return proxiesArray;
}

const getPromiseResult = (values: any, name: string, proxyArray: any, data: any) => {
    return new Promise((resolve, reject) => {
        const files = values.uploadedProxies.fileList;
         // Read file
         let reader = new FileReader();
         reader.onload = (e) => {
             // called after readAsText
             proxyArray.push(e.target?.result);
             const arrayProxy: Array<string> = proxyArray[0].split('\n');
             data = objectifySets(name, arrayProxy)
             resolve(data)
             
         };
         reader.onerror = (e) => {
             reject(e);
         }
         reader.readAsText(files[0].originFileObj); 
     })
}

const objectifySets = (name: string, arrayProxy: Array<string>) => {
    let array: Array<Proxy> = [];
    let proxyObject: Proxy = { proxy: '', testStatus: { FootlockerCA: '', FootlockerUS: '' }, credential: '', usedBy: [] };
    let fields = [];
    let ipPort = '';
    let userPass: any = '';
    for (let i = 0; i < arrayProxy.length; i++) {
        fields = arrayProxy[i].split(':');
        ipPort = fields[0] + ':' + fields[1];
        userPass = fields[2] + ':' + fields[3];
        if (fields[2] === undefined && fields[3] === undefined) {
            userPass = null;
        } else {
            userPass = userPass.replace(/\r/gm,'');
        }
        proxyObject = { proxy: ipPort, testStatus: { FootlockerCA: 'idle', FootlockerUS: 'idle' }, credential: userPass, usedBy: [] };
        array.push(proxyObject);
    }
    return array;
    
};