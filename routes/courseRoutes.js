const express = require('express');
const controller = require('../controllers/courseController');
const {isLoggedIn, validateId} = require('../middleware/validators');

const router = express.Router();

//get dashboard page - right now this renders the instructor dashboard
router.get('/', isLoggedIn, controller.index);

//post a new course to the database
router.post('/', controller.createCourse);

//get create form 
router.get('/create', isLoggedIn, controller.getCreate);

//post a roster(join course) to the database
router.post('/join', controller.join);

//get view for joining a course
router.get('/join', isLoggedIn, controller.getJoin);

//get view for individual course
router.get('/:id', validateId, controller.getCourse);

//gets an individual schedule
router.get('/:id/schedule', validateId, controller.show);

//post a new schedule to the database
router.post('/:id/schedule', controller.createSchedule);

//post a question to the database
router.post('/:id/questions', controller.createQuestion);

//update the status after claiming a student
router.put('/:id/questions/:qid', validateId, controller.updateStatus);

module.exports = router;  
