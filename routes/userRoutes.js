const express = require('express');
const controller = require('../controllers/userController');

const router = express.Router();

//get 
router.get('/', controller.index);

//post a new user to the database
router.post('/', controller.create);

router.
module.exports = router;