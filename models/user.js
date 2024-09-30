const bcrypt = require('bcrypt');

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('user', {
    fullName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
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
        isIn: [['instructor', 'student']],
      },
    },
  }, 
  {
    timestamps: false,
    hooks: {
      beforeValidate: async (user) => {
        if (user.password) {
          try {
            const hash = await bcrypt.hash(user.password, 10);
            user.password = hash;
          } catch (err) {
            console.log('Error hashing password:', err);
          }
        }
      },
    },
  });

  User.prototype.validPassword = async function (inputPassword) {
    return bcrypt.compare(inputPassword, this.password);
  };

  return User;
};