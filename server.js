const express = require('express');
const colors = require('colors');
const cors = require('cors')
const path = require('path')

const cookieParser = require('cookie-parser')

const err = require('./middlewares/error');
// ./docgen build -i  blogpost.postman_collection.json  -o index.html

// routes
const userRouter = require('./routes/user')
const postRouter = require('./routes/post')
const commentRouter = require('./routes/comment')

// sanitization
const mongoSanitize = require('express-mongo-sanitize');

// security header protection
const helmet = require("helmet");

// compress request
const compression = require('compression');

// cross-site scripting
const xss = require('xss-clean')

// rate limit and hpp
const hpp = require('hpp');
const rateLimit = require("express-rate-limit");

const dotenv = require('dotenv')

const databaseConn = require('./config/db');

// load dotenv
dotenv.config({path:'./config/config.env'});

const app = express();

// database connections
databaseConn();


// Set Static Folder
app.use(express.static(path.join(__dirname + '/public')));

// express middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// CORS
app.use(cors())

app.use(cookieParser())

// To remove data, use:
app.use(mongoSanitize());

//  X-XSS-Protection
app.use(helmet())

// Prevent cross-site scripting
app.use(xss())

// compress request to reduce load time
app.use(compression())

// protect against HTTP Parameter Pollution attacks
app.use(hpp())

// rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

//  apply to all requests
app.use(limiter);

app.use('/api/v1/users', userRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/comments', commentRouter);

// error middleware
app.use(err);


app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname +'/public/index.html'));
})

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