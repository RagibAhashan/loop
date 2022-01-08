import { ProxySetViewData } from '@core/proxyset';
import React from 'react';
interface Props {
    proxySets: ProxySetViewData[];
    defaultValue: any;
    register: any;
    name: string;
}
const ProxySelectDropdown: React.FunctionComponent<Props> = (props) => {
    const { proxySets, defaultValue, register, name } = props;

    return (
        <select defaultValue={defaultValue} style={{ width: 200 }} {...register(name)}>
            <option key={'null'} value={undefined}>
                No Proxy
            </option>

            {proxySets.map((proxySet) => {
                return (
                    <option key={proxySet.id} value={proxySet.name}>
                        {proxySet.name}
                    </option>
                );
            })}
        </select>
    );
};

export default ProxySelectDropdown;
