const {Course} = require('../models/index.js');

exports.index = (req, res) => {
    Course.findAll()
        .then(courses => {
            res.render('./officeHours/dashboard', {courses});
        })
        .catch(error => {
            console.error("Error fetching courses:", error);
            next(error);
        });
}

exports.getCreate = (req, res) => {
    res.render('./officeHours/create'); // Render the create.ejs view
};

exports.create = (req, res, next) => {
    let course = req.body;
    console.log(course);
    console.log(req.session.user);
    Course.create({courseName: course.courseName, courseSemester: course.courseSemester, instructorId: req.session.user , studentAccessCode: course.studentAccessCode, iaAccessCode: course.iaAccessCode})
    .then(course => {
        //where to redirect once course is created? - redirect to dashboard for now
        req.flash('success', 'course created successfully!');
        console.log('Course created successfully!', course.courseName);
        res.redirect('/courses');
    }).catch(err => next(err));
}