const express = require('express');

const post = require('../controllers/post')

const router = express.Router();

router.route('/').get(post.getPosts).post(post.createPost)

router.route('/:id').get(post.getPost).put(post.updatePost).delete(post.deletePost);

module.exports = router;