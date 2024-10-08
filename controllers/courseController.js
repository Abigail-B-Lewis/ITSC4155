const {Course} = require('../models/index.js');

exports.index = (req, res) => {
    console.log("Here is the add a new course page - instructors only!");
}

exports.create = (req, res) => {
    let course = req.body;
    Course.create({courseName: course.courseName, courseSemester: course.courseSemester, instructorName: course.instructorName, studentAccessCode: course.studentAccessCode, iaAccessCode: course.iaAccessCode})
    .then(course => {
        //TODO: figure out how front-end is displaying login/register forms
        //and redirect to login once account is created.
        console.log('Course created successfully!', course.courseName);
    }).catch(err => {
        //TODO: proper error handling
        console.log(err);
    });
}