export const testIndividual = (proxyToTest: any, proxiesArray: Array<any>, store: any) => {
    for (let i = 0; i < proxiesArray.length; i++) {
        if (proxiesArray[i].proxy === proxyToTest) {
            if(store === 'FootlockerUS') {
                proxiesArray[i].testStatus.FootlockerUS = 'Testing...';
            } 
            else if (store === 'FootlockerCA') {
                proxiesArray[i].testStatus.FootlockerCA = 'Testing...';
            }
            break;
        }
    }
    return proxiesArray
};

export const stopIndividual = (proxyToStop: any, proxiesArray: Array<any>, store: any) => {
    for (let i = 0; i < proxiesArray.length; i++) {
        if (proxiesArray[i].proxy === proxyToStop) {
            if(store === 'FootlockerUS') {
                proxiesArray[i].testStatus.FootlockerUS = 'Canceled Test';
            } 
            else if (store === 'FootlockerCA') {
                proxiesArray[i].testStatus.FootlockerCA = 'Canceled Test';
            }
            break;
        }
    }
    return proxiesArray
};

export const testAll = () => {};