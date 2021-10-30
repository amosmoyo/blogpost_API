const asyncHandler = require('../middlewares/async');
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const ErrorResponse = require('../utils/errResponce')

// @desc      Register user
// @route     POST /api/v1/users/register
// @access    Public
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

// @desc      Login user
// @route     POST /api/v1/users/login
// @access    Public
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

// @desc      Get all registered  users
// @route     GET /api/v1/users/
// @access    puplic
exports.getAllUser = asyncHandler(async (req,res,next) => {
  const query = User.find();
  const users = await query

  res.status(200)
  .json({
    success: true,
    counts: users.length,
    users
  })
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

// @desc      Get current logged in user
// @route     GET /api/v1/users/me
// @access    Private
exports.getMe = asyncHandler(async (req, res, next) => {
  // user is already available in req due to the protect middleware
  const user = req.user;

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Follow a person
// @route     PUT /api/v1/users/:personId/follow
// @access    Private
exports.follow = asyncHandler(async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);

      const currentUser = await User.findById(req.user.id);

      if (!user.followers.includes(req.user.id)) {
        await user.updateOne({ $push: { followers: req.user.id } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json({
          success: true,
          message: "user successful followed"
        });
      } else {
        res.status(403).json({
          success: true,
          message: "You are already following this person"
        });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json({
      success: false,
      message: "you can not follow yourself"
    });
  }
});

// @desc      Unfollow a person
// @route     PUT /api/v1/users/:personId/unfollow
// @access    Private
exports.unfollow =  asyncHandler(async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    try {
      // the guy i am unfollowing 
      const user = await User.findById(req.params.id);

      // me 
      const currentUser = await User.findById(req.user.id);

      if (user.followers.includes(req.user.id)) {
        await user.updateOne({ $pull: { followers: req.user.id } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json({
          success: true,
          message: "user has been unfollowed"
        });
      } else {
        res.status(403).json({
          success: false,
          message: "you dont follow this user"
        });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json({
      success: false,
      message: "you cant unfollow yourself"
    });
  }
});