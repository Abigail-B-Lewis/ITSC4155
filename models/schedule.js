const { uuid } = require('uuidv4');

module.exports = (sequelize, Sequelize) => {
    const Schedule = sequelize.define('Schedule', {
        id: {
            type: Sequelize.UUID,
            allowNull: false,
            primaryKey: true,
        },
        courseId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
                model: 'courses',
                key: 'id',
            },
        },
        //Is storing IaId necessary? Do users need to know which IA is available?
        //Current system does list available IAs with schedule.
        IaId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
        },
        day: {
            type: Sequelize.STRING,
            allowNull: false,
            isIn: [['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']],
        },
        startTime: {
            type: Sequelize.STRING,
            allowNull: false,
            is: /^([01]\d|2[0-3]):([0-5]\d)$/,
        },
        endTime:{
            type: Sequelize.STRING,
            allowNull: false,
            is: /^([01]\d|2[0-3]):([0-5]\d)$/,
        },
    },
    {
        timestamps: false,
        hooks: {
            beforeValidate: async (user) => {
                user.id = uuid();
            }   
        }
    }
  );
  
    return Schedule;
  };