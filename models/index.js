'use strict'

const Sequelize = require('sequelize');

const sequelize = new Sequelize('officeq', 'root', 'password', {
  dialect: 'mysql'
});

const User = require('./user.js')(sequelize, Sequelize);
const Course = require('./course.js')(sequelize, Sequelize);
const Schedule = require('./schedule.js')(sequelize, Sequelize);
const Roster = require('./roster.js')(sequelize, Sequelize);
const Question = require('./question.js')(sequelize, Sequelize);
  
Course.hasMany(Schedule, {
  foreignKey: 'courseId',
  onDelete: 'CASCADE'
});

Schedule.belongsTo(Course, {
  foreignKey: 'courseId',
});

User.hasMany(Schedule, {
  foreignKey: 'IaId',
  onDelete: 'CASCADE'
});

Schedule.belongsTo(User, {
  foreignKey: 'IaId'
});  


User.belongsToMany(Course, { through: Roster, foreignKey: 'userId' });
Course.belongsToMany(User, { through: Roster, foreignKey: 'courseId' });
Question.belongsTo(Course, { foreignKey: 'courseId' });
Question.belongsTo(User, { foreignKey: 'userId'});
User.hasMany(Question, {foreignKey: 'userId'});
Course.hasMany(Question, {foreignKey: 'courseId'});

sequelize.authenticate().then(()=>{  
  console.log("Connection successful");
}).catch((err) => {
  console.log("Error connecting to the database");
});

sequelize.sync({ alter: true }) 
  .then(() => {
    console.log("All models were synchronized successfully.");
  })
  .catch((err) => {
    console.log("Error syncing models to the database: ", err);   
  });

  module.exports = {Sequelize, sequelize, User, Course, Schedule, Roster, Question};