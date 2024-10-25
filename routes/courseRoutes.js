const express = require('express');
const controller = require('../controllers/courseController');
const {isLoggedIn} = require('../middleware/validators');

const router = express.Router();

//get dashboard page - right now this renders the instructor dashboard
router.get('/', isLoggedIn, controller.index);

//post a new course to the database
router.post('/', controller.create);

//get create form 
router.get('/create', isLoggedIn, controller.getCreate);

module.exports = router;