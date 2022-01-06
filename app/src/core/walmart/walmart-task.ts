import { Profile } from '@core/profile';
import { ProfileGroupManager } from '@core/profilegroup-manager';
import { Proxy } from '@core/proxy';
import { ProxySet } from '@core/proxyset';
import { ProxySetManager } from '@core/proxyset-manager';
import { RequestInstance } from '@core/request-instance';
import { ITask, Task, TaskFormData, TaskViewData } from '@core/task';
import { Viewable } from '@core/viewable';

export interface WalmartFormData extends TaskFormData {
    offerId: string;
    productQuantity: number;
    productSKU: string;
}

export interface WalmartTaskViewData extends TaskViewData {
    productSKU: string;
    offerId: string;
    productQuantity: number;
}

export interface IWalmartTask extends ITask {
    offerId: string;
    productQuantity: number;
    productSKU: string;
}

export abstract class WalmartTask extends Task implements IWalmartTask, Viewable<WalmartTaskViewData> {
    public offerId: string;
    public productQuantity: number;
    public productSKU: string;

    constructor(
        uuid: string,
        retryDelay: number,
        userProfile: Profile,
        proxySet: ProxySet,
        proxy: Proxy,
        taskGroupName: string,
        requestInstance: RequestInstance,
        profileGroupManager: ProfileGroupManager,
        proxyManager: ProxySetManager,
        offerId: string,
        productQuantity: number,
        productSKU: string,
    ) {
        super(uuid, retryDelay, userProfile, proxySet, proxy, taskGroupName, requestInstance, profileGroupManager, proxyManager);
        this.offerId = offerId;
        this.productQuantity = productQuantity;
        this.productSKU = productSKU;
        this.createErrorInterceptor();
    }

    public getViewData(): WalmartTaskViewData {
        return {
            proxySetName: this.proxySet.name,
            uuid: this.uuid,
            retryDelay: this.retryDelay,
            profileName: this.userProfile.profileName,
            status: this.status,
            offerId: this.offerId,
            productQuantity: this.productQuantity,
            productSKU: this.productSKU,
            isRunning: this.isRunning,
        };
    }

    protected abstract createErrorInterceptor(): void;
}
