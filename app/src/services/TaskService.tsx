import { Select } from 'antd';
import { Observable, Subject } from 'rxjs';
import { ICaptcha } from '../components/Captcha/CaptchaFrame';
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

    saveCaptcha(captcha: ICaptcha) {
        this.captchaQueue.push(captcha);
    }

    removeCaptcha(uuid: string) {
        const index = this.captchaQueue.findIndex((cap) => cap.uuid === uuid);
        if (index > -1) {
            this.captchaQueue.splice(index, 1);
        }
    }

    dispatchCaptcha(): ICaptcha | undefined {
        return this.captchaQueue.shift();
    }
}

export const taskService = new TaskService();
