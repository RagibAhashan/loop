import Editable from '@components/base/editable';
import { ProfileGroupChannel } from '@core/ipc-channels';
import { ProfileViewData } from '@core/profile';
import { ProfileGroupViewData } from '@core/profilegroup';
import { Form, Tabs } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import React, { useState } from 'react';

const { TabPane } = Tabs;

interface Props {
    isOpen: boolean;
    setOpen: (value: boolean) => void;
    profile: ProfileViewData;
    selectedProfileGroup: ProfileGroupViewData;
}

const EditProfileModal: React.FunctionComponent<Props> = (props) => {
    const { isOpen, setOpen, profile, selectedProfileGroup } = props;

    const [currentProfile, setCurrentProfile] = useState<ProfileViewData>();

    const [shippingForm] = Form.useForm();
    const [billingForm] = Form.useForm();
    const [paymentForm] = Form.useForm();

    const [country, setCountry] = useState('default');

    const [same, setSame] = useState(false);
    const [front, setFront] = useState(true);

    const [shipFirstName, setshipFirstName] = useState('');
    const [shipLastname, setshipLastName] = useState('');

    const [billFirstName, setFirstName] = useState('');
    const [billLastname, setLastName] = useState('');

    const [creditCard, setCreditCard] = useState('');
    const [cvc, setCvc] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');

    const changeMonth = (value: any) => {
        setMonth((prev) => (prev = value));
        setFront(true);
    };

    const changeYear = (value: any) => {
        setYear((prev) => (prev = value));
        setFront(true);
    };

    const editProfile = (value: any) => {
        console.log('edit !', value);
    };

    const onBillingSubmitEdit = (key: string, value: string) => {
        console.log('edited ', value);
        const billUpdate = { ...profile.billing, [key]: value };
        console.log('new update ', billUpdate);

        window.ElectronBridge.send(ProfileGroupChannel.editProfileBilling, selectedProfileGroup.id, profile.id, billUpdate);
    };

    const onProfileNameEdit = (value: string) => {
        console.log('old', profile.profileName, 'new profile name ', value);

        window.ElectronBridge.send(ProfileGroupChannel.editProfileName, selectedProfileGroup.id, profile.id, value);
    };

    return profile ? (
        <div>
            <Modal
                centered
                title="Edit profile"
                visible={isOpen}
                onOk={() => setOpen(false)}
                onCancel={() => setOpen(false)}
                width={1000}
                footer={false}
                destroyOnClose
            >
                <div style={{ padding: 24, backgroundColor: '#212427', borderRadius: '10px' }}>
                    <Tabs defaultActiveKey="shippingTab">
                        <TabPane tab="Profile and Shipping" key="shippingTab">
                            <Editable value={profile.profileName} onSubmit={onProfileNameEdit} />

                            <Editable value={profile.billing.firstName} onSubmit={(value: string) => onBillingSubmitEdit('firstName', value)} />
                        </TabPane>

                        <TabPane tab="Payment Information" key="billingTab">
                            <div> payment edit </div>
                        </TabPane>
                    </Tabs>
                </div>
            </Modal>
        </div>
    ) : null;
};

export default EditProfileModal;
