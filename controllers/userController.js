const {User} = require('../models/index.js');

exports.new = (req, res) => {
    res.render('./signup')
}
  
exports.create = (req, res) => {
    let user = req.body;
    console.log(user);
    User.create({fullName: user.fullName, email: user.email, password: user.password, role: user.role})
    .then(user => {
        //TODO: figure out how front-end is displaying login/register forms
        //and redirect to login once account is created.
        res.redirect('/users/login')
        console.log('user created successfully!', user.email);
    }).catch(err => {
        //TODO: proper error handling
        console.log(err);
    });
};

exports.getLogin = (req, res) => {
    res.render('./login')  
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
                    //fix this, do res.redirect() instead of res.render()
                    res.render('./officeHours/dashboard');
                }else{
                    res.send('login failure')
                }
            })
            .catch(err => console.log(err))
        }else{
            console.log('email does not exist');
        }
    }).catch(err => next(err));
}

exports.logout = (req, res) => {
    req.session.destroy(err =>{  
        if(err){
            next(err)
        }else{
            res.redirect('/')
        }
    });
};
