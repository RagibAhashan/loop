import React from 'react';
import { Button } from 'antd';
import { useHistory } from "react-router-dom";

const LandingPage = () => {
    const history = useHistory();



    return (
        <div style={{padding:'20%', backgroundColor: 'black'}}>
            <Button type='primary' danger
            onClick={() => history.push('/dashboard')}
            >
                <a href="http://localhost:4000/oauth"> Dashboard </a>
            </Button>
        </div>
    )
}

export default LandingPage;