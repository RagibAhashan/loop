import { SettingsChannel } from '@core/ipc-channels';
import { SettingsViewData } from '@core/settings';
import { Button, message, Switch } from 'antd';
import React, { useEffect, useState } from 'react';

const SettingsPage = () => {
    const [settings, setSettings] = useState<SettingsViewData>();

    useEffect(() => {
        window.ElectronBridge.invoke(SettingsChannel.getSettings).then((data: SettingsViewData) => {
            console.log('got settings', data);
            setSettings(data);
        });

        window.ElectronBridge.on(SettingsChannel.settingsUpdated, handleSettingsUpdated);

        return () => {
            window.ElectronBridge.removeAllListeners(SettingsChannel.settingsUpdated);
        };
    }, []);

    const handleSettingsUpdated = (_, settings: SettingsViewData, msg: string) => {
        setSettings(settings);
    };

    const handleSetBrowserPath = (value: string) => {
        console.log('path', value);
        window.ElectronBridge.send(SettingsChannel.setBrowserPath, value);
    };

    const handleSetDiscordWebHook = (value: string) => {
        console.log('disc', value);

        window.ElectronBridge.send(SettingsChannel.setDiscordWebhook, value);
    };

    const handleSetPublicCheckout = (checked: boolean) => {
        console.log('checked', checked);
        window.ElectronBridge.send(SettingsChannel.setPublicCheckout, checked);
    };

    const handleTestWebhook = async () => {
        const msg = await window.ElectronBridge.invoke(SettingsChannel.testDiscordWebhook);

        if (msg) {
            message.error(msg);
        }
    };

    return settings ? (
        <div style={{ height: '100%', width: '100%', padding: 10 }}>
            <div>
                <label> Browser Path </label>
                <input defaultValue={settings.browserPath} onBlur={(e) => handleSetBrowserPath(e.target.value)}></input>
            </div>

            <div>
                <label> Discord Web Hook </label>
                <input defaultValue={settings.discordWebHook} onBlur={(e) => handleSetDiscordWebHook(e.target.value)}></input>
                <Button onClick={handleTestWebhook}> Test </Button>
            </div>

            <div>
                <label> Public Checkout </label>
                <Switch defaultChecked onChange={handleSetPublicCheckout}></Switch>
            </div>
        </div>
    ) : (
        <div> ... </div>
    );
};
export default SettingsPage;
