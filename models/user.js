const bcrypt = require('bcrypt');
const { uuid } = require('uuidv4');
 
module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('user', {
    id: {
      type: Sequelize.UUID,
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
      len: [8, 24],
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
        user.id = uuid();
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