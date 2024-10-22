const express = require('express');
const controller = require('../controllers/userController');
const {validateLogIn, validateSignUp, validateResult, isLoggedIn, isGuest} = require('../middleware/validators.js');

const router = express.Router();

//get 
// router.get('/', controller.index);  

//TODO: get rid of one of these. two routes to same controller. 
router.get('/new', isGuest, controller.new);

//post a new user to the database
router.post('/', validateSignUp, validateResult, controller.create);

//get login - might update?
router.get('/login', isGuest, controller.getLogin);

//authenticate user
router.post('/login', validateLogIn, validateResult, controller.login)

router.get('/logout', isLoggedIn, controller.logout);

//sign up page route - need to discuss how many pages we are rendering prior to sprint to have correct number of routes
router.get('/signup', controller.new);

module.exports = router;