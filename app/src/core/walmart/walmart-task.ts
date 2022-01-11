import { Account } from '@core/account';
import { Profile } from '@core/profile';
import { ProxyGroup } from '@core/proxy-group';
import { RequestInstance } from '@core/request-instance';
import { Task, TaskViewData } from '@core/task';
import { Viewable } from '@core/viewable';

export abstract class WalmartTask extends Task implements Viewable<TaskViewData> {
    constructor(
        id: string,
        retryDelay: number,
        productIdentifier: string,
        userProfile: Profile,
        proxySet: ProxyGroup | null,
        account: Account | null,
        productQuantity: number,
        taskGroupName: string,
        requestInstance: RequestInstance,
    ) {
        super(id, retryDelay, productIdentifier, userProfile, proxySet, account, productQuantity, taskGroupName, requestInstance);

        this.createErrorInterceptor();
    }

    protected abstract createErrorInterceptor(): void;
}
