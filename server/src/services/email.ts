import nodemailer from 'nodemailer';


const URL = 'http://localhost:3000';

export const sendRegistrationConfirmationEmail = async (email: string, name: string, LICENSE_KEY: string) => {
    const email_company = `DynastyAIO <${process.env.EMAIL_USERNAME}>`;
    const emailUser     = email;
    
    const transport = 
    {
        service: 'Gmail',
        auth: 
        {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASS     
        }
    }
    console.log('transport', transport);
    
    const smtpTransport = await nodemailer.createTransport(transport);
    
    const options = 
    {
        from:    email_company,
        to:      emailUser,
        subject: 'Confirm your account',
        html: `<html style='font-family: Arial, Helvetica, sans-serif; width: 60%; margin: auto;'>
                    <H1 > Dear ${name}, </H1>
                    <h3> Thanks for going to the moon with us 🚀 🚀 🚀 </h3>
                    <h3> License key: ${LICENSE_KEY} </h3>
                </html>`
    }
    
    await smtpTransport.sendMail(options, (err, info) => {   
        err ? console.log(err) : console.log(info)
    });
}

export const LicenseKeyActivated = async (email: string, name: string) => {
    const email_company = `DynastyAIO <${process.env.EMAIL_USERNAME}>`;
    const emailUser     = email;
    
    const transport = 
    {
        service: 'Gmail',
        auth: 
        {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASS     
        }
    }
    
    const smtpTransport = await nodemailer.createTransport(transport);
    
    const options = 
    {
        from:    email_company,
        to:      emailUser,
        subject: 'Confirm your account',
        html: `<html style='font-family: Arial, Helvetica, sans-serif; width: 60%; margin: auto;'>
                    <H1 > Dear ${name}, </H1>
                    <h3> Your license key is activated! </h3>
                    <h3> Happy botting 🚀 🚀 🚀🚀 🚀 🚀 </h3>
                </html>`
    }
    
    await smtpTransport.sendMail(options, (err, info) => {   
        err ? console.log(err) : console.log(info)
    });
}