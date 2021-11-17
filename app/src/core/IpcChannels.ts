export enum TaskGroupChannel {
    getAllTaskGroups = 'dynasty:getAllTaskGroups',
    getTaskGroupTasks = 'dynasty:getTaskGroupTasks',
    addTaskGroup = 'dynasty:addTaskGroup',
    removeTaskGroup = 'dynasty:removeTaskGroup',
    taskGroupUpdated = 'dynasty:taskGroupUpdated',
    taskLoaded = 'dynasty:taskLoaded',
    taskGroupError = 'dynasty:taskGroupError',
}

export enum ProxySetChannel {
    getAllProxySets = 'dynasty:getAllProxySets',
    getProxySetProxies = 'dynasty:getProxySetProxies',
    addProxySet = 'dynasty:addProxySet',
    removeProxySet = 'dynasty:removeProxySet',
    removeAllProxiesFromProxySet = 'dynasty:removeAllProxiesFromProxySet',
    proxySetUpdated = 'dynasty:proxySetUpdated',
    proxiesLoaded = 'dynasty:proxiesLoaded',
    proxySetError = 'dynasty:proxySetError',
}

export enum ProfileChannel {
    getAllProfiles = 'dynasty:getAllProfiles',
    getProfile = 'dynasty:getProfile',
    addProfile = 'dynasty:addProfile',
    removeProfile = 'dynasty:removeProfile',
    profileUpdated = 'dynasty:profileUpdated',
    profileLoaded = 'dynasty:profileLoaded',
    profileError = 'dynasty:profileError',
}
