const model = require('../models/user');
const {User} = require('../models/index.js');

exports.new = (req, res) => {
    console.log("Here is the create an account/log in page");
    //render view if necessary, depends on where front-end puts this form.
}

exports.create = (req, res) => {
    console.log("Here is where a new user is added to the db");
};

exports.getLogin = (req, res) => {
    console.log("Here is the login page")
    //render view if necessary, depends on where front-end puts this form
}

exports.login = (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    User.findOne({where: {email: email}})
    .then(user => {
        if(user){
            user.validPassword(password)
            .then(result => {
                if(result){
                    console.log('login success')
                    //TODO: where should they be directed?
                    //Add user to session
                }else{
                    console.log('login failed')
                }
            })
            .catch(err => next(err))
        }else{
            console.log('email does not exist')
        }
    }).catch(err => next(err));
}