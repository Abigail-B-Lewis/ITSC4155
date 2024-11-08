module.exports = (sequelize, Sequelize) => {
    const Roster = sequelize.define('roster', {
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users', // Name of the table (not the model)
          key: 'id',
        },
        primaryKey: true,
      },
      courseId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'courses', // Name of the table (not the model)
          key: 'id',
        },
        primaryKey: true,
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false,
        IsIn: [['student', 'ia', 'instructor']],
      },
    },
    {
      timestamps: false,
    });

    return Roster;
};