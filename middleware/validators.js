const {body} = require('express-validator');
const {validationResult} = require('express-validator');

exports.validateSignUp = [body('fullName', 'full name cannot be empty').notEmpty().trim().escape(),
    body('email', 'email must be a valid email address').isEmail().notEmpty().trim().escape().normalizeEmail(),
    //TODO: discuss password requirements
    body('password', 'password cannot be empty').notEmpty().trim().escape(),
    body('role', 'must select a role').notEmpty().trim().escape().isIn(['instructor', 'student'])];

exports.validateLogIn = [body('email', 'email must be a valid email address').isEmail().notEmpty().trim().escape(),
    body('password', 'password cannot be empty').notEmpty().trim().escape()];

exports.validateId = (req, res, next) => {
    id = req.params.id;
    console.log('validating course id')
    if(id.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/)) {
        return next();
    }else{
        //TODO: add proper error handling - 400 error
        //send to error page
        console.log('invalid id entered');
    }
}

exports.isGuest = (req, res, next) => {
    if(!req.session.user){ 
        return next();
    }else{
        req.flash('error', 'Cannot access resource: Already logged in');
        return res.redirect('/courses');
    }
};
    
exports.isLoggedIn = (req, res, next) => { 
    console.log('Checking if user is logged in')
    if(req.session.user){
        return next();
    }else{
        req.flash('error', 'Cannot access resource: You need to log in');
        return res.redirect('/users/login')
    }
};

exports.validateResult = (req, res, next) => {
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors)
        //TODO: add flash messages - might be in later sprint
        return res.redirect('back');
    }else{
        console.log('successful validation'); 
        return next();
    }
}