const nodeMailer = require('nodemailer')
const fs = require('fs');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const transport = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

const templatePath = path.join(__dirname, 'emailTemplate.html');
const template = fs.readFileSync(templatePath, 'utf-8');


function customizeTemplate(template, message) {
    return template.replace('{{message}}', message);
}

async function sendBulkEmail(recipient, subject, message) {
    const customizedTemplate = customizeTemplate(template, message);
    for (let i = 0; i < recipient.length; i++) {
        let mailOptions = {
            from: process.env.GMAIL_USER,
            to: recipient[i],
            subject: subject,
            html: customizedTemplate
        };
        try {
            transport.sendMail(mailOptions)
            console.log(`Email sent to ${recipient[i]}`);
        } catch (err) {
            console.log(`Error sending email to ${recipient[i]}:`, err);
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

// this is done , because I am not working for a company I can not be registered in DLT so I am able to send message to only one reciepient.
async function sendBulkSMS(phoneRecipients , message){

    const apikey = process.env.SMS_API_KEY;
    const url = 'https://www.fast2sms.com/dev/bulkV2';


        try{
            const res = await axios.post(
                url,{
                    route: 'q',
                    message: message.replace(/<br\/>/g, '\n').replace(/<\/?[^>]+(>|$)/g, ""), // Convert HTML to plain text
                    language: 'english',
                    flash: 0,
                    numbers: phoneRecipients,
                },
                {
                    headers :{
                        authorization : apikey,
                        'Content-type':'application/json'
                    }
                }
            );
            console.log(`SMS sent to ${phoneRecipients}`);
        }catch(err){
            console.log(`Error sending SMS to ${phoneRecipients}:`, err);
        }
    
}

module.exports = {
    sendBulkEmail,
    sendBulkSMS
}
