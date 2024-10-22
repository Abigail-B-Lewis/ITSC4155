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
        //where to redirect once course is created?
        req.flash('success', 'course created successfully!');
        console.log('Course created successfully!', course.courseName);
        res.redirect(back);
    }).catch(err => {
        //TODO: proper error handling
        console.log(err);
    });
}

//TODO: test once route is created
exports.join = (req, res) => {
    let user = req.session.user;
    //If user tries to enter both access codes
    if (req.body.iaAccessCode != null && req.body.studentAccessCode != null){
        req.flash("error", "You can only join as a student OR an IA. Please only enter 1 code")
        res.redirect('back');
    }
    //if user does not enter any access codes
    if(req.body.iaAccessCode == null && req.body.studentAccessCode == null){
        req.flash("error", "No codes entered, please try again")
        res.redirect('back');
    }
    //if user wants to join as an IA
    if(req.body.iaAccessCode != null){
        Courses.findOne({where: {iaAccessCode: req.body.iaAccessCode}})
        .then(course => {
            if (course == null){
                req.flash("error", "Invalid IA code entered. Please check with the instructor and try again");
                res.redirect('back')
            }else{
                //Since courseid and userid are primary keys in roster, it should not allow them to join a course that they
                //are already in. Make sure to test this
                Roster.create({userId: user, courseId: course.id, role: 'ia'})
                .then(roster => {
                    req.flash('success', 'Joined course successfully')
                    //TODO: check to see if we should direct to course page or form
                    res.redirect('back');
                })
                .catch(err => {
                    console.log(err);
                })
            }
        })
        .catch(err => console.log(err))
    }
    // if user wants to join as student
    if(req.body.studentAccessCode != null){
        Courses.findOne({where: {studentAccessCode: req.body.studentAccessCode}})
        .then(course => {
            if (course == null){
                req.flash("error", "Invalid student code entered. Please check with the instructor and try again");
                res.redirect('back')
            }else{
                //Since courseid and userid are primary keys in roster, it should not allow them to join a course that they
                //are already in. Make sure to test this
                Roster.create({userId: user, courseId: course.id, role: 'student'})
                .then(roster => {
                    req.flash('success', 'Joined course successfully')
                    //TODO: check to see if we should direct to course page or form
                    res.redirect('back');
                })
                .catch(err => {
                    console.log(err);
                })
            }
        })
        .catch(err => console.log(err))
    }
    
}