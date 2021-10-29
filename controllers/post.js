const path = require('path');
const ErrorResponse = require('../utils/errResponce');
const asyncHandler = require('../middlewares/async');
const Post = require('../models/Post');

// @desc      Get all posts
// @route     GET /api/v1/posts
// @access    Public
exports.getPosts = asyncHandler(async (req, res, next) => {
  const query = Post.find();

  const posts = await query

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
  const post = await Post.findById(req.params.id);

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
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new:true,
    runValidators: true
  })


  //  correct id format but no such object
  if(!post) {
    return res.status(400).json({
      status: false,
      message:'No such object'
    })
  }

  res.json({
    status: true,
    post
  })
});

// @desc      Delete Post
// @route     DELETE /api/v1/posts/:id
// @access    Private
exports.deletePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id)


  //  correct id format but no such object
  if(!post) {
    return res.status(400).json({
      status: false,
      message:'No such object'
    })

    // return next(new ErrorResponce(`The is no object like that in the database`, 404))
  }

  post.remove()

  res.json({
    status: true
  })

});