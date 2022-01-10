import { AccountGroupViewData } from '@core/account-group';
import React from 'react';
interface Props {
    accountGroups: AccountGroupViewData[];
    defaultValue: any;
    register: any;
    error?: any;
}
const AccountDropdown: React.FunctionComponent<Props> = (props) => {
    const { accountGroups, defaultValue, register, error } = props;

    return (
        <label>
            Account
            <select className={error && 'input--error'} defaultValue={defaultValue} style={{ width: 200 }} {...register}>
                <option key={'null'} value={defaultValue}>
                    Guest
                </option>

                {accountGroups.map((accountGroup) => {
                    return (
                        <optgroup key={accountGroup.id} label={accountGroup.name}>
                            {accountGroup.accounts.map((account) => {
                                return (
                                    <option key={account.id} value={`${account.groupId}:${account.id}`}>
                                        {account.name}
                                    </option>
                                );
                            })}
                        </optgroup>
                    );
                })}
            </select>
        </label>
    );
};

export default AccountDropdown;
