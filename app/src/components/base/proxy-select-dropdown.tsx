import { ProxyGroupViewData } from '@core/proxy-group';
import React from 'react';
interface Props {
    proxyGroups: ProxyGroupViewData[];
    defaultValue: any;
    register: any;
    error?: any;
}
const ProxySelectDropdown: React.FunctionComponent<Props> = (props) => {
    const { proxyGroups, defaultValue, register, error } = props;

    return (
        <label>
            Proxy
            <select className={error && 'input--error'} defaultValue={defaultValue} style={{ width: 200 }} {...register}>
                <option key={'null'} value={defaultValue}>
                    No Proxy
                </option>

                {proxyGroups.map((proxySet) => {
                    return (
                        <option key={proxySet.id} value={proxySet.id}>
                            {proxySet.name}
                        </option>
                    );
                })}
            </select>
        </label>
    );
};

export default ProxySelectDropdown;
