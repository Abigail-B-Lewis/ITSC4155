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
    console.log(req.body);
    const { courseId, IaId, day, startTime, endTime } = req.body;

    // Validation for day
    const allowedDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    if (!allowedDays.includes(day)) {
        req.flash("error", "Invalid day entered. Please select a valid day.");
        return res.redirect('back');
    }

    // Validate start and end time format (HH:MM)
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
        req.flash("error", "Invalid time format. Please use HH:MM format for start and end times.");
        return res.redirect('back');
    }

    // Verify course exists
    Course.findByPk(courseId)
        .then(course => {
            if (!course) {
                req.flash("error", "Invalid course ID. Please verify the course.");
                return res.redirect('back');
            }

            // Verify IA exists
            return User.findByPk(IaId);
        })
        .then(ia => {
            if (!ia) {
                req.flash("error", "Invalid IA ID. Please verify the IA.");
                return res.redirect('back');
            }

            // Create the schedule entry
            return Schedule.create({
                courseId,
                IaId,
                day,
                startTime,
                endTime,
            });
        })
        .then(() => {
            console.log('Schedule created successfully');
            req.flash("success", "Schedule created successfully");
            res.redirect('/courses');  // Redirect to relevant page - to be changed?
        })
        .catch(error => {
            console.error("Error creating schedule:", error);
            req.flash("error", "An error occurred while creating the schedule. Please try again.");
            next(error);
        });
};