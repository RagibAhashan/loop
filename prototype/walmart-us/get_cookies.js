
const {generatePxCookies} = require('./px');

const main = async () => {
    try {
    const cookies = await generatePxCookies();

    console.log('cookies yoooo ', cookies)


    console.log('stop script')
    }
    catch(error){ 
        console.log('after error ', error)
    }

}

main();