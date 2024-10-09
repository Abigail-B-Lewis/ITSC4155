const express = require('express');
const controller = require('../controllers/userController');

const router = express.Router();

//get homepage - create an account/log in
router.get('/', controller.index);

//post a new user to the database
router.post('/', controller.create);

//sign up page route - need to discuss how many pages we are rendering prior to sprint to have correct number of routes
router.get('/signup', controller.new);

module.exports = router;