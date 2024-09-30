// const bcrypt = require('bcrypt');
// module.exports = (sequelize, Sequelize) => {
//     const User = sequelize.define("users", {
//         fullName: {
//             type: Sequelize.STRING,
//             allowNull: false,
//         },
//         email: {
//             type: Sequelize.STRING,
//             allowNull: false,
//             validate: {
//                 isEmail: true
//             },
//             unique: true,
//         },
//         //TODO: Hash pashword prior to storing
//         password: {
//             type: Sequelize.STRING,
//             allowNull: false,
//         },
//         role: {
//             type: Sequelize.STRING,
//             allowNull: false,
//             validate: {
//                 isIn: [['instructor', 'student']]
//             },
//         },
//         },
//         {
//             //TODO: test encryption
//         hooks: {
//             beforeCreate: (user) => {
//                 bcrypt.hash(user.password, 10)
//                 .then(hash => {
//                     user.password = hash;
//                     next();
//                 })
//                 .catch(err => next(err));
//             },
//         }
//         },
//         {
//         instanceMethods: {
//             validPassword: function(inputPassword){
//                 let user = this;
//                 return bcrypt.compare(inputPassword, user.password);
//             }
//         }
//     });
//     return User;
// }