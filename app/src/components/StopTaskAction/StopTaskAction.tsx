import { StopFilled } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';
import { NOTIFY_STOP_TASK } from '../../common/Constants';
import { stopTask } from '../../services/Store/StoreService';
import { stopButton } from '../../styles/Buttons';

const StopTaskAction = (props: any) => {
    const { storeKey, uuid } = props;

    const dispatch = useDispatch();

    const handleStopTask = () => {
        dispatch(stopTask({ storeKey, uuid }));
        window.ElectronBridge.send(NOTIFY_STOP_TASK(storeKey), uuid);
    };

    return <Button onClick={handleStopTask} style={stopButton} icon={<StopFilled />} size="small" />;
};

export default StopTaskAction;
