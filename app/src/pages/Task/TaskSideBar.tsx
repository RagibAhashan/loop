import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import StoreButton from './StoreButton'

const TaskSideBar = () => {

    const [stores, setStores] = useState([]);

    useEffect(() => {
        setStores([<StoreButton name={'Footlocker'}/>])
    }, [])

    let allStores = () => {
        return (
            stores.map((val) => val)
        )
    }

    useEffect(() => {
        console.log(allStores);
    }, [stores, setStores])


    return (
        <div style={{ minHeight: '100vh' }}>
            {/* <StoreButton name={'Footlocker'}/> */}
            {allStores}

            <Button style={{
                backgroundColor: '#212427',
                width:'170px',
                height: '50px',
                marginLeft:'15px',
                marginRight:'15px',
                marginTop: '15px'
                }}
                onClick={() => {
                    let temp = stores;
                    temp.push(<StoreButton name={'new one!'}/>)
                    setStores(temp)
                    // console.log(stores)
                }}
            >
                +
            </Button>
        </div>
    )
}


export default TaskSideBar;