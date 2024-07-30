const app= require('./server')
const { sequelize, AddSchema } = require('./schema');

const port = process.env.PORT || 3000;

const initializeDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        await AddSchema();
    } catch (err) {
        console.error('Unable to connect to the database:', err);
    }
};

initializeDatabase()
.then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});