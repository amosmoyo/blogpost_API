const express = require('express');

const post = require('../controllers/post');

const {protect } = require('../middlewares/auth');

const commentsRouter = require('./comment')

const router = express.Router();

// re-routing
router.use('/:postId/comments', commentsRouter);

router.route('/').get(post.getPosts).post(protect, post.createPost);

router.route('/:id').get(post.getPost).put(protect, post.updatePost).delete(protect, post.deletePost);

router.put('/:id/like', protect, post.likePost);

router.put('/:id/unlike', protect, post.unlikePost);

module.exports = router;