import { Select } from 'antd';
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

export const getSizes = () => {
    let allSizes: any[] = [];
    for (let i = 4; i < 14; i += 0.5) {
        allSizes.push(
            <Option value={i.toString()} key={i.toString()}>
                {i.toString()}
            </Option>,
        );
    }
    return allSizes;
};
