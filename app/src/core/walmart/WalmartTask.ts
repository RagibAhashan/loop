import { Profile } from '@core/Profile';
import { ProfileGroupManager } from '@core/ProfileGroupManager';
import { Proxy } from '@core/Proxy';
import { ProxySet } from '@core/ProxySet';
import { ProxySetManager } from '@core/ProxySetManager';
import { RequestInstance } from '@core/RequestInstance';
import { ITask, Task, TaskFormData, TaskViewData } from '@core/Task';
import { Viewable } from '@core/Viewable';

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
