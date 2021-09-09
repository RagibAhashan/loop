
const {generatePxCookies, test} = require('./px');

const main = async () => {
    try {

    for (let i = 0; i < 10; i++) {
    const cookies = generatePxCookies(i).then(cookies => {
        console.log('cookies yoooo ', i, ' ', cookies)

    })

    }
    


    console.log('stop script')
    }
    catch(error){ 
        console.log('after error ', error)
    }

}

main();