'use strict'

const Sequelize = require('sequelize');

const sequelize = new Sequelize('officeq', 'root', 'Alew88383869!', {
  dialect: 'mysql'
});

const User = require('./user.js')(sequelize, Sequelize);
const Course = require('./course.js')(sequelize, Sequelize);
const Schedule = require('./schedule.js')(sequelize, Sequelize);

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

  module.exports = {Sequelize, sequelize, User, Course};

// 'use strict';

// const fs = require('fs');
// const path = require('path');
// const Sequelize = require('sequelize');
// const process = require('process');
// const basename = path.basename(__filename);
// const env = process.env.NODE_ENV || 'development';
// const config = require(__dirname + '/../config/config.json')[env];
// const db = {};

// let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

// fs
//   .readdirSync(__dirname)
//   .filter(file => {
//     return (
//       file.indexOf('.') !== 0 &&
//       file !== basename &&
//       file.slice(-3) === '.js' &&
//       file.indexOf('.test.js') === -1
//     );
//   })
//   .forEach(file => {
//     const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
//     db[model.name] = model;
//   });

// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// module.exports = db;
