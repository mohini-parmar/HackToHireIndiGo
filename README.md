# HackToHireIndiGo

<h4>Case study briefing ::</h4>

<p>Tools and technologies used :
Frontend : React.js , Backend : Node.js , Database : PostgreSQL , Notifications : email , SMS.
</p>

<p>
For Fast2SMS I was able to achieve the functionality, however the SMS comes under category like OTP, Alerts, Informative SMS.So, It was not allowing me to send to recipients. In order to resolve it, I have sent Test message with flight status to recipients.
  
Screenshot of FE UI and Notification functionality : https://drive.google.com/drive/folders/1753ub0e38F8NtifqzW8DUrpcsPAbspJq?usp=drive_link
</p>

<p>
Frontend : I have used Accordion to achieve Flight list functionality.When Admin logs in his creds are saved in cookies using useContext state.Admin is enable to edit the flight details like Flight status, Gate Number , Actual Departure , Expected Arrival(In case of delay) via form.When the Flight detail is updated the push notification(in my case Email and SMS) will be sent to passanger.
</p>

<p>
Backend : I have created PostgreSQL database schema using sequelize, and added bulk data of Flight and User to it. I have created APIs for getting flight data, Updating flight data(which will at that time send email and SMS notification) and created login API for Admin. I have used nodemailer to achieve email service and Fast2SMS service to achieve SMS functionality. In Email, I have used google service to send mail and used fs to read my mail templet.
</p>
