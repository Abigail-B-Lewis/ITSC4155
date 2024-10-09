const express = require('express');
const controller = require('../controllers/userController');
const {validateLogIn, validateSignUp, validateResult} = require('../middleware/validators.js');

const router = express.Router();

//get 
router.get('/', controller.index);

router.get('/new', controller.new);

//post a new user to the database
router.post('/', controller.create);

//get login - might update?
router.get('/login', controller.getLogin);

//authenticate user
router.post('/login', validateLogIn, validateResult, controller.login)

router.get('/logout', controller.logout);

module.exports = router;