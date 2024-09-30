const {User} = require('../models/index.js');

exports.index = (req, res) => {
    console.log("Here is the create an account/log in page");
}

exports.create = (req, res) => {
    let user = req.body;
    User.create({fullName: user.fullName, email: user.email, password: user.password, role: user.role})
    .then(user => {
        //TODO: figure out how front-end is displaying login/register forms
        //and redirect to login once account is created.
        console.log('user created successfully!', user.email);
    }).catch(err => {
        //TODO: proper error handling
        console.log(err);
    });
}