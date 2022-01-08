import { ProfileGroupViewData } from '@core/profilegroup';
import { ProxySetViewData } from '@core/proxyset';
import { Form, InputNumber, Select } from 'antd';
import React, { useState } from 'react';

interface Props {
    profileGroups: ProfileGroupViewData[];
    proxySets: ProxySetViewData[];
    initialValues: any;
}
export const CommonTaskForm: React.FunctionComponent<Props> = (props) => {
    const { profileGroups, proxySets } = props;

    const [quantity, setQuantity] = useState(1);

    return (
        <div>
            <Form.Item>
                <Select defaultValue={null} style={{ width: 200 }}>
                    <Select.Option key={'null'} value={null}>
                        No Profile
                    </Select.Option>

                    {profileGroups.map((profileGroup) => {
                        return (
                            <Select.OptGroup key={profileGroup.id} label={profileGroup.name}>
                                {profileGroup.profiles.map((profile) => {
                                    return (
                                        <Select.Option disabled key={profile.id} value={profile.profileName}>
                                            {profile.profileName}
                                        </Select.Option>
                                    );
                                })}
                            </Select.OptGroup>
                        );
                    })}
                </Select>
            </Form.Item>
            <Form.Item name="profileName" label="Profile" rules={[{ required: false }]}>
                <Select allowClear options={[{ value: null, label: 'Null' }]} />
            </Form.Item>
            <Form.Item name="proxySet" label="Proxy Set" rules={[{ required: false }]}>
                <Select style={{ width: '100%' }} allowClear options={[{ value: null, label: 'Null' }]} />
            </Form.Item>
            <Form.Item name="retryDelay" label="Retry Delay" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="Task Quantity" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} value={quantity} onChange={(value) => setQuantity(value)} />
            </Form.Item>
        </div>
    );
};
