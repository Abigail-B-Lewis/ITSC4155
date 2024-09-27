const bcrypt = require('bcrypt');
const {Sequelize,sequelize} = require('./index.js');



const User = sequelize.define('user', {
    fullName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        },
        unique: true,
        primaryKey: true,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    role: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isIn: [['instructor', 'student']]
        },
    },
},
{
    hooks: {
        beforeValidate: (user) => {
            if (user.password) {
                return bcrypt.hash(user.password, 10)
                .then(hash => {
                    user.password = hash;
                }).catch(err =>{
                    console.log(err);
                });
            }
        },
    },
});

User.prototype.validPassword = async function(inputPassword) {
    return bcrypt.compare(inputPassword, this.password);
};

User.sync({alter: false}).then(()=>{
    return User.create({fullName: 'Abigail Lewis', email: 'Abby66@gmail.com', password: '123123', role: 'student'})
}).then((user) => {
    console.log('User added to database');
}).catch((err) => {
    console.log(err);
})