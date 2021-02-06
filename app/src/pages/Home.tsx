import React from 'react';
import { Space } from 'antd';
import './Profile/profiles.css'



const Home = () => {


    const ProfileCard = (props: any) => {
        const { profile, cc_number, name } = props;

        return (
            <div className='profileCard' >
                <h2 style={{ fontSize: '16px'}}> {profile} </h2>
                <h2 style={{ fontSize: '16px', marginTop: '35px'}}> {cc_number} </h2>
                <h4 style={{ fontSize: '12px', marginTop: '-10px'}}> {name} </h4>
            </div>
        );
    }




    return (
    <div style={{ backgroundColor: '#212427', height: '100vh', padding: '20px' }}>
    
    <div style={{ display: 'flex', flexWrap: 'wrap'}}>

        <ProfileCard
            profile={'Footlocker Profile'}
            cc_number={'1233 1231 1233 1231'}
            name={'Pritam Patel'}
        />

        <ProfileCard
            profile={'Footlocker Profile'}
            cc_number={'1233 1231 1233 1231'}
            name={'Pritam Patel'}
        />

        <ProfileCard
            profile={'Footlocker Profile'}
            cc_number={'1233 1231 1233 1231'}
            name={'Pritam Patel'}
        />

        <ProfileCard
            profile={'Footlocker Profile'}
            cc_number={'1233 1231 1233 1231'}
            name={'Pritam Patel'}
        />

    </div>

    </div>
    )
};

export default Home;
