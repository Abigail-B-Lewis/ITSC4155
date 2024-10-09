const express = require('express');
const controller = require('../controllers/courseController');

const router = express.Router();

//get instructor page
router.get('/', controller.index);

//post a new course to the database
router.post('/', controller.create);

module.exports = router;