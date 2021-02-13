import React from 'react';
import './Profile/profiles.css';

const Home = () => {
    const ProfileCard = (props: any) => {
        const { profile, cc_number, name } = props;

        return (
            <div className="profileCard">
                <h2 style={{ fontSize: '16px' }}> {profile} </h2>
                <h2 style={{ fontSize: '16px', marginTop: '35px' }}> {cc_number} </h2>
                <h4 style={{ fontSize: '12px', marginTop: '-10px' }}> {name} </h4>
            </div>
        );
    };

    return <div style={{ height: '100%', padding: '20px', overflow: 'auto' }}>Someone please delete this page</div>;
};

export default Home;
