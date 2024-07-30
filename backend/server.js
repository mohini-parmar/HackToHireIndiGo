const { Flight , User , Notification } = require('./schema')
const {sendBulkEmail ,sendBulkSMS} = require('./email')
const express = require('express')
const bodyParser = require('body-parser');
const app = express();
const moment = require('moment');
const cors = require('cors')

app.use(cors())
app.use(bodyParser.json());

const statusMessage = {
    "On Time": `Your flight {{flightNumber}} is on Time. Departure Gate: {{gnum}}.<br/>We're excited to have you on board!`,
    "Delayed": `Flight Number {{flightNumber}} is Delayed. Updated schedule is {{newTime}} and your Gate number is {{gnum}}. <br/>We regret the inconvenience and appreciate your understanding.`,
    "Cancelled": `Due to heavy rain in Delhi your Flight {{flightNumber}} is Cancelled. <br/>We regret the inconvenience and appreciate your understanding.`,
};


function customizeMessage(template, flight) {
    return template
        .replace('{{flightNumber}}', flight.flight_id)
        .replace('{{newTime}}', moment(flight.actual_departure).format("YYYY-MM-DD HH:MM") || moment())
        .replace('{{gnum}}', flight.departure_gate);
}


app.get('/api/flights', async (req, res) => {
    try {
        const flights = await Flight.findAll(); 
        res.status(200).json(flights);
    } catch (error) {
        console.error('Error fetching flights:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.put('/api/flights/:flightId', async (req , res)=>{
    const {flightId} = req.params;
    const updatedData = req.body;
    try{
        const flight = await Flight.findOne({where : {flight_id : flightId}})
        if(!flight){
            return res.status(404).json({message : 'Flight not found'})
        }
        await flight.update(updatedData);
        const updatedFlight = await Flight.findOne({ where: { flight_id: flightId } });
        const users = await User.findAll({ where: { flight_id: flightId } });

        const status = updatedFlight.status;
        let messageTemplate = statusMessage[status];

        if (messageTemplate) {
            const customizedMessage = customizeMessage(messageTemplate, updatedFlight);

            const emailRecipients = users.map(user => user.email);
            const phoneRecipients = users.map(user => user.phone);

            sendBulkEmail(emailRecipients, `Your Indigo Flight is ${status}`, customizedMessage);
            sendBulkSMS(phoneRecipients.join(','), `Test SMS:\nCode is working \n${status}`)

            const emailNotifications = emailRecipients.map(email => ({
                flight_id: flightId,
                message: customizedMessage,
                timestamp: moment().toDate(),
                method: 'email',
                recipient: email,
            }));
            const allNotifications = [...emailNotifications]

            await Notification.bulkCreate(allNotifications);
        }else {
            console.log('Unknown flight status:', status);
        }

        res.status(200).json({ message: 'Flight updated successfully', flight });
    }catch(error){
        console.error('Error updating flight:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

app.post('/login',async(req, res)=>{
    try{
        const {uname ,pswd} = req.body
        console.log(req.body)
        
        if(!uname || !pswd){
            return res.status(400).json({ message: 'Username and password are required' });
        }
        const user = await User.findOne({where : {user_name : uname}})
        if(!user){
            return res.status(404).json({message : "user not found"})
        }
        if(pswd !== user.password){
            return res.status(400).json({message : 'Password is not correct!'})
        }
        res.status(200).json({message : user})
    }catch(err){
        res.status(500).json({ message: 'Internal server error' });
    }
})

module.exports = app