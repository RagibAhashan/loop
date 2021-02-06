import { Col, Divider, message, Row, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import CreateNewProfileModal from './createNewProfile';
import EditProfileModal from './editProfileModal';

const getYears = (): any => {
    const year = new Date().getFullYear();
    let years = [];
    for (let i = year; i < year + 15; i++) {
        years.push({
            value: i,
            label: i,
        });
    }
    return years;
};

const UserFormData = {
    profile: '',
    same: false,
    shipping: {
        address: '88 address',
        city: '88 city',
        email: '88 email',
        firstname: '88 email',
        lastname: '88 email',
        phone: '88 email',
        postalcode: '88 email',
        province: '88 email',
    },

    billing: {
        address: '88 billing',
        city: '88 billing',
        email: '88 billing',
        firstname: '88 billing',
        lastname: '88 billing',
        phone: '88 billing',
        postalcode: '88 billing',
        province: '88 billing',
    },

    payment: {
        credit: 'dasd',
        cvc: 'dasd',
        month: 'asd',
        year: 'asdasd',
    },
};

const ProfilePage = () => {
    const [profiles, setUserProfiles] = useState([UserFormData, UserFormData, UserFormData, UserFormData, UserFormData, UserFormData]);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [currentSelectedCard, setCurrentSelectedCard] = useState({});


    useEffect(() => {

        let db_profiles: any = localStorage.getItem('profiles');
        if (!db_profiles) {
            db_profiles = [];
            localStorage.setItem('profiles', '[]');
        } else {
            db_profiles = JSON.parse(db_profiles);
        }

        setUserProfiles(db_profiles);
    }, []);

    const onFinish = (values: any) => {
        for (let i = 0; i < profiles.length; i++) {
            if (profiles[i].profile === values.profile) {
                message.error(`Profile "${profiles[i].profile}" already exists!`);
                return null;
            }
        }

        if (values.same) {
            values['billing'] = values.shipping;
        }

        message.success('Profile created!');

        let prev_profiles = profiles;
        prev_profiles.push(values);

        setUserProfiles(prev_profiles);
        localStorage.setItem('profiles', JSON.stringify(prev_profiles));
    };

    const onDeleteProfile = (profileID: String): void => {
        if (profiles.length === 1 && profiles[0].profile === profileID) {
            localStorage.removeItem('profiles');
            setUserProfiles([]);
            localStorage.setItem('profiles', JSON.stringify([]));

            return;
        }

        for (let i = 0; i < profiles.length; i++) {
            if (profiles[i].profile === profileID) {
                let old_profiles = profiles;
                old_profiles.splice(i, 1);

                // localStorage.removeItem('profiles');
                localStorage.setItem('profiles', JSON.stringify(old_profiles));
                setUserProfiles(old_profiles);

                return;
            }
        }
    };

    const ProfileCard = (props: any) => {
        const { data } = props;
        const profile = data.profile;

        const full_num = data.payment.credit
        const len = full_num.length;
        const cc_num = `${full_num.substring(0,4)} ${full_num.substring(4,8)} ${full_num.substring(8,12)} ${full_num.substring(12,len)}`



        const cc_number= cc_num
        const name= `${data.shipping.firstname} ${data.shipping.lastname}`.toUpperCase()



        return (
            <div className='profileCard'
                onClick={() => {
                    setIsEditModalVisible(true);
                    setCurrentSelectedCard(prev => prev = data);
                }}
            >
                <h2 style={{ fontSize: '16px'}}> {profile} </h2>
                <h2 style={{ fontSize: '16px', marginTop: '35px'}}> {cc_number} </h2>
                <h4 style={{ fontSize: '12px', marginTop: '-10px'}}> {name} </h4>
            </div>
        );
    }

    const ShowProfiles = (all_profils: any[]) => {
        if (!all_profils.length) return <h1> No Profile Found. </h1>;

        return all_profils.map((value) => {
            return (
                <ProfileCard data={value} />
            );
        });
    };

    return (
        <div style={{ backgroundColor: '#212427', height: '100vh', padding: '20px' }}>
            {/* <div style={{ backgroundColor: '#212427', height: '100vh', padding: '20px' }}></div> */}
                <div style={{float: 'right'}}>
                    <CreateNewProfileModal onFinish={onFinish}/>
                </div>
            <div style={{ padding: 24, backgroundColor: '#212427', display: 'flex', flexWrap: 'wrap'}}>

                <Divider> My Profiles </Divider>

                {isEditModalVisible ? 
                
                // Dont change this. It will literally break everything.
                // There is a deficit in the Modal design in antd.
                <EditProfileModal
                isEditModalVisible={isEditModalVisible}
                setIsEditModalVisible={setIsEditModalVisible}
                data={currentSelectedCard}
                />
                : <div/>
            }

                {ShowProfiles(profiles)}

        </div>
        </div>
    );
};

export default ProfilePage;
