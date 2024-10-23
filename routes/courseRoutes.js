const express = require('express');
const controller = require('../controllers/courseController');
const {isLoggedIn, validateId} = require('../middleware/validators');

const router = express.Router();

//get dashboard page
router.get('/', isLoggedIn, controller.index);

//post a new course to the database
router.post('/', controller.create);

router.get('/:id', validateId, controller.show);

module.exports = router;