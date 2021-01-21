import { Button, Dropdown, Menu } from 'antd';
import React, { useEffect, useState } from 'react';

const buttonStyle = {
    backgroundColor: '#212427',
    width: '170px',
    height: '50px',
    marginLeft: '15px',
    marginRight: '15px',
    marginTop: '15px',
};

const ListStores = ['footlockerCa', 'Nike', 'Shopify'];

const TaskSideBar = () => {
    const [stores, setStores] = useState([]);

    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({} as any), []);

    useEffect(() => {
        setStores([]);
    }, []);

    const allStores = () => stores.map((val) => <Button style={buttonStyle}> {val} </Button>);

    useEffect(() => {
        console.log(allStores);
    }, [stores, setStores]);

    const menu = (
        <Menu style={{ width: '300px' }}>
            {ListStores.map((value: string, index: number) => (
                <Menu.Item
                    style={{ margin: '10px' }}
                    id={index.toString()}
                    onClick={() => {
                        let temp: any[] = stores;
                        temp.push(value);
                        setStores(temp as any);
                        console.log(stores, index);
                        forceUpdate();
                    }}
                >
                    {value}
                </Menu.Item>
            ))}
        </Menu>
    );

    return (
        <div style={{ minHeight: '100vh' }}>
            <Dropdown overlay={menu} placement="bottomRight">
                <Button
                    style={{
                        backgroundColor: '#212427',
                        borderColor: 'orange',
                        color: 'orange',
                        width: '170px',
                        height: '50px',
                        marginLeft: '15px',
                        marginRight: '15px',
                        marginTop: '15px',
                    }}
                >
                    {' '}
                    +Add Store
                </Button>
            </Dropdown>

            {stores.map((val: string, index: number) => (
                <Button style={buttonStyle} id={index.toString()} onClick={() => console.log(val, index)}>
                    {val}
                </Button>
            ))}
        </div>
    );
};

export default TaskSideBar;
