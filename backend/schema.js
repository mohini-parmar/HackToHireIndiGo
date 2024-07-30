// to create the schema and add the initial data run 'node schema.js'

require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize')
const fs = require('fs')

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT,
    logging: console.log,
    dialectOptions: {
        connectTimeout: 60000 // Increase the timeout as needed
    }
})

const Flight = sequelize.define(
    'Flight', {
    flight_id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    airline: { type: DataTypes.STRING },
    status: { type: DataTypes.STRING },
    from: { type: DataTypes.STRING },
    to: { type: DataTypes.STRING },
    departure_gate: { type: DataTypes.STRING },
    arrival_gate: { type: DataTypes.STRING },
    scheduled_departure: { type: DataTypes.DATE },
    scheduled_arrival: { type: DataTypes.DATE },
    actual_departure: { type: DataTypes.DATE },
    actual_arrival: { type: DataTypes.DATE }
}
)

const Notification = sequelize.define(
    'Notification', {
    notification_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    flight_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Flight,
            key: 'flight_id'
        }
    },
    message: { type: DataTypes.STRING },
    timestamp: { type: DataTypes.DATE },
    method: { type: DataTypes.STRING },
    recipient: { type: DataTypes.STRING },
},{
    timestamps : false,
}
)

const User = sequelize.define(
    'User',{
        user_id :{
            type : DataTypes.STRING,
            primaryKey : true,
            allowNull : false
        },
        user_type :{
            type : DataTypes.STRING
        },
        user_name:{
            type : DataTypes.STRING
        },
        password : {
            type : DataTypes.STRING
        },
        email :{
            type : DataTypes.STRING
        },
        phone :{
            type : DataTypes.BIGINT 
        },
        flight_id: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: Flight,
                key: 'flight_id'
            }
        }
})

const AddSchema = async () => {
    try {
        await sequelize.authenticate();
        console.log('connection has been establisheddddd')
        await sequelize.sync()

        const fcnt = await Flight.count()
        if (fcnt === 0) {
            const flightsData = JSON.parse(fs.readFileSync('flightdata.json', 'utf8'));
            await Flight.bulkCreate(flightsData);
        } 

        const ucnt = await User.count()
        if(ucnt === 0){
            const userData = JSON.parse(fs.readFileSync('userdata.json', 'utf8'))
            await User.bulkCreate(userData)
        }
    } catch (err) {
        console.error('unable to connect', err)
    }
}

module.exports = {
    sequelize,
    Flight,
    User,
    Notification,
    AddSchema,
};

