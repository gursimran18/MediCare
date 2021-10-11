// Set the environment variables
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

//connect the database
const connectDB = require('./Server/database/connection')
connectDB();

const hostname = process.env.SERVER_HOSTNAME;
const port = process.env.SERVER_PORT || 3000;

// Start the server
const server = app.listen(port, hostname, () => {
    console.log(`Server started on port ${port}.`);
});