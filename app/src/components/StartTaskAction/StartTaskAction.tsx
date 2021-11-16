import { PlayCircleFilled } from '@ant-design/icons';
import { StoreType } from '@constants/Stores';
import { Button } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NOTIFY_START_TASK } from '../../common/Constants';
import { AppState } from '../../global-store/GlobalStore';
import { getTaskById, startTask } from '../../services/Store/StoreService';
import { startButton } from '../../styles/Buttons';

const StartTaskAction = (props: any) => {
    const { storeKey, uuid }: { storeKey: StoreType; uuid: string } = props;

    const task = useSelector((state: AppState) => getTaskById(state, storeKey, uuid));
    const dispatch = useDispatch();

    const handleStartTask = () => {
        dispatch(startTask({ storeKey, uuid }));
        window.ElectronBridge.send(NOTIFY_START_TASK(storeKey), task);
    };

    return <Button onClick={handleStartTask} style={startButton} icon={<PlayCircleFilled />} size="small" />;
};

export default StartTaskAction;
