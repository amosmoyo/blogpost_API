const express = require('express')

const comment = require('../controllers/comment')

const {protect} = require('../middlewares/auth')

const router = express.Router({mergeParams: true})

router.route('/').get(comment.getComments).post(protect, comment.addComment)

router.route('/:id').get(comment.getComment)

module.exports = router;
