const e = require('connect-flash');
const {Course, Schedule, User, Roster, Question} = require('../models/index.js');

const { Op } = require('sequelize');
const {broadcast} = require('../app.js');

exports.index = (req, res, next) => {
    const userId = req.session.user;
    const role = req.session.role;

    if (role === 'instructor') {
        // Fetch only the courses created by this instructor
        Course.findAll({ where: { instructorId: userId } })
            .then(courses => {
                res.render('./officeHours/dashboard', { courses, role });
            })
            .catch(error => {
                console.error("Error fetching courses for instructor:", error);
                req.flash('error', 'An error occurred while fetching your courses.');
                next(error);
            });
    } else {
        // Students and IAs see only the courses they are enrolled in
        Roster.findAll({ where: { userId } })
            .then(rosterEntries => {
                const courseIds = rosterEntries.map(entry => entry.courseId);
                return Course.findAll({ where: { id: courseIds } });
            })
            .then(courses => {
                res.render('./officeHours/dashboard', { courses, role });
            })
            .catch(error => {
                console.error("Error fetching courses for student:", error);
                req.flash('error', 'An error occurred while fetching your enrolled courses.');
                next(error);
            });
    }
};

exports.getCreate = (req, res) => {
    console.log('reached getCreate');
    res.render('./officeHours/create'); // Render the create.ejs view
};

exports.createCourse = (req, res, next) => {  
    let course = req.body;  
    console.log(course);  
    console.log(req.session.user);
    Course.create({courseName: course.courseName, courseSemester: course.courseSemester, instructorId: req.session.user , studentAccessCode: course.studentAccessCode, iaAccessCode: course.iaAccessCode})
    .then(course => {
        //where to redirect once course is created?
        Roster.create({courseId: course.id, userId: course.instructorId, role: 'instructor'})
        .then(roster => console.log("The roster is" + roster))
        .catch(err => next(err))
        req.flash('success', 'course created successfully!');
        console.log('Course created successfully!', course.courseName);
        res.redirect('/courses');

    }).catch(err => next(err));
}

exports.getCourse = (req, res, next) => {
    let cid = req.params.id;
    let uid = req.session.user;
    let role;
    Course.findOne({where: {id: cid}})
    .then(course =>{
        Roster.findOne({where: {courseId: cid, userId: uid}})
        .then(roster =>{
            if(roster){
                role = roster.role;
                if(role == 'student'){
                    res.render('./officeHours/question', {course});
                }else{
                    Question.findAll({
                        where: {
                          CourseId: cid,
                          status: {
                            [Op.or]: ['unclaimed', 'unresolved'] 
                          }
                        },
                        include: [
                            {
                              model: User, // Assuming `User` is the Sequelize model for the user table
                              attributes: ['fullName'] // Specify the column(s) you want to include from the User table
                            }
                        ],
                        order: [['createdAt', 'ASC']]
                    }).then(questions => {
                        res.render('./officeHours/course', {questions, course})
                      })
                      .catch(err => next(err));
                }
            }else{
                req.flash('error', 'You are not enrolled in this course');
                res.redirect('back')
            }
        }).catch(err => next(err))
    })
    .catch(err => next(err))
}

