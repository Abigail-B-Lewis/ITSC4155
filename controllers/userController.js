const {User} = require('../models/index.js');

exports.new = (req, res) => {
    res.render('./signup')
}
  
exports.create = (req, res, next) => {
    let user = req.body;
    console.log(user);
    User.create({fullName: user.fullName, email: user.email, password: user.password, role: user.role})
    .then(user => {
        //TODO: figure out how front-end is displaying login/register forms
        //and redirect to login once account is created.
        req.flash('success', 'Account created successfully!');
        res.redirect('/users/login')
    }).catch(err => {
        //TODO: proper error handling
        next(err);
    });
};

exports.getLogin = (req, res) => {
    res.render('./login');
    //render view if necessary, depends on where front-end puts this form
}

exports.login = (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;
    User.findOne({where: {email: email}})
    .then(user => {
        if(user){
            user.validPassword(password)
            .then(result => {
                if(result){
                    req.session.user = user.id;
                    req.session.role = user.role;
                    res.redirect('/courses');
                }else{
                    req.flash('error', 'Incorrect password entered. Please try again');
                    res.redirect('back');
                }
            })
            .catch(err => console.log(err))
        }else{
            req.flash('error', 'email is not associated with an existing account');
            res.redirect('back');
        }
    }).catch(err => next(err));
}

exports.logout = (req, res) => {
    req.session.destroy(err =>{  
        if(err){
            req.flash('error', 'Unable to log out');
        }else{  
            res.redirect('/users/login');
        }
    });
};

exports.profile = (req, res, next) => {
    const userId = req.session.user;

    User.findByPk(userId)
    .then(user => {
        if (!user) {
            //return res.status(404).render('error', { message: 'User not found' });
            req.flash('error', 'User not found');
            return res.redirect('/courses');
        }
        res.render('./officeHours/profile', { user });
    })
    .catch(err => next(err));
};

exports.about = (req, res) => {
    res.render('./about');  
}