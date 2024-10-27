const {Course} = require('../models/index.js');
const {Schedule} = require('../models/index.js');
const {User} = require('../models/index.js');
const { v4: uuidv4 } = require('uuid');

exports.index = (req, res) => {
    res.render('./officeHours/dashboard');
    //needs more implementation to render courses the user is part of
}

exports.createCourse = (req, res, next) => {
    let course = req.body;
    console.log(course);
    console.log(req.session.user);
    Course.create({courseName: course.courseName, courseSemester: course.courseSemester, instructorId: req.session.user , studentAccessCode: course.studentAccessCode, iaAccessCode: course.iaAccessCode})
    .then(course => {
        //where to redirect once course is created? - redirect to dashboard for now
        req.flash('success', 'course created successfully!');
        console.log('Course created successfully!', course.courseName);
        res.render('./officeHours/dashboard');
    }).catch(err => next(err));
}

exports.createSchedule = (req, res, next) => {
    const {IaId, day, startTime, endTime } = req.body;
    const courseId = req.params.id;

    // Verify course exists
    Course.findByPk(courseId)
        .then(course => {
            if (!course) {
                req.flash("error", "Invalid course ID. Please verify the course.");
                return res.redirect('/courses');
            }

            // Verify IA exists
            return User.findByPk(IaId);
        })
        .then(ia => {
            if (!ia) {
                req.flash("error", "Invalid IA ID. Please verify the IA.");
                return res.redirect('/courses');
            }  

            // Create the schedule entry
            Schedule.create({courseId, IaId, day, startTime, endTime})
            .then(schedule =>{
                console.log('Schedule created successfully');
                req.flash("success", "Schedule created successfully");
                res.redirect('/courses');  // Redirect to relevant page - to be changed?
                return schedule;
            })
            .catch(error => {
                console.log(error.name, error.message);
                if(error.name == "SequelizeValidationError"){
                    req.flash('error', error.message);
                    res.redirect('/courses');
                }else{
                    next(error);
                }
            })
        })
        .catch(error => {
            console.error("Error creating schedule:", error);
            next(error);
        });
};