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

export enum ProxyGroupChannel {
    getAllProxyGroups = 'dynasty:getAllProxyGroups',
    getProxyGroupProxies = 'dynasty:getProxyGroupProxies',
    addProxyGroup = 'dynasty:addProxyGroup',
    removeProxyGroup = 'dynasty:removeProxyGroup',
    addProxyToSet = 'dynasty:addProxyToSet',
    removeProxyFromSet = 'dynasty:removeProxyFromSet',
    proxiesUpdated = 'dynasty:proxiesUpdated', // Event when proxies are added or removed to set
    removeAllProxiesFromProxyGroup = 'dynasty:removeAllProxiesFromProxyGroup',
    proxySetUpdated = 'dynasty:proxySetUpdated',
    onProxyGroupSelected = 'dynasty:onProxyGroupSelected',
    proxySetError = 'dynasty:proxySetError',
    editProxyGroupName = 'dynasty:proxySetName',
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

export enum SettingsChannel {
    getSettings = 'dynasty:getSettings',
    setBrowserPath = 'dynasty:setBrowserPath',
    setDiscordWebhook = 'dynasty:setDiscordWebhook',
    setPublicCheckout = 'dynasty:setPublicCheckout',
    settingsUpdated = 'dynasty:settingsUpdated',
    testDiscordWebhook = 'dynasty:testDiscordWebhook',
}

export enum AccountGroupChannel {
    getAccountGroups = 'dynasty:getAccounts',
    addAccountGroup = 'dynasty:addAccountGroup',
    removeAccountGroup = 'dynasty:removeAccountGroup',
    getAllAccountsFromGroup = 'dynasty:getAllAccountsFromGroup',
    accountGroupsUpdated = 'dynasty:accountGroupsUpdated',
    accountsUpdated = 'dynasty:accountsUpdated',
    accountGroupError = 'dynasty:accountGroupError',
    addAccountToGroup = 'dynasty:addAccountToGroup',
    removeAccountFromGroup = 'dynasty:removeAccountFromGroup',
    removeAllAccountsFromGroup = 'dynasty:removeAllAccountsFromGroup',
    getAccountFromAccountGroup = 'dynasty:getAccountFromAccountGroup',
    onAccountGroupSelected = 'dynasty:onAccountGroupSelected',
    editAccountGroupName = 'dynasty:editAccountGroupName',
    logIn = 'dynasty:logIn',
    logOut = 'dynasty:logOut',
}
