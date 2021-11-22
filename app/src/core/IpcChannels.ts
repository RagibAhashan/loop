export enum TaskGroupChannel {
    getAllTaskGroups = 'dynasty:getAllTaskGroups',
    getTaskGroupTasks = 'dynasty:getTaskGroupTasks',
    addTaskGroup = 'dynasty:addTaskGroup',
    removeTaskGroup = 'dynasty:removeTaskGroup',
    taskGroupUpdated = 'dynasty:taskGroupUpdated',
    addTaskToGroup = 'dynasty:addTaskToGroup',
    removeTaskFromGroup = 'dynasty:removeTaskFromGroup',
    removeAllTasksFromGroup = 'dynasty:removeAllTasksFromGroup',
    tasksUpdated = 'dynasty:tasksUpdated', // Event when tasks are added or removed to group
    onTaskGroupSelected = 'dynasty:onTaskGroupSelected',
    taskGroupError = 'dynasty:taskGroupError',
}

export enum ProxySetChannel {
    getAllProxySets = 'dynasty:getAllProxySets',
    getProxySetProxies = 'dynasty:getProxySetProxies',
    addProxySet = 'dynasty:addProxySet',
    removeProxySet = 'dynasty:removeProxySet',
    addProxyToSet = 'dynasty:addProxyToSet',
    removeProxyFromSet = 'dynasty:removeProxyFromSet',
    proxiesUpdated = 'dynasty:proxiesUpdated', // Event when proxies are added or removed to set
    removeAllProxiesFromProxySet = 'dynasty:removeAllProxiesFromProxySet',
    proxySetUpdated = 'dynasty:proxySetUpdated',
    onSelectedProxySet = 'dynasty:onSelectedProxySet',
    proxySetError = 'dynasty:proxySetError',
}

export enum ProfileChannel {
    getAllProfiles = 'dynasty:getAllProfiles',
    getProfile = 'dynasty:getProfile',
    addProfile = 'dynasty:addProfile',
    removeProfile = 'dynasty:removeProfile',
    profileUpdated = 'dynasty:profileUpdated',
    onProfileSelected = 'dynasty:onProfileSelected',
    profileError = 'dynasty:profileError',
}
