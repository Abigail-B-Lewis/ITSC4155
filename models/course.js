const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, Sequelize) => {
    const Course = sequelize.define('course', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        primaryKey: true
      },
      courseName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      //should probably add enum for this attribute?
      courseSemester: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            is: /^[A-Za-z]+ \d{4}$/ // Validates format like "Fall 2024"
        }
    },
      instructorId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      studentAccessCode: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      iaAccessCode: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      }
      // TODO: add foreign key link to schedule in sprint 2
    },
    {
        timestamps: false,
        hooks: {       
          beforeValidate: async (user) => {
            user.id = uuidv4();
          },
        },
    }
  );
  
    return Course;
  };