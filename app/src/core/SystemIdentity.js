const si = require('systeminformation');
const hash = require('object-hash');

class SystemIdentity {
    SystemIdentity() {
        // console.log('constructor');
    }

    // getMachineUniqueID = async () => {
    //     // si.system()
    //     // .then(async (data) => {
    //     //     const hashed_data = await hash(data);
    //     //     console.log(data);
    //     //     console.log(hashed_data)
    //     //     Window.localStorage.setItem('HO', 'HIHOHOHOH')
    //     // })

        
    //     try {
    //         const SYSTEM_ID     = await si.system();
    //         const HASHED_DATA   = await hash(SYSTEM_ID);
    //         return HASHED_DATA; 
    //     } catch (error) {
    //         throw new Error('Could not fetch system information');
    //     }
    // }
}

module.exports = { SystemIdentity };