exports.show = (req, res, next) => {
    let courseId = req.params.id;
    let userId = req.session.user;
    let role;
    Roster.findOne({where: {userId: userId}})
    .then(user =>{
        role = user.role;
    }).catch(err => console.log(err))
    Course.findOne({where: {id: courseId}})
    .then(course => {
        if(course){  
            //TEST SCHEDULE FUNCTIONALITY ONCE EVERYTHING IS MERGED
            let formattedSchedule = {};
            Schedule.findAll({where: {courseid: courseId}})
            .then(schedules =>{
                if(schedules){
                    schedules.forEach(({day, startTime, endTime}) =>{
                        if(!formattedSchedule[day]){
                            formattedSchedule[day] = [];
                        }
                        if(parseInt(startTime.slice(0,2))%12 != parseInt(startTime.slice(0,2))){
                            if(parseInt(startTime.slice(0,2)) == 12){
                                startTime = startTime + ' PM'
                            }else{
                                startTime = String(parseInt(startTime.slice(0,2))%12) + startTime.slice(2) + ' PM'
                            }
                        }else{
                            startTime = startTime + ' AM'
                        }
                        if(parseInt(endTime.slice(0,2))%12 != parseInt(endTime.slice(0,2))){
                            if(parseInt(endTime.slice(0,2)) == 12){
                                endTime = endTime + ' PM'
                            }else{
                                endTime = String(parseInt(endTime.slice(0,2))%12) + endTime.slice(2) + ' PM'
                            }
                        }else{
                            endTime = endTime + ' AM'
                        }
                        if (parseInt(startTime.slice(0,2)) == 0){
                            startTime = '12:00 AM'
                        }
                        if(parseInt(endTime.slice(0,2)) == 0){
                            endTime = '12:00 AM'
                        }
                        formattedSchedule[day].push({startTime, endTime});
                    });
                    console.log(formattedSchedule);
                    res.render('./officeHours/schedule', {formattedSchedule, course, role});
                }
            })
            //TODO: add role for course, send to front end
            .catch(err => next(err))
        }else{
            //TODO: deal with error handling and make 404
            req.flash('error', 'Course does not exist');
        }
    })  
    .catch(err => console.log(err));
}

exports.createSchedule = (req, res, next) => {    
    const {day, startTime, endTime } = req.body;
    const iaId = req.session.user;
    const courseId = req.params.id;
    console.log(iaId);
    console.log(startTime, endTime)
    // Verify course exists
    Course.findByPk(courseId)  
        .then(course => {
            if (!course) {
                req.flash("error", "Invalid course ID. Please verify the course.");
                return res.redirect('back');
            }
            // Verify IA exists
            User.findOne({where: {id: iaId}})
            .then(ia => {
                if (!ia) {
                    req.flash("error", "Invalid IA ID. Please verify the IA.");
                    return res.redirect('back');
                }
                
            Schedule.create({courseId: courseId, IaId: iaId, day: day, startTime: startTime, endTime: endTime})
                .then(schedule =>{
                    console.log('Schedule created successfully');
                    req.flash("success", "Schedule created successfully");
                    res.redirect('/courses/' + courseId);  // Redirect to relevant page - to be changed?
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
            }).catch(err => next(err))
        }).catch(error => {
            console.error("Error creating schedule:", error);
            next(error);
        });
};

//get the join course view
exports.getJoin = (req, res) => {
    res.render('./officeHours/join'); // Render the create.ejs view
};

//TODO: test once route is created
exports.join = (req, res, next) => {
    let user = req.session.user;
    console.log(req.body);
    //If user tries to enter both access codes
    if (req.body.iaAccessCode != '' && req.body.studentAccessCode != ''){
        req.flash("error", "You can only join as a student OR an IA. Please only enter 1 code")
        res.redirect('back');
    }
    //if user does not enter any access codes
    if(req.body.iaAccessCode == '' && req.body.studentAccessCode == ''){
        req.flash("error", "No codes entered, please try again")
        res.redirect('back');
    }
    //if user wants to join as an IA
    if(req.body.iaAccessCode != '' && req.body.studentAccessCode == ''){
        Course.findOne({where: {iaAccessCode: req.body.iaAccessCode}})
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
                    res.redirect('/courses');
                })
                .catch(err => {
                    if(err.name == "SequelizeUniqueConstraintError"){
                        req.flash('error', 'You are already in this course');
                        res.redirect('back');
                    }else{
                        next(err);
                    }
                })
            }
        })
        .catch(err => next(err));
    }
    // if user wants to join as student
    if(req.body.studentAccessCode != '' && req.body.iaAccessCode==''){
        Course.findOne({where: {studentAccessCode: req.body.studentAccessCode}})
        .then(course => {
            if (course == null){
                req.flash("error", "Invalid student code entered. Please check with the instructor and try again");
                res.redirect('back')
            }else{
                Roster.create({userId: user, courseId: course.id, role: 'student'})
                .then(roster => {
                    req.flash('success', 'Joined course successfully')
                    //TODO: check to see if we should direct to course page or form
                    res.redirect('/courses');
                })
                .catch(err => {
                    console.log(err.name);
                    if(err.name == "SequelizeUniqueConstraintError"){
                        req.flash('error', 'You are already in this course');
                        res.redirect('back');
                    }else{
                        next(err);
                    }
                })
            }
        })
        .catch(err => next(err));
    }
}

