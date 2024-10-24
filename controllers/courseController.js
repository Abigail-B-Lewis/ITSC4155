const {Course} = require('../models/index.js');

exports.index = (req, res) => {
    res.render('./officeHours/dashboard');
    //needs more implementation to render courses the user is part of
}

exports.create = (req, res, next) => {
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

exports.show = (req, res) => {
    let courseId = req.params.id;
    Course.findOne({where: {id: courseId}})
    .then(course => {
        if(course){
            res.render('./officeHours/course', {course});
        }else{
            //TODO: deal with error handling and make 404
            req.flash('error', 'Course does not exist');
        }
    })  
    .catch(err => console.log(err));
}