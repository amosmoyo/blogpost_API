const ErrorResponse = require('../utils/errResponce');
const asyncHandler = require('../middlewares/async');
const Comment = require('../models/Comment');
const Post = require('../models/Post');


// @desc      Get comments
// @route     GET /api/v1/comments
// @route     GET /api/v1/posts/:postId/comments
// @access    Public
exports.getComments = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.postId) {
    console.log(req.params.postId)
    query = await Comment.find({ post: req.params.postId });
  } else {
    query = await Comment.find().populate({
      path:'post',
      select: 'title'
    })
  }


  res.status(200).json({
    success: true,
    count: query.length,
    query
  });

});


// @desc      Get single comment
// @route     GET /api/v1/comments/:id
// @access    Public
exports.getComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id).populate({
    path: 'post',
    select: 'title'
  });

  if (!comment) {
    return next(
      new ErrorResponse(`No comment with the id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    comment
  });
});


// @desc      Add comments
// @route     POST /api/v1/posts/:postId/courses
// @access    Private
exports.addComment = asyncHandler(async (req, res, next) => {
  req.body.post = req.params.postId;
  req.body.user = req.user.id;

  const post = await Post.findById(req.params.postId);

  if (!post) {
    return next(
      new ErrorResponse(
        `No post with the id of ${req.params.postId}`,
        404
      )
    );
  }
  // console.log(post.user.toString())
  // console.log(req.user.id)
  // Make sure user is post owner
  if (post.user.toString() === req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to add a comment to post ${post._id}`,
        401
      )
    );
  }

  const comment = await Comment.create(req.body);

  res.status(200).json({
    success: true,
    comment
  });
});


// @desc      Update comment
// @route     PUT /api/v1/comments/:id
// @access    Private
exports.updateComment = asyncHandler(async (req, res, next) => {
  let comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is comment owner
  if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update course ${course._id}`,
        401
      )
    );
  }

  comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  comment.save();

  res.status(200).json({
    success: true,
    comment
  });
});


// @desc      Delete comments
// @route     DELETE /api/v1/comments/:id
// @access    Private
exports.deleteComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is comment owner
  if (commment.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete course ${course._id}`,
        401
      )
    );
  }

  await comment.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});