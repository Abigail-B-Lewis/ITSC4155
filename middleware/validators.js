const {body} = require('express-validator');
const {validationResult} = require('express-validator');

exports.validateSignUp = [body('fullName', 'full name cannot be empty').notEmpty().trim().escape(),
    body('email', 'email must be a valid email address').isEmail().notEmpty().trim().escape().normalizeEmail(),
    //TODO: discuss password requirements
    body('password', 'password cannot be empty').notEmpty().trim().escape(),
    body('role', 'must select a role').notEmpty().trim().escape().isIn(['instructor', 'student'])];

exports.validateLogIn = [body('email', 'email must be a valid email address').isEmail().notEmpty().trim().escape(),
    body('password', 'password cannot be empty').notEmpty().trim().escape()];

exports.validateResult = (req, res, next) => {
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors)
        //TODO: add flash messages - might be in later sprint
        return res.redirect('back');
    }else{
        return next();
    }
}