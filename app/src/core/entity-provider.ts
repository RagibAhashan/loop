import { AccountGroup } from './account-group';
import { AccountGroupManager } from './account-group-manager';
import { ProfileGroup } from './profilegroup';
import { ProfileGroupManager } from './profilegroup-manager';
import { ProxySet } from './proxyset';
import { ProxySetManager } from './proxyset-manager';
import { TaskGroup } from './taskgroup';
import { TaskGroupManager } from './taskgroup-manager';

export class EntityProvider {
    taskGroupManager: TaskGroupManager;
    proxySetManager: ProxySetManager;
    profileGroupManager: ProfileGroupManager;
    accountGroupManager: AccountGroupManager;

    constructor(
        taskGroupManager: TaskGroupManager,
        proxySetManager: ProxySetManager,
        profileGroupManager: ProfileGroupManager,
        accountGroupManager: AccountGroupManager,
    ) {
        this.taskGroupManager = taskGroupManager;
        this.proxySetManager = proxySetManager;
        this.profileGroupManager = profileGroupManager;
        this.accountGroupManager = accountGroupManager;
    }

    public getProfileGroup(id: string): ProfileGroup {
        return this.profileGroupManager.getProfileGroup(id);
    }

    public getProxySet(id: string): ProxySet {
        return this.proxySetManager.getProxySet(id);
    }

    public getTaskGroup(id: string): TaskGroup {
        return this.taskGroupManager.getTaskGroup(id);
    }

    public getAccountGroup(id: string): AccountGroup {
        return this.accountGroupManager.getAccountGroup(id);
    }
}
