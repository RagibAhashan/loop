import { Proxy } from '../../interfaces/OtherInterfaces';
const UPLOAD = '1';
const COPYPASTE = '2';

export const onAdd = (values: any, currentSetName: any, currentTabName: any) => {
    const name = currentSetName;
    const proxyArray: any = [];

    if (currentTabName === UPLOAD) {
        const files = values.uploadedProxies.fileList;
        // Read file
        let reader = new FileReader();
        reader.onload = (e) => {
            // called after readAsText
            proxyArray.push(e.target?.result);
            const arrayProxy: Array<string> = proxyArray[0].split('\n');
            const data = objectifySets(name, arrayProxy)
            console.log(data)
            return data;
        };
        reader.readAsText(files[0].originFileObj);
    } else if (currentTabName === COPYPASTE) {
        proxyArray.push(values.copiedProxies);
        const arrayProxy: Array<string> = proxyArray[0].split('\n');
        const data = objectifySets(name, arrayProxy)
        return data;
    }
};

export const objectifySets = (name: string, arrayProxy: Array<string>) => {
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
        }
        proxyObject = { proxy: ipPort, testStatus: { FootlockerCA: 'idle', FootlockerUS: 'idle' }, credential: userPass, usedBy: [] };
        array.push(proxyObject);
    }
    return array;
    
};