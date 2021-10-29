const asyncHandler = require('../middlewares/async');
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const ErrorResponse = require('../utils/errResponce')

exports.registerUser = asyncHandler( async(req, res, next) =>{
  console.log(req.body)

  const { name, email, password } = req.body;

  const user = await User.create({
    name, email, password
  })

  // create token

  // const token = user.getJWT()

  // res.status(200).json({
  //   success: true, token
  // })

  sendTokenResponse(user, 200, res)
})

// login
exports.loginUser = asyncHandler( async(req, res, next) =>{

  const { email, password } = req.body;

  // validate email and password
  if(!email || !password) {
    return next(new ErrorResponse('Please provide email and password', 400))
    // return res.status(400).json({
    //   success: false,
    //   message: 'Please provide email and password'
    // })
  }

  // check for user
  const user = await User.findOne({email}).select('+password');

  console.log(email, password, 2, user)

  if(!user) {
    // return new ErrorResponse('Invalid cresidential', 401)
    return res.status(401).json({
      success: false,
      message: 'Invalid cresidential try again'
    })
  }

  // compare passwords
  const compare = await user.comparePass(password);

  if(!compare) {
    // return new ErrorResponse('Invalid cresidential', 401)
    return res.status(401).json({
      success: false,
      message: 'Invalid cresidential try again'
    })
  }

  // create token
  // const token = user.getJWT()

  // res.status(200).json({
  //   success: true, token
  // })

  sendTokenResponse(user, 200, res)

})


// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getJWT();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
  });
};