import { Account } from '@core/account';
import { Profile } from '@core/profile';
import { ProfileGroupManager } from '@core/profilegroup-manager';
import { ProxySet } from '@core/proxyset';
import { ProxySetManager } from '@core/proxyset-manager';
import { RequestInstance } from '@core/request-instance';
import { Task, TaskViewData } from '@core/task';
import { Viewable } from '@core/viewable';

export abstract class WalmartTask extends Task implements Viewable<TaskViewData> {
    constructor(
        id: string,
        retryDelay: number,
        productIdentifier: string,
        userProfile: Profile,
        proxySet: ProxySet | null,
        account: Account | null,
        productQuantity: number,
        taskGroupName: string,
        requestInstance: RequestInstance,
        profileGroupManager: ProfileGroupManager,
        proxyManager: ProxySetManager,
    ) {
        super(
            id,
            retryDelay,
            productIdentifier,
            userProfile,
            proxySet,
            account,
            productQuantity,
            taskGroupName,
            requestInstance,
            profileGroupManager,
            proxyManager,
        );

        this.createErrorInterceptor();
    }

    protected abstract createErrorInterceptor(): void;
}
