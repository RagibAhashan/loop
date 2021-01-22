const { FOOTLOCKER_CA_HEADERS } = require('../constants/DefaultHeaders');
const { UserProfile } = require('../interface/UserProfile');
const { RequestInstance } = require('../RequestInstance');
const { FootLockerTask } = require('./FootLockerTask');
const { Fingerprint } = require('../Fingerprint');

const deviceId = Fingerprint.getDeviceId();

const userProfile = new UserProfile();
const axios = new RequestInstance('https://footlocker.ca/api', { timestamp: Date.now() }, FOOTLOCKER_CA_HEADERS);
const fl = new FootLockerTask(
    'https://www.footlocker.ca/en/product/nike-air-force-1-low-mens/4101086.html',
    '4101086',
    8.5,
    deviceId,
    axios,
    userProfile,
);

fl.execute();
