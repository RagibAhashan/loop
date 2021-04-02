import { Select } from 'antd';
import { Observable, Subject } from 'rxjs';
import { ICaptcha } from '../components/Captcha/CaptchaFrame';
import { Proxies, Proxy } from '../interfaces/OtherInterfaces';
import { StoreState } from './StoreService';
const { Option } = Select;

export const getProfiles = () => {
    let profs: any = JSON.parse(localStorage.getItem('profiles') as string);
    if (!profs) return [];
    const profilesTemp: any = [];

    profs.forEach((p: any) => {
        profilesTemp.push({
            label: p['profile'].toString(),
            value: p['profile'].toString(),
        });
    });

    return profilesTemp;
};

export const getProxies = (): any => {
    const proxiesOptions: any = [{ label: 'No Proxies', value: null }];
    let prox: any = JSON.parse(localStorage.getItem('proxies') as string);
    if (prox) {
        Object.entries(prox).forEach(([proxyName, proxies]: [string, unknown]) => {
            proxiesOptions.push({
                label: `${proxyName} (${(proxies as string[]).length} proxies)`,
                value: `${proxyName}`,
            });
        });
    }
    return proxiesOptions;
};

const otherSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XXXXL'];
export const getSizes = () => {
    let allSizes: any[] = [];
    for (let i = 4; i < 14; i += 0.5) {
        allSizes.push(
            <Option value={i.toString()} key={i.toString()}>
                {i.toString()}
            </Option>,
        );
    }

    otherSizes.forEach((size) => {
        allSizes.push(
            <Option value={size} key={size}>
                {size}
            </Option>,
        );
    });
    return allSizes;
};

export const assignProxy = (uuid: string, proxySet: string): Proxy | undefined => {
    const proxies = JSON.parse(localStorage.getItem('proxies') as string) as Proxies;
    if (!proxies) return undefined;
    const set = proxies[proxySet as string];
    // no proxies in the set
    if (set.length === 0) return undefined;

    //look for unused proxy and assign it to task
    for (const proxy of set) {
        const alreadyUsed = proxy.usedBy.find((id) => id === uuid);

        if (alreadyUsed) return proxy;

        // todo also check for test status (not banned)
        if (proxy.usedBy.length === 0) {
            proxy.usedBy.push(uuid);
            localStorage.setItem('proxies', JSON.stringify(proxies));
            return proxy;
        }
    }

    set[0].usedBy.push(uuid);
    localStorage.setItem('proxies', JSON.stringify(proxies));

    // if all proxies are being used just take the first one
    return set[0];
};

class TaskService {
    notifyStart = new Subject<void>();
    captchaQueue: ICaptcha[];
    currentCaptcha: ICaptcha | undefined;
    constructor() {
        this.captchaQueue = [];
        this.currentCaptcha = undefined;
    }

    notify(): void {
        this.notifyStart.next();
    }

    listenStart(): Observable<void> {
        return this.notifyStart.asObservable();
    }

    setRunning(storeKey: string, uuid: string, value: boolean): void {
        let store = JSON.parse(localStorage.getItem(storeKey) as string) as StoreState;

        if (!store) return;

        const newTasks = store.tasks.map((task) => (task.uuid === uuid ? { ...task, running: value } : task));

        store = { ...store, tasks: newTasks };

        localStorage.setItem(storeKey, JSON.stringify(store));
    }
}

export const taskService = new TaskService();
