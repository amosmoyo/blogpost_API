const path = require('path');
const ErrorResponse = require('../utils/errResponce');
const asyncHandler = require('../middlewares/async');
const Post = require('../models/Post');

// @desc      Get all posts
// @route     GET /api/v1/posts
// @access    Public
exports.getPosts = asyncHandler(async (req, res, next) => {
  const query = Post.find().populate('Comments');

  const posts = await query

  console.log(posts.Comments)

  res.status(200)
  .json({
    success: true,
    counts: posts.length,
    posts
  })
});

// @desc      Get single post
// @route     GET /api/v1/posts/:id
// @access    Public
exports.getPost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id).populate('Comments')

  if (!post) {
    return next(
      new ErrorResponse(`Post not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, post });
});

// @desc      Create new post
// @route     POST /api/v1/post
// @access    Private
exports.createPost = asyncHandler(async (req, res, next) => {
  // Add user to req,body
  req.body.user = req.user.id;

  const post = await Post.create(req.body);

  res.status(201).json({
    success: true,
    post
  });
});

// @desc      Update posts
// @route     PUT /api/v1/posts/:id
// @access    Private
exports.updatePost = asyncHandler(async (req, res, next) => {

  let post = await Post.findById(req.params.id)

  //  correct id format but no such object
  if(!post) {
    return res.status(400).json({
      status: false,
      message:'No such object'
    })
  }

  console.log(post.user, req.user.id)

  if(post.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse('User not authorized to perform this action', 401)
    )
  }

  post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new:true,
    runValidators: true
  })

  res.json({
    status: true,
    post
  })
});

// @desc      Delete Post
// @route     DELETE /api/v1/posts/:id
// @access    Private
exports.deletePost = asyncHandler(async (req, res, next) => {
  let post = await Post.findById(req.params.id)


  //  correct id format but no such object
  if(!post) {
    return res.status(400).json({
      status: false,
      message:'No such object'
    })

    // return next(new ErrorResponce(`The is no object like that in the database`, 404))
  }

  if(post.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse('User not authorized to perform this action', 401)
    )
  }

  post.remove()

  res.json({
    status: true
  })

});


exports.likePost = asyncHandler( async (req, res, next) => {
  // let post = await Post.findByIdAndUpdate(req.params.id, {
  //   $push: {likes:req.user.id}
  // }, {new: true})

  let post = await Post.findById(req.params.id);

  // console.log(post.likes.includes(req.user.id))
  // console.log(post.likes.find(x => x === req.user.id))

  if (post.likes.includes(req.user.id)) {
    // await post.updateOne({ $push: { likes: req.body.userId } });
    // res.status(200).json("The post has been liked");
    return next(new ErrorResponse('Can not comment again', 400))
  }

  post = await Post.findByIdAndUpdate(req.params.id, {
     $push: {likes:req.user.id}
  }, {new: true})
  
  // res.status(200).json("The post has been liked");

  res.json({
    status: true,
    message: "The post has been like",
    post
  })
})

// const post = await Post.findById(req.params.id);
// if (!post.likes.includes(req.body.userId)) {
//   await post.updateOne({ $push: { likes: req.body.userId } });
//   res.status(200).json("The post has been liked");
// } else {
//   await post.updateOne({ $pull: { likes: req.body.userId } });
//   res.status(200).json("The post has been disliked");
// }



exports.unlikePost = asyncHandler( async (req, res, next) => {
  let post = await Post.findById(req.params.id);

  if (!post.likes.includes(req.user.id)) {
    // await post.updateOne({ $push: { likes: req.body.userId } });
    // res.status(200).json("The post has been liked");
    return next(new ErrorResponse('Can not unlike', 400))
  }

  // post = await post.updateOne({ $pull: { likes: req.body.user } });
  // res.status(200).json("The post has been liked");

  post = await Post.findByIdAndUpdate(req.params.id, {
    $pull: {likes:req.user.id}
  })

  res.status(200).json({
    success: true,
    message: 'The post has been unfollowed'
  })

})
