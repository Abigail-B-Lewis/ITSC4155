const {Course} = require('../models/index.js');

exports.index = (req, res) => {
    console.log("Here is the add a new course page - instructors only!");
}

exports.create = (req, res) => {
    let course = req.body;
    console.log(course);
    Course.create({courseName: course.courseName, courseSemester: course.courseSemester, instructorName: course.instructorName, studentAccessCode: course.studentAccessCode, iaAccessCode: course.iaAccessCode})
    .then(course => {
        //where to redirect once course is created?
        console.log('Course created successfully!', course.courseName);
    }).catch(err => {
        //TODO: proper error handling
        console.log(err);
    });
}