import React from 'react';
import { Space } from 'antd';
import './Profile/profiles.css';

const Home = () => {
    const Profile = (props: any) => {
        const { profile, cc_number, name } = props;
        const colors = ['#D71A1A', '#FF2674', '#FF8E26'];
        const random = Math.floor(Math.random() * colors.length);

        return (
            <div className="profileCard">
                <h2 style={{ fontSize: '16px' }}> {profile} </h2>
                <h2 style={{ fontSize: '16px', marginTop: '35px' }}> {cc_number} </h2>
                <h4 style={{ fontSize: '12px', marginTop: '-10px' }}> {name} </h4>
            </div>
        );
    };

    return (
        <div style={{ backgroundColor: '#212427', height: '100vh', overflow: 'auto', padding: '20px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                <Profile profile={'Footlocker Profile'} cc_number={'1233 1231 1233 1231'} name={'Pritam Patel'} />

                <Profile profile={'Footlocker Profile'} cc_number={'1233 1231 1233 1231'} name={'Pritam Patel'} />

                <Profile profile={'Footlocker Profile'} cc_number={'1233 1231 1233 1231'} name={'Pritam Patel'} />

                <Profile profile={'Footlocker Profile'} cc_number={'1233 1231 1233 1231'} name={'Pritam Patel'} />

                <Profile profile={'Footlocker Profile'} cc_number={'1233 1231 1233 1231'} name={'Pritam Patel'} />

                <Profile profile={'Footlocker Profile'} cc_number={'1233 1231 1233 1231'} name={'Pritam Patel'} />
            </div>
        </div>
    );
};

export default Home;
