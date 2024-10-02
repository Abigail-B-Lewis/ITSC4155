module.exports = (sequelize, Sequelize) => {
    const Course = sequelize.define('course', {
      courseName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      courseSemester: {
        type: Sequelize.STRING,
        allowNull: false,
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