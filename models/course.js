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
      courseSemester: {
        type: Sequelize.STRING,  
        allowNull: false,
        validate: {
            is: /^[A-Za-z]+ \d{4}$/ // Validates format like "Fall 2024"
        }
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
    },
    {
        timestamps: false,
        hooks: {       
          beforeValidate: async (course) => {
            course.id = uuidv4();
          },
        },
    }
  );
  
    return Course;
  };