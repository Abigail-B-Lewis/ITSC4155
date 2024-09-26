module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        fullName: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            },
            unique: true,
        },
        //TODO: Hash pashword prior to storing
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        role: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                isIn: [['instructor', 'student']]
            },
        },
    });

    //TODO: Add association between users and courses -- M:N

    return User;
};