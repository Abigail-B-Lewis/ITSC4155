const {Course} = require('../models/index.js');
const {Roster} = require('../models/index.js')

exports.index = (req, res) => {
    res.render('./officeHours/dashboard');
}

exports.create = (req, res) => {
    let course = req.body;
    console.log(course);
    console.log(req.session.user);
    Course.create({courseName: course.courseName, courseSemester: course.courseSemester, instructorId: req.session.user , studentAccessCode: course.studentAccessCode, iaAccessCode: course.iaAccessCode})
    .then(course => {
        Roster.create({courseId: course.id, userId: req.session.user, role: 'instructor'})
        .then(res => {
            console.log('Instructor added to roster successfully');
        }).catch(err => {
            console.log(err);
        });
        console.log('Course created successfully!', course.courseName);
        res.redirect('back');
    }).catch(err => {
        //TODO: proper error handling
        console.log(err);
    });
}