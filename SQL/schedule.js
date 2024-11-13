const { uuid } = require('uuidv4');

module.exports = (sequelize, Sequelize) => {
    const Schedule = sequelize.define('schedule', {
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
            validate: {
                isIn: {
                    args: [['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']],
                    msg: 'Invalid day entered'
                }
            }
        },
        startTime: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                is: {
                    args: /^([01]\d|2[0-3]):([0-5]\d)$/,
                    msg: 'Invalid start time entered'
                }
            }
        },
        endTime:{
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                is: {
                    args: /^([01]\d|2[0-3]):([0-5]\d)$/,
                    msg: 'Invalid end time entered'
                }
            }
        },
    },
    {
        timestamps: false,
        hooks: {
            beforeValidate: async (schedule) => {
                schedule.id = uuid();
            }   
        }
    }
  );
  
    return Schedule;
  };