export enum TaskGroupChannel {
    getAllTaskGroups = 'dynasty:getAllTaskGroups',
    getAllTasksFromTaskGroup = 'dynasty:getAllTasksFromTaskGroup',
    getTaskFromTaskGroup = 'dynasty:getTaskFromTaskGroup',
    addTaskGroup = 'dynasty:addTaskGroup',
    removeTaskGroup = 'dynasty:removeTaskGroup',
    taskGroupUpdated = 'dynasty:taskGroupUpdated',
    addTaskToGroup = 'dynasty:addTaskToGroup',
    removeTaskFromGroup = 'dynasty:removeTaskFromGroup',
    removeAllTasksFromGroup = 'dynasty:removeAllTasksFromGroup',
    tasksUpdated = 'dynasty:tasksUpdated', // Event when tasks are added or removed to group
    onTaskGroupSelected = 'dynasty:onTaskGroupSelected',
    taskGroupError = 'dynasty:taskGroupError',
    stopTask = 'dynasty:stopTask',
    stopAllTasks = 'dynasty:stopAllTask',
    startTask = 'dynasty:startTask',
    startAllTasks = 'dynasty:startAllTasks',
    editTask = 'dynasty:editTask',
    editAllTasks = 'dynasty:editAllTasks',
    taskStatusUpdated = 'dynasty:taskStatusUpdated',
    editTaskGroupName = 'dynasty:editTaskGroupName',
    editTaskGroupStore = 'dynasty:editTaskGroupStore',
}

export enum TaskChannel {
    onTaskStatus = 'dynasty:onTaskStatus',
    onTaskSuccess = 'dynasty:onTaskSuccess',
    onCaptcha = 'dynasty:onCaptcha',
    onCaptchaSolved = 'dynasty:onCaptchaSolved',
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

export enum ProfileGroupChannel {
    getAllProfileGroups = 'dynasty:getAllProfiles',
    getAllProfileGroupsTree = 'dynasty:getAllProfileGroupsTree',
    getProfileGroup = 'dynasty:getProfileGroup',
    addProfileGroup = 'dynasty:addProfileGroup',
    removeProfileGroup = 'dynasty:removeProfileGroup',
    profileGroupUpdated = 'dynasty:profileGroupUpdated',
    onProfileGroupSelected = 'dynasty:onProfileGroupSelected',
    profileGroupError = 'dynasty:profileGroupError',
    getAllProfilesFromProfileGroup = 'dynasty:getAllProfilesFromProfileGroup',
    getProfileFromProfileGroup = 'dynasty:getProfileFromProfileGroup',
    addProfileToGroup = 'dynasty:addProfileToGroup',
    removeProfileFromProfileGroup = 'dynasty:removeProfileFromProfileGroup',
    removeAllProfilesFromProfileGroup = 'dynasty:removeAllProfilesFromProfileGroup',
    profilesUpdated = 'dynasty:tasksUpdated', // Event when profiles are added or removed to group
    editProfileGroupName = 'dynasty:editProfileGroupName',
    editProfileName = 'dynasty:editProfileName',
    editProfileShipping = 'dynasty:editProfileShipping',
    editProfileBilling = 'dynasty:editProfileBilling',
    editProfilePayment = 'dynasty:editProfilePayment',
}
