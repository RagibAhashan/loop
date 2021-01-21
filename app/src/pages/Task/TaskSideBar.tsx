import React, { useState, useEffect } from 'react';
import { Menu, Button, Dropdown } from 'antd';

const buttonStyle = {
    backgroundColor: '#212427',
    width:'170px',
    height: '50px',
    marginLeft:'15px',
    marginRight:'15px',
    marginTop: '15px'
}




const TaskSideBar = () => {

    const [stores, setStores] = useState([]);

    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);

    useEffect(() => {
        setStores([])
    }, [])

    const allStores = () => stores.map((val) => <Button style={buttonStyle}> {val} </Button>)


    useEffect(() => {
        console.log(allStores);
    }, [stores, setStores])

    const menu = (
        <Menu style={{width:'300px'}}>
          <Menu.Item style={{margin:'10px'}} onClick={
              () => {
                let temp = stores;
                temp.push('FootlockerCa')
                setStores(temp)
                console.log(stores)
                forceUpdate();
            }
          }>
            FootlockerCa
          </Menu.Item>
          <Menu.Item style={{margin:'10px'}} onClick={
              () => {
                let temp = stores;
                temp.push('Shopify')
                setStores(temp)
                console.log(stores)
                forceUpdate();
            }
          }>
            Shopify
          </Menu.Item>
          <Menu.Item style={{margin:'10px'}} onClick={
              () => {
                let temp = stores;
                temp.push('Nike')
                setStores(temp)
                console.log(stores)
                forceUpdate();
            }
          }>
            Nike
          </Menu.Item>
        </Menu>
      );


    return (
        <div style={{ minHeight: '100vh' }}>
            {/* <StoreButton name={'Footlocker'}/> */}
            <Dropdown overlay={menu} placement="bottomRight">
                <Button style={{
                    backgroundColor: '#212427',
                    borderColor: 'orange',
                    color: 'orange',
                    width:'170px',
                    height: '50px',
                    marginLeft:'15px',
                    marginRight:'15px',
                    marginTop: '15px'
                }}> +Add Store</Button>
            </Dropdown>

            {stores.map((val) => <Button style={buttonStyle}> {val} </Button>)}

            
        </div>
    )
}


export default TaskSideBar;