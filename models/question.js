const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, Sequelize) => {
    const Question = sequelize.define('question', {
        id: {
            type: Sequelize.UUID,
            allowNull: false,
            unique: true,
            primaryKey: true
        },
        courseId: {
            type: Sequelize.UUID,
            allowNull: false,   
            references: {
                model: 'courses',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        userId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        text: {
            type: Sequelize.STRING,
            allowNull: false
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        },
        status: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'unclaimed',
            validate: {
                isIn: {
                    args: [['unclaimed', 'claimed', 'resolved', 'unresolved']],
                    msg: 'Invalid day entered'
                }
            }
        },
        tag: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                isIn: {
                    args: [['lab','quiz','prepwork','misc']],
                    msg: 'invalid tag entered'
                }
            }
        }
    }, {
        timestamps: false,
        hooks: {
            beforeValidate: async (question) => {
                question.id = uuidv4();
              },
        }
    });

    return Question;
};