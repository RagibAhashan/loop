import { ProxySetViewData } from '@core/proxyset';
import React from 'react';
interface Props {
    proxySets: ProxySetViewData[];
    defaultValue: any;
    register: any;
    error?: any;
}
const ProxySelectDropdown: React.FunctionComponent<Props> = (props) => {
    const { proxySets, defaultValue, register, error } = props;

    return (
        <label>
            Proxy
            <select className={error && 'input--error'} defaultValue={defaultValue} style={{ width: 200 }} {...register}>
                <option key={'null'} value={defaultValue}>
                    No Proxy
                </option>

                {proxySets.map((proxySet) => {
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
