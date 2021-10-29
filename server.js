const express = require('express');
const colors = require('colors');

const userRouter = require('./routes/user')

const dotenv = require('dotenv')

const databaseConn = require('./config/db');

// load dotenv
dotenv.config({path:'./config/config.env'});

const app = express();

// database connections
databaseConn();


app.use('/api/v1/users', userRouter);

const  port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`The app is running in ${process.env.NODE_ENV} on port ${port}`.yellow.bold);
})


//  unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.bold.red);
  // close server and exit and is 1 for default error
  server.close(() => process.exit(1));

})