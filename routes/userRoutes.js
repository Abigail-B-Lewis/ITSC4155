const express = require('express');
const controller = require('../controllers/userController');

const router = express.Router();

//get registration - might update based on views?
router.get('/new', controller.new);

//post a new user to the database
router.post('/', controller.create);

//get login - might update?
router.get('/login', controller.getLogin);

//authenticate user
router.post('/login', controller.login)

module.exports = router;