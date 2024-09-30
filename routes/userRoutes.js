const express = require('express');
const controller = require('../controllers/userController');

const router = express.Router();

//get homepage - create an account/log in
router.get('/', controller.index);

//post a new user to the database
router.post('/', controller.create);

module.exports = router;