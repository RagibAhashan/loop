const ioGetBlackbox = require('../core/footlocker/scripts/snare');

/*
Static class that generate a device id used by footlocker and adyen payment system
This device id is just for spying on us, it should be generate only once and store in localstorage,
no need to generate it on every request
*/
export class Fingerprint {
    static getDeviceId() {
        let data = ioGetBlackbox();
        return data.blackbox;
    }
}
