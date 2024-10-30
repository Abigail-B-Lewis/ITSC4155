const express = require('express');
const controller = require('../controllers/userController');
const {validateLogIn, validateSignUp, validateResult, isLoggedIn, isGuest} = require('../middleware/validators.js');

const router = express.Router();

//renders the signup page
router.get('/new', isGuest, controller.new);

//post a new user to the database
router.post('/', validateSignUp, validateResult, controller.create);

//get login page
router.get('/login', isGuest, controller.getLogin);

//authenticate user
router.post('/login', validateLogIn, validateResult, controller.login)

//logs out the user
router.get('/logout', isLoggedIn, controller.logout);

//sign up page route - need to discuss how many pages we are rendering prior to sprint to have correct number of routes
router.get('/signup', controller.new);

//gets the profile page
router.get('/profile', controller.profile);

//gets the about us page
router.get('/about', controller.about);

module.exports = router;