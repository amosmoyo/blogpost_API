const express = require('express');

const userController = require('../controllers/user')

const {protect} = require('../middlewares/auth')

const router = express.Router();

router.post('/register', userController.registerUser);

router.post('/login', userController.loginUser);

router.get('/account', protect, userController.getMe)

router.get('/', userController.getAllUser)

router.put('/:personId/follow', protect, userController.follow);

router.put('/:personId/unfollow', protect, userController.unfollow);

module.exports = router;