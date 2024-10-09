const {User} = require('../models/index.js');

exports.new = (req, res) => {
    console.log("Here is the create an account/log in page");
    //render view if necessary, depends on where front-end puts this form.
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
                    req.session.user = user.id;
                    res.send('Login success');
                }else{
                    res.send('login failure')
                }
            })
            .catch(err => next(err))
        }else{
            console.log('email does not exist');
        }
    }).catch(err => next(err));
}

exports.logout = (res, req) => {
    req.session.destroy(err =>{
        if(err){
            next(err)
        }else{
            res.redirect('/')
        }
    });
};