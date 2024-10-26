const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('user', {
    id: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
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
        user.id = uuidv4();
        if (user.password) {
          if (!(user.password.length > 8 && user.password.length < 24)) {
            throw new Error('Password length must be between 8 and 24 characters.');
          }
          try {
            const hash = await bcrypt.hash(user.password, 10);
            user.password = hash;
          } catch (err) {
            console.log('Error hashing password:', err);
          }
        }
      },
    }    
  }); 

  User.prototype.validPassword = async function (inputPassword) {
    return bcrypt.compare(inputPassword, this.password);
  };

  return User;
};
