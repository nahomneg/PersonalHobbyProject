const express = require('express');
const router = express.Router();
const usersController = require('../controllers/userController');

router.route('/')
    .post(usersController.register);

router.route('/login')
    .post(usersController.login);

router.route('/logout')
    .post(usersController.logout);

module.exports = router;



