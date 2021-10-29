const mongoose = require('mongoose')
const colors = require('colors')
// const dotenv = require('dotenv')
// const amos = require('../config/config.env')

// dotenv.config({path:'../config/config.env'})


// // connect local db for local development
// const DB = toString(process.env.LOCAL_DB);

// const dbConnect = () => {
//   mongoose
//     .connect(DB, {
//       useNewUrlParser: true,
//       useCreateIndex: true,
//       useFindAndModify: false,
//       useUnifiedTopology: true
//     })
//     .then(() => {
//       console.log(`DB connection successful!`.cyan.underline.bold);
//     })
//     .catch((err) => {
//       console.log('an erro occurred:  ', err);
//     });
// };
const dbConnect = async () => {
  const conn = await mongoose.connect(process.env.LOCAL_DB, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    useUnifiedTopology: true
  });

  console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
};

module.exports = dbConnect;