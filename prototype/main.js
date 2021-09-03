const axios = require('axios').default;

const m = async () => {
    try {
        axios.defaults.baseURL = 'https://walmart.com';

        const r2 = await axios.get('', {
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
            },
        });
        console.log('HEEEEEEEY', r2.status);
    } catch (e) {
        console.log('EROOOOOOOOR', e.request.url);
    }
};

m();


product page

AID
com.wm.reflector
next-day
location-data	
DL	
NSID	
TB_Latency_Tracker_100	
TB_Navigation_Preload_01	
TB_SFOU-100
TB_DC_Flap_Test	
g	
g_e	
vtc	
bstc	
mobileweb	
xpa	
xpm	
exp-ck	
TS01b0be75	
TS013ed49a
akavpau_p8	

home page


AID
com.wm.reflector


*next-day
*location-data	
*DL
*NSID	
*TB_Latency_Tracker_100	
*TB_Navigation_Preload_01	
*TB_SFOU-100	
*TB_DC_Flap_Test	
*g	
*g_e	
*vtc	
*bstc	
*mobileweb	
*xpa	
*xpm	
*exp-ck	
*TS01b0be75	
*TS013ed49a	
*akavpau_p8