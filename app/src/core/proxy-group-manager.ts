import { IProxy, ProxyFormData } from '@core/proxy';
import { ipcMain } from 'electron';
import { ProxyGroupChannel } from './ipc-channels';
import { debug } from './log';
import { Manager } from './manager';
import { ProxyGroup, ProxyGroupViewData } from './proxy-group';
import { ProxyGroupStore } from './proxy-group-store';
import { TaskGroupStore } from './task-group-store';

const log = debug.extend('ProxyGroupManager');

export type ProxyGroupMap = Map<string, ProxyGroup>;

export class ProxyGroupManager extends Manager {
    private proxyGroupStore: ProxyGroupStore;
    private taskGroupStore: TaskGroupStore;

    constructor(proxyGroupStore: ProxyGroupStore, taskGroupStore: TaskGroupStore) {
        super();
        this.proxyGroupStore = proxyGroupStore;
        this.taskGroupStore = taskGroupStore;
    }

    protected async loadFromDB(): Promise<void> {
        await this.proxyGroupStore.loadFromDB();
    }

    private editProxyGroupName(setId: string, newName: string): ProxyGroupViewData[] {
        const proxySet = this.proxyGroupStore.getProxyGroup(setId);

        proxySet.editName(newName);

        return this.proxyGroupStore.getAllProxyGroupsViewData();
    }

    protected registerListeners(): void {
        ipcMain.handle(ProxyGroupChannel.getAllProxyGroups, (_): ProxyGroupViewData[] => {
            return this.proxyGroupStore.getAllProxyGroupsViewData();
        });

        ipcMain.on(ProxyGroupChannel.addProxyGroup, (event, id: string, name: string) => {
            const proxyGroups = this.proxyGroupStore.addProxyGroup(id, name);
            if (proxyGroups) {
                event.reply(ProxyGroupChannel.proxySetUpdated, proxyGroups, 'Proxy Set Created');
            } else {
                event.reply(ProxyGroupChannel.proxySetError, 'Proxy set already exists');
            }
        });

        ipcMain.on(ProxyGroupChannel.removeProxyGroup, (event, setId: string) => {
            // Make sure to update task that is using the proxy
            const proxySet = this.proxyGroupStore.getProxyGroup(setId);

            proxySet.getAllProxies().forEach((proxySet) => {
                const taskId = proxySet.taskId;

                if (taskId) {
                    const task = this.taskGroupStore.getTaskGroup(taskId.groupId).getTask(taskId.id);
                    task.proxy = null;
                }
            });

            const proxyGroups = this.proxyGroupStore.removeProxyGroup(setId);

            if (proxyGroups) {
                event.reply(ProxyGroupChannel.proxySetUpdated, proxyGroups, 'Proxy Set Deleted');
            } else {
                event.reply(ProxyGroupChannel.proxySetError, 'Error');
            }
        });

        ipcMain.on(ProxyGroupChannel.removeAllProxiesFromProxyGroup, (event, setId: string) => {
            const proxySet = this.proxyGroupStore.getProxyGroup(setId);

            proxySet.getAllProxies().forEach((proxySet) => {
                const taskId = proxySet.taskId;

                if (taskId) {
                    const task = this.taskGroupStore.getTaskGroup(taskId.groupId).getTask(taskId.id);
                    task.proxy = null;
                }
            });

            const proxyGroups = this.proxyGroupStore.removeAllProxies(setId);

            if (proxyGroups) {
                event.reply(ProxyGroupChannel.proxySetUpdated, proxyGroups, 'All Proxy Set Deleted');
            } else {
                event.reply(ProxyGroupChannel.proxySetError, 'Error');
            }
        });

        ipcMain.on(ProxyGroupChannel.addProxyToSet, (event, setId: string, proxyDatas: ProxyFormData[]) => {
            const proxies = proxyDatas.map((proxyData) => {
                const proxySplit = proxyData.proxy.split(':');
                const proxy: IProxy = {
                    hostname: proxySplit[0],
                    host: '',
                    port: proxySplit[1],
                    user: proxySplit[2],
                    password: proxySplit[3],
                    id: proxyData.id,
                    groupId: setId,
                    taskId: null,
                };
                return proxy;
            });

            const proxyList = this.proxyGroupStore.addProxyToSet(setId, proxies);

            if (proxyList) {
                event.reply(ProxyGroupChannel.proxiesUpdated, proxyList);
            } else {
                event.reply(ProxyGroupChannel.proxySetError, 'Error');
            }
        });

        ipcMain.on(ProxyGroupChannel.removeProxyFromSet, (event, setId: string, proxyIds: string[]) => {
            const proxySet = this.proxyGroupStore.getProxyGroup(setId);

            proxySet.getAllProxies().forEach((proxy) => {
                const taskId = proxySet.getProxy(proxy.id).taskId;

                if (taskId) {
                    const task = this.taskGroupStore.getTaskGroup(taskId.groupId).getTask(taskId.id);
                    task.proxy = null;
                }
            });

            const proxyList = this.proxyGroupStore.removeProxyFromSet(setId, proxyIds);
            if (proxyList) {
                event.reply(ProxyGroupChannel.proxiesUpdated, proxyList);
            } else {
                event.reply(ProxyGroupChannel.proxySetError, 'Error');
            }
        });

        ipcMain.on(ProxyGroupChannel.getProxyGroupProxies, (event, setId: string) => {
            const currentProxyGroup = this.proxyGroupStore.getProxyGroup(setId);
            if (currentProxyGroup) {
                const proxies = currentProxyGroup.getAllProxiesViewData();
                event.reply(ProxyGroupChannel.onProxyGroupSelected, currentProxyGroup.getViewData(), proxies);
            }
        });

        ipcMain.on(ProxyGroupChannel.editProxyGroupName, (event, setId: string, newName: string) => {
            const proxyGroups = this.editProxyGroupName(setId, newName);

            if (proxyGroups) {
                event.reply(ProxyGroupChannel.proxySetUpdated, proxyGroups);
            } else {
                event.reply(ProxyGroupChannel.proxySetError, 'Error');
            }
        });
    }
}
