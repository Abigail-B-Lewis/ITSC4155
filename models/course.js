module.exports = (sequelize, Sequelize) => {
    const Course = sequelize.define('course', {
      courseName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      //should probably add enum for this attribute?
      courseSemester: {
        type: Sequelize.STRING,
        allowNull: false,
        isIn: [['Fall 2024', 'Spring 2025', 'Fall 2025', 'Spring 2026']],
      },
      instructorName: {
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
    }
);
  
    return Course;
  };