// Adds a question to the database
exports.createQuestion = (req, res, next) => {
    const { text, tag } = req.body; // Only expect text and tag fields
    const userId = req.session.user;
    const courseId = req.params.id;

    Roster.findOne({ where: { userId, courseId } })
        .then(roster => {
            if (!roster) {
                req.flash('error', 'User is not enrolled in this course.');
                return res.redirect(`/courses/${courseId}`);
            }
            // Create the question if user is enrolled

            Question.create({ courseId, userId, text, tag })
            .then(question => {
                User.findOne({where: {id: userId}, attributes: ['fullName']})
                .then(user => {
                    const questionData = {
                        eventType: 'newQuestion',  
                        text: question.text,
                        tag: question.tag,
                        fullName: user.fullName,
                        id: question.id,
                        courseId: question.courseId
                    };
                    req.broadcast(JSON.stringify(questionData));
                    req.flash('success', 'Question created successfully.');
                    res.redirect(`/courses/${courseId}`);
                })
            })
            .catch(err => next(err));
        }).catch(err => next(err));
};

exports.updateStatus = (req, res, next) => {
    const { id: courseId, qid } = req.params; // Extract courseId and qid from the request parameters
    const status = req.body.status; // Extract status from the button value in the request body
    let fullName;
    console.log(status);

    Question.findByPk(qid, {
        include: [
            {
                model: User,
                attributes: ['fullName'] // Include only the fullName attribute
            }
        ]
        })
        .then((question) => {
            if (!question) {
                req.flash('error', 'Question not found.');
                return res.redirect(`/courses/${courseId}`);
            }
            fullName = question.user.fullName;
            if (status === 'resolved') {
                // Delete the question if the status is resolved
                return question
                    .destroy()
                    .then(() => {
                        req.flash('success', 'Question resolved and removed from the queue.');
                        res.redirect(`/courses/${courseId}`);
                    });
            } else {
                // Update the status for other values
                question.status = status;
                return question.save();
            }
        })
        .then((updatedQuestion) => {
            if (!updatedQuestion) return; // If resolved, the question is deleted, so no further action is needed
            
            const questionData = {
                eventType: 'updateQuestion', 
                status: status, 
                text: updatedQuestion.text,
                tag: updatedQuestion.tag,
                fullName: fullName,
                id: updatedQuestion.id,
                courseId: updatedQuestion.courseId
            };

            req.broadcast(JSON.stringify(questionData));
            // Set appropriate flash message based on the new status
            if (status === 'claimed') {
                req.flash('success', 'Status has been updated to claimed. Student removed from queue.');
                res.redirect(`/courses/${courseId}`); //redirect to the after claim view that najwah makes
            } else if (status === 'unresolved') {
                req.flash('success', 'Status has been updated to unresolved. Student added back to queue.');
                res.redirect(`/courses/${courseId}`);
            } else {
                req.flash('error', 'Invalid status value.');
                res.redirect(`/courses/${courseId}`);
            }

        })
        .catch((error) => {
            console.log('Error updating question status:', error);
            req.flash('error', 'An unexpected error occurred while updating the status.');
            res.redirect(`/courses/${courseId}`);
        });